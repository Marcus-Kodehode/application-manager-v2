import Link from 'next/link';
import { JobForm } from '@/components/jobs/JobForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <Link href="/jobs" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-1">
            ← Tilbake til jobber
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">✨ Ny Jobbsøknad</h1>
          <p className="text-muted text-lg">Registrer en ny jobb du har søkt på eller planlegger å søke på</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8 transition-colors">
          <JobForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
