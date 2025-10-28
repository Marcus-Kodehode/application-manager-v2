'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument, deleteDocument, getAllDocuments } from '@/lib/actions/documents';
import Link from 'next/link';

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
  const [uploadForm, setUploadForm] = useState({
    label: '',
    type: 'OTHER',
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
      alert('Velg en fil');
      return;
    }

    setUploading(true);
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

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Last opp nytt dokument</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fil (PDF, DOCX, PNG, JPEG, WEBP - maks 10MB)
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg,.webp"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Navn
              </label>
              <input
                type="text"
                value={uploadForm.label}
                onChange={(e) => setUploadForm({ ...uploadForm, label: e.target.value })}
                placeholder="F.eks. CV 2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CV">CV</option>
                <option value="COVER_LETTER">Søknad</option>
                <option value="OTHER">Annet</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Laster opp...' : 'Last opp'}
            </button>
          </div>
        </form>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Ingen dokumenter ennå. Last opp ditt første dokument ovenfor!</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">{getFileIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900">{doc.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {typeLabels[doc.type]} • {doc.original}
                    </p>
                    {doc.jobId && (
                      <Link 
                        href={`/jobs/${doc.jobId}`}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                      >
                        Koblet til jobb →
                      </Link>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Lastet opp {new Date(doc.createdAt).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={doc.blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    Åpne
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded hover:bg-red-50"
                  >
                    Slett
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
