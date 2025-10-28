import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DocumentsClient } from '@/components/documents/DocumentsClient';
import { getAllDocuments } from '@/lib/actions/documents';

export default async function DocumentsPage() {
  const documents = await getAllDocuments();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mine Dokumenter</h1>
        <DocumentsClient initialDocuments={documents} />
      </main>

      <Footer />
    </div>
  );
}
