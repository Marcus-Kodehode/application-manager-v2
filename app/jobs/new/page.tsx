import Link from 'next/link';
import { JobForm } from '@/components/jobs/JobForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Tilbake til jobber
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Ny Jobbsøknad</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <JobForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
