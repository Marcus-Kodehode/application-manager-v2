'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNote, deleteNote, getNotesByJob } from '@/lib/actions/notes';

export function NotesTab({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [jobId]);

  const loadNotes = async () => {
    try {
      const data = await getNotesByJob(jobId);
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      await createNote({ jobId, content: newNote });
      setNewNote('');
      await loadNotes();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke legge til notat');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Er du sikker på at du vil slette dette notatet?')) return;

    try {
      await deleteNote(noteId);
      await loadNotes();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke slette notat');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Laster notater...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          ✍️ Legg til notat
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Skriv ditt notat her... F.eks. 'Hadde et godt intervju, de virket interesserte i min erfaring med React.'"
            rows={5}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted">
              💡 Tips: Notater hjelper deg å huske viktige detaljer fra samtaler og møter
            </p>
            <button
              type="submit"
              disabled={submitting || !newNote.trim()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-sm hover:shadow"
            >
              {submitting ? '⏳ Lagrer...' : '💾 Lagre notat'}
            </button>
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center transition-colors">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-muted text-lg mb-2">Ingen notater ennå</p>
            <p className="text-muted text-sm">Legg til ditt første notat ovenfor for å holde oversikt!</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              📚 Dine notater ({notes.length})
            </h3>
            {notes.map((note) => (
              <div key={note._id} className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all hover:shadow-md group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <span>🕒</span>
                    <time>
                      {new Date(note.createdAt).toLocaleDateString('nb-NO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-sm text-destructive hover:text-destructive/80 font-medium opacity-0 group-hover:opacity-100 transition-all px-3 py-1 rounded hover:bg-destructive/10"
                  >
                    🗑️ Slett
                  </button>
                </div>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{note.content}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
