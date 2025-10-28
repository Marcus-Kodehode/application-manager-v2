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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Oversikt</h2>
            <p className="text-gray-600">{jobs.length} aktive søknader</p>
          </div>
          <Link
            href="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Ny Jobb
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">Ingen jobber ennå</p>
            <Link
              href="/jobs/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Opprett din første jobb
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kanban Board - Left Side (2/3) */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Kanban</h3>
                <Link href="/jobs" className="text-sm text-blue-600 hover:text-blue-700">
                  Se alle →
                </Link>
              </div>
              <KanbanBoard jobs={jobs} />
            </div>

            {/* Sidebar - Right Side (1/3) */}
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Neste oppgaver</h3>
                {upcomingTasks.length === 0 ? (
                  <p className="text-gray-500 text-sm">Ingen kommende oppgaver</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingTasks.map((task: any) => (
                      <div key={task._id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(task.dueAt).toLocaleDateString('nb-NO', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        {task.jobId && (
                          <Link
                            href={`/jobs/${task.jobId}`}
                            className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-block"
                          >
                            Se jobb →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📄 Siste dokumenter</h3>
                  <Link href="/documents" className="text-xs text-blue-600 hover:text-blue-700">
                    Se alle →
                  </Link>
                </div>
                {recentDocuments.length === 0 ? (
                  <p className="text-gray-500 text-sm">Ingen dokumenter ennå</p>
                ) : (
                  <div className="space-y-3">
                    {recentDocuments.map((doc: any) => (
                      <div key={doc._id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 text-sm truncate">{doc.label}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.type === 'CV' ? '📄 CV' : doc.type === 'COVER_LETTER' ? '✉️ Søknad' : '📎 Annet'}
                        </p>
                        <a
                          href={doc.blobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-block"
                        >
                          Åpne →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Statistikk</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Totalt søknader</span>
                    <span className="font-semibold text-gray-900">{jobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aktive prosesser</span>
                    <span className="font-semibold text-gray-900">
                      {jobs.filter(j => j.status === 'SCREENING' || j.status === 'INTERVIEW').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kommende oppgaver</span>
                    <span className="font-semibold text-gray-900">{upcomingTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dokumenter</span>
                    <span className="font-semibold text-gray-900">{allDocuments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CV-er</span>
                    <span className="font-semibold text-gray-900">
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
