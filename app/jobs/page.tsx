import Link from 'next/link';
import { getJobs } from '@/lib/actions/jobs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JobsFilter } from '@/components/jobs/JobsFilter';
import { CSVManager } from '@/components/jobs/CSVManager';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Mine Jobber</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {jobs.length}
              </span>
              {jobs.length === 1 ? 'søknad' : 'søknader'} totalt
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="group px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors duration-200 shadow-sm hover:shadow-md font-medium inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="text-xl">+</span>
            Ny Jobb
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-16 mb-8">
            <EmptyState
              emoji="💼"
              heading="Ingen jobber ennå"
              description="Kom i gang ved å legge til din første jobbsøknad, eller importer flere jobber fra CSV nedenfor"
              action={
                <Link
                  href="/jobs/new"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Opprett din første jobb
                </Link>
              }
            />
          </div>
        ) : (
          <JobsFilter jobs={jobs} />
        )}

        {/* Export/Import - Bottom of page */}
        <div className="mt-8 pt-8 border-t border-border">
          <CSVManager jobs={jobs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
