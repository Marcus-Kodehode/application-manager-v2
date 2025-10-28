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
    return <div className="text-center py-8 text-gray-500">Laster notater...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legg til notat</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Skriv ditt notat her..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newNote.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Lagrer...' : 'Legg til notat'}
            </button>
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Ingen notater ennå. Legg til ditt første notat ovenfor!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString('nb-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Slett
                </button>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
