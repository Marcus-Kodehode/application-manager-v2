'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument, deleteDocument, getDocumentsByJob } from '@/lib/actions/documents';

export function FilesTab({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    label: '',
    type: 'OTHER',
  });

  useEffect(() => {
    loadDocuments();
  }, [jobId]);

  const loadDocuments = async () => {
    try {
      const data = await getDocumentsByJob(jobId);
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Velg en fil');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('label', uploadForm.label || fileInput.files[0].name);
      formData.append('type', uploadForm.type);
      formData.append('jobId', jobId);

      await uploadDocument(formData);
      
      setUploadForm({ label: '', type: 'OTHER' });
      fileInput.value = '';
      await loadDocuments();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke laste opp fil');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Er du sikker på at du vil slette dette dokumentet?')) return;

    try {
      await deleteDocument(documentId);
      await loadDocuments();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke slette dokument');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'CV':
        return '📄';
      case 'COVER_LETTER':
        return '✉️';
      default:
        return '📎';
    }
  };

  const typeLabels: Record<string, string> = {
    CV: 'CV',
    COVER_LETTER: 'Søknad',
    OTHER: 'Annet',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Laster dokumenter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          📤 Last opp dokument
        </h3>
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              📎 Velg fil (PDF, DOCX, PNG, JPEG, WEBP - maks 10MB)
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg,.webp"
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
            />
            <p className="text-xs text-muted mt-2">💡 Tips: Gi filen et beskrivende navn for enkel gjenfinning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Navn (valgfritt)
              </label>
              <input
                type="text"
                value={uploadForm.label}
                onChange={(e) => setUploadForm({ ...uploadForm, label: e.target.value })}
                placeholder="F.eks. CV 2025, Søknad Utvikler"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
              >
                <option value="CV">📄 CV</option>
                <option value="COVER_LETTER">✉️ Søknad</option>
                <option value="OTHER">📎 Annet</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 shadow-sm hover:shadow"
            >
              {uploading ? '⏳ Laster opp...' : '📤 Last opp'}
            </button>
          </div>
        </form>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center transition-colors">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-muted text-lg mb-2">Ingen dokumenter ennå</p>
            <p className="text-muted text-sm">Last opp CV, søknad eller andre relevante dokumenter!</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              📁 Dine dokumenter ({documents.length})
            </h3>
            {documents.map((doc) => (
              <div key={doc._id} className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-foreground truncate">{doc.label}</h4>
                      <p className="text-sm text-muted mt-1">
                        <span className="font-medium">{typeLabels[doc.type]}</span> • {doc.original}
                      </p>
                      <p className="text-xs text-muted mt-2 flex items-center gap-1">
                        🕒 Lastet opp {new Date(doc.createdAt).toLocaleDateString('nb-NO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={doc.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm text-primary hover:text-primary/80 border border-primary rounded-lg hover:bg-primary/10 font-medium transition-all"
                    >
                      👁️ Åpne
                    </a>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="px-4 py-2 text-sm text-destructive hover:text-destructive/80 border border-destructive rounded-lg hover:bg-destructive/10 font-medium transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
