import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DocumentsClient } from '@/components/documents/DocumentsClient';
import { getAllDocuments } from '@/lib/actions/documents';

export default async function DocumentsPage() {
  const documents = await getAllDocuments();

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">📁 Mine Dokumenter</h1>
          <p className="text-muted text-lg">Administrer dine CV-er, søknader og andre dokumenter</p>
        </div>
        <DocumentsClient initialDocuments={documents} />
      </main>

      <Footer />
    </div>
  );
}
