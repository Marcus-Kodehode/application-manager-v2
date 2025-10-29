import Link from 'next/link';
import { getJobs } from '@/lib/actions/jobs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JobsFilter } from '@/components/jobs/JobsFilter';
import { CSVManager } from '@/components/jobs/CSVManager';

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mine Jobber</h1>
          <div className="flex gap-3">
            <Link
              href="/jobs/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Ny Jobb
            </Link>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">Ingen jobber ennå</p>
            <div className="space-y-3">
              <Link
                href="/jobs/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Opprett din første jobb
              </Link>
              <p className="text-sm text-gray-500">eller importer fra CSV nedenfor</p>
            </div>
          </div>
        ) : (
          <JobsFilter jobs={jobs} />
        )}

        {/* Export/Import - Bottom of page */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <CSVManager jobs={jobs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
