import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getJobs } from '@/lib/actions/jobs';
import { getUpcomingTasks } from '@/lib/actions/tasks';
import { getAllDocuments } from '@/lib/actions/documents';
import { KanbanBoard } from '@/components/jobs/KanbanBoard';

export default async function DashboardPage() {
  const jobs = await getJobs();
  const upcomingTasks = await getUpcomingTasks(3);
  const allDocuments = await getAllDocuments();
  const recentDocuments = allDocuments.slice(0, 3);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Oversikt</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {jobs.length}
              </span>
              aktive søknader
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="group px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm hover:shadow-md font-medium inline-flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Ny Jobb
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Ingen jobber ennå</h3>
              <p className="text-muted-foreground mb-6">
                Kom i gang ved å legge til din første jobbsøknad
              </p>
              <Link
                href="/jobs/new"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
              >
                Opprett din første jobb
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kanban Board - Left Side (2/3) */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Kanban Board</h3>
                <Link 
                  href="/jobs" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1 group"
                >
                  Se alle
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              <KanbanBoard jobs={jobs} />
            </div>

            {/* Sidebar - Right Side (1/3) */}
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span>📅</span>
                  Neste oppgaver
                </h3>
                {upcomingTasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Ingen kommende oppgaver</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingTasks.map((task: any) => (
                      <div key={task._id} className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                        <p className="font-semibold text-foreground text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(task.dueAt).toLocaleDateString('nb-NO', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        {task.jobId && (
                          <Link
                            href={`/jobs/${task.jobId}`}
                            className="text-xs text-primary hover:text-primary/80 mt-2 inline-flex items-center gap-1 group"
                          >
                            Se jobb
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Documents */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span>📄</span>
                    Siste dokumenter
                  </h3>
                  <Link 
                    href="/documents" 
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1 group"
                  >
                    Se alle
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
                {recentDocuments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Ingen dokumenter ennå</p>
                ) : (
                  <div className="space-y-3">
                    {recentDocuments.map((doc: any) => (
                      <div key={doc._id} className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                        <p className="font-semibold text-foreground text-sm truncate">{doc.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {doc.type === 'CV' ? '📄 CV' : doc.type === 'COVER_LETTER' ? '✉️ Søknad' : '📎 Annet'}
                        </p>
                        <a
                          href={doc.blobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:text-primary/80 mt-2 inline-flex items-center gap-1 group"
                        >
                          Åpne
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Statistikk
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <span className="text-muted-foreground">Totalt søknader</span>
                    <span className="font-bold text-foreground text-lg">{jobs.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <span className="text-muted-foreground">Aktive prosesser</span>
                    <span className="font-bold text-primary text-lg">
                      {jobs.filter(j => j.status === 'SCREENING' || j.status === 'INTERVIEW').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <span className="text-muted-foreground">Kommende oppgaver</span>
                    <span className="font-bold text-foreground text-lg">{upcomingTasks.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <span className="text-muted-foreground">Dokumenter</span>
                    <span className="font-bold text-foreground text-lg">{allDocuments.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <span className="text-muted-foreground">CV-er</span>
                    <span className="font-bold text-foreground text-lg">
                      {allDocuments.filter((d: any) => d.type === 'CV').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
