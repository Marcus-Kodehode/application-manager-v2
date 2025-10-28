import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mine Dokumenter</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            📄 Dokumenthåndtering kommer snart! Her kan du laste opp og administrere CV, søknader og andre dokumenter.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
