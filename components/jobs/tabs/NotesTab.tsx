'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNote, deleteNote, getNotesByJob } from '@/lib/actions/notes';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tooltip } from '@/components/ui/Tooltip';

export function NotesTab({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

    setDeletingId(noteId);
    try {
      await deleteNote(noteId);
      await loadNotes();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke slette notat');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
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
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {submitting ? '⏳ Lagrer...' : '💾 Lagre notat'}
            </button>
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 transition-colors">
            <EmptyState
              emoji="📝"
              heading="Ingen notater ennå"
              description="Legg til ditt første notat ovenfor for å holde oversikt over viktige detaljer fra samtaler og møter."
            />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              📚 Dine notater ({notes.length})
            </h3>
            {notes.map((note) => (
              <div key={note._id} className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md group">
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
                  <Tooltip content="Slett dette notatet permanent">
                    <button
                      onClick={() => handleDelete(note._id)}
                      disabled={deletingId === note._id}
                      className="text-sm text-destructive hover:text-destructive/80 font-medium opacity-0 group-hover:opacity-100 transition-colors duration-200 px-3 py-1 rounded hover:bg-destructive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                      aria-label="Slett notat"
                    >
                      {deletingId === note._id && <Spinner size="sm" />}
                      {deletingId === note._id ? 'Sletter...' : '🗑️ Slett'}
                    </button>
                  </Tooltip>
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
