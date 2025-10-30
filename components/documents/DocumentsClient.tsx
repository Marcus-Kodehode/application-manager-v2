'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument, deleteDocument, getAllDocuments } from '@/lib/actions/documents';
import Link from 'next/link';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tooltip } from '@/components/ui/Tooltip';

interface Document {
  _id: string;
  userId: string;
  jobId?: string;
  label: string;
  type: string;
  blobUrl: string;
  original: string | null;
  createdAt: string;
}

export function DocumentsClient({ initialDocuments }: { initialDocuments: Document[] }) {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [uploadForm, setUploadForm] = useState({
    label: '',
    type: 'OTHER',
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<{ id: string; message: string } | null>(null);

  // Filter and search documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.original?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await getAllDocuments();
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
      setUploadError('Velg en fil');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('label', uploadForm.label || fileInput.files[0].name);
      formData.append('type', uploadForm.type);

      await uploadDocument(formData);
      
      setUploadForm({ label: '', type: 'OTHER' });
      fileInput.value = '';
      await loadDocuments();
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.message || 'Kunne ikke laste opp fil';
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Er du sikker på at du vil slette dette dokumentet?')) return;

    setDeletingId(documentId);
    setDeleteError(null);
    try {
      await deleteDocument(documentId);
      await loadDocuments();
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.message || 'Kunne ikke slette dokument';
      setDeleteError({ id: documentId, message: errorMessage });
    } finally {
      setDeletingId(null);
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              📄
            </div>
            <div>
              <p className="text-sm text-muted">CV-er</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(d => d.type === 'CV').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              ✉️
            </div>
            <div>
              <p className="text-sm text-muted">Søknader</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(d => d.type === 'COVER_LETTER').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              📎
            </div>
            <div>
              <p className="text-sm text-muted">Andre</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(d => d.type === 'OTHER').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          📤 Last opp nytt dokument
        </h3>
        
        {uploadError && (
          <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                  Opplasting feilet
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                  {uploadError}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  💡 Tips: {
                    uploadError.includes('stor') 
                      ? 'Prøv å komprimere filen eller velg en mindre fil (maks 10MB).'
                      : uploadError.includes('filtype') || uploadError.includes('Ugyldig')
                      ? 'Kun PDF, DOCX, PNG, JPEG og WEBP filer er tillatt.'
                      : uploadError.includes('fil')
                      ? 'Velg en gyldig fil og prøv igjen.'
                      : 'Sjekk internettforbindelsen din og prøv igjen.'
                  }
                </p>
                <button
                  onClick={() => setUploadError('')}
                  className="mt-3 text-sm text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
                >
                  Lukk
                </button>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleUpload} className="space-y-6">
          <fieldset disabled={uploading} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                📎 Velg fil (PDF, DOCX, PNG, JPEG, WEBP - maks 10MB)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.png,.jpg,.jpeg,.webp"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted mt-2">💡 Tips: Gi filen et beskrivende navn for enkel gjenfinning senere</p>
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
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                >
                  <option value="CV">📄 CV</option>
                  <option value="COVER_LETTER">✉️ Søknad</option>
                  <option value="OTHER">📎 Annet</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <LoadingButton
                type="submit"
                loading={uploading}
                className="shadow-sm hover:shadow"
              >
                {uploading ? 'Laster opp...' : '📤 Last opp dokument'}
              </LoadingButton>
            </div>
          </fieldset>
        </form>
      </div>

      {/* Search and Filter */}
      {documents.length > 0 && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                🔍 Søk i dokumenter
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk etter navn eller filnavn..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
              />
            </div>
            
            <div className="md:w-64">
              <label className="block text-sm font-medium text-foreground mb-2">
                🏷️ Filtrer etter type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
              >
                <option value="ALL">Alle typer</option>
                <option value="CV">📄 CV</option>
                <option value="COVER_LETTER">✉️ Søknad</option>
                <option value="OTHER">📎 Annet</option>
              </select>
            </div>
          </div>
          
          {searchQuery && (
            <div className="mt-4 flex items-center gap-2">
              <p className="text-sm text-muted">
                Viser {filteredDocuments.length} av {documents.length} dokumenter
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
              >
                Nullstill søk
              </button>
            </div>
          )}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-muted">Laster dokumenter...</p>
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 transition-colors">
            <EmptyState
              emoji="📁"
              heading="Ingen dokumenter ennå"
              description="Last opp ditt første dokument ovenfor for å komme i gang. Du kan laste opp CV-er, søknader og andre relevante filer."
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                📚 Alle dokumenter ({documents.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.length === 0 ? (
                <div className="col-span-full bg-card rounded-xl shadow-sm border border-border p-12 transition-colors">
                  <EmptyState
                    emoji="🔍"
                    heading="Ingen dokumenter funnet"
                    description="Ingen dokumenter matcher søket eller filteret ditt. Prøv å justere søket eller fjern filteret."
                  />
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                <div key={doc._id} className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md group">
                  <div className="flex flex-col h-full">
                    {/* Icon and Type Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                        {typeLabels[doc.type]}
                      </span>
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 mb-4">
                      <h4 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{doc.label}</h4>
                      <p className="text-sm text-muted mb-2 truncate">{doc.original}</p>
                      
                      {doc.jobId && (
                        <Link 
                          href={`/jobs/${doc.jobId}`}
                          className="text-xs text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors mb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                        >
                          🔗 Koblet til jobb →
                        </Link>
                      )}
                      
                      <p className="text-xs text-muted flex items-center gap-1">
                        🕒 {new Date(doc.createdAt).toLocaleDateString('nb-NO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Error Message */}
                    {deleteError && deleteError.id === doc._id && (
                      <div className="mb-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">⚠️</span>
                          <div className="flex-1">
                            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                              {deleteError.message}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(doc._id)}
                                className="text-xs text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
                              >
                                🔄 Prøv igjen
                              </button>
                              <button
                                onClick={() => setDeleteError(null)}
                                className="text-xs text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
                              >
                                Lukk
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Tooltip content="Åpne dokument i ny fane">
                        <a
                          href={doc.blobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 text-sm text-primary hover:text-primary/80 border border-primary rounded-lg hover:bg-primary/10 font-medium transition-all text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          👁️ Åpne
                        </a>
                      </Tooltip>
                      <Tooltip content="Slett dokument permanent">
                        <button
                          onClick={() => handleDelete(doc._id)}
                          disabled={deletingId === doc._id}
                          className="px-4 py-2 text-sm text-destructive hover:text-destructive/80 border border-destructive rounded-lg hover:bg-destructive/10 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                          aria-label="Slett dokument"
                        >
                          {deletingId === doc._id && <Spinner size="sm" />}
                          {deletingId === doc._id ? '...' : '🗑️'}
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
