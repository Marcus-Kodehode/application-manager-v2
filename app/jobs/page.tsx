import Link from 'next/link';
import { getJobs } from '@/lib/actions/jobs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { KanbanBoard } from '@/components/jobs/KanbanBoard';

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mine Jobber</h1>
          <Link
            href="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Ny Jobb
          </Link>
        </div>

        <KanbanBoard jobs={jobs} />
      </main>

      <Footer />
    </div>
  );
}
