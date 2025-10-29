import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/actions/jobs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JobDetailClient } from '@/components/jobs/JobDetailClient';

export default async function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <JobDetailClient job={job} />
      </main>

      <Footer />
    </div>
  );
}
