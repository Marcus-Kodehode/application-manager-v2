// Note: Tailwind linter warnings about bg-gradient-to-* are false positives
// bg-gradient-to-br is the correct Tailwind CSS class, not bg-linear-to-br
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getJobs } from "@/lib/actions/jobs";
import { getUpcomingTasks } from "@/lib/actions/tasks";
import { getAllDocuments } from "@/lib/actions/documents";
import { KanbanBoard } from "@/components/jobs/KanbanBoard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IDocument } from "@/lib/models/Document";

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
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Oversikt
            </h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {jobs.length}
              </span>
              aktive søknader
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
          <div className="bg-card rounded-xl shadow-sm border border-border p-16">
            <EmptyState
              emoji="📋"
              heading="Ingen jobber ennå"
              description="Kom i gang ved å legge til din første jobbsøknad og hold oversikt over søknadsprosessen din"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Kanban Board (8/12 = 2/3) */}
            <div className="lg:col-span-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">
                  Kanban Board
                </h3>
                <Link
                  href="/jobs"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
                >
                  Se alle
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
              <KanbanBoard jobs={jobs} showStats={false} />
            </div>

            {/* Right Column - Tasks, Documents & Stats (4/12 = 1/3) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Upcoming Tasks */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6 hover:shadow-md transition-all duration-200">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <span>Neste oppgaver</span>
                </h3>
                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✨</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Ingen kommende oppgaver
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Du er helt à jour! 🎉
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => {
                      const dueDate = new Date(task.dueAt);
                      const today = new Date();
                      const isOverdue = dueDate < today;
                      const isDueSoon =
                        !isOverdue &&
                        dueDate.getTime() - today.getTime() <
                          3 * 24 * 60 * 60 * 1000;

                      return (
                        <div
                          key={task._id}
                          className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:scale-[1.02] ${
                            isOverdue
                              ? "bg-red-50 dark:bg-red-950/20 border-red-500 dark:border-red-600"
                              : isDueSoon
                              ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500 dark:border-yellow-600"
                              : "bg-white dark:bg-gray-800/50 border-blue-500 dark:border-blue-600"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex-1">
                              {task.title}
                            </p>
                            {isOverdue && (
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                Forfalt
                              </span>
                            )}
                            {isDueSoon && !isOverdue && (
                              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                                Snart
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <span>🗓️</span>
                            {dueDate.toLocaleDateString("nb-NO", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          {task.jobId && (
                            <Link
                              href={`/jobs/${task.jobId}`}
                              className="text-xs text-primary hover:text-primary/80 mt-2 inline-flex items-center gap-1 group font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                            >
                              Se jobb
                              <span className="group-hover:translate-x-1 transition-transform">
                                →
                              </span>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Documents */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    <span>Siste dokumenter</span>
                  </h3>
                  <Link
                    href="/documents"
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
                  >
                    Se alle
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
                {recentDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📁</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Ingen dokumenter ennå
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last opp CV og søknader
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDocuments.map((doc: IDocument & { _id: string }) => (
                      <div
                        key={doc._id}
                        className="p-4 bg-white dark:bg-gray-800/50 rounded-lg hover:scale-[1.02] transition-all duration-200 border border-purple-100 dark:border-purple-900/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex items-center justify-center shrink-0">
                            <span className="text-xl">
                              {doc.type === "CV"
                                ? "📄"
                                : doc.type === "COVER_LETTER"
                                ? "✉️"
                                : "📎"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                              {doc.label}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {doc.type === "CV"
                                ? "CV"
                                : doc.type === "COVER_LETTER"
                                ? "Søknad"
                                : "Annet"}
                            </p>
                            <a
                              href={doc.blobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-primary/80 mt-2 inline-flex items-center gap-1 group font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                            >
                              <span>👁️</span>
                              Åpne
                              <span className="group-hover:translate-x-1 transition-transform">
                                →
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl shadow-sm border border-green-200 dark:border-green-800 p-6 hover:shadow-md transition-all duration-200">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span>Statistikk</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800/50 hover:scale-[1.02] transition-all duration-200 border border-green-100 dark:border-green-900/50">
                    <span className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                      <span>📋</span>
                      Totalt søknader
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-xl">
                      {jobs.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 hover:scale-[1.02] transition-all duration-200 border border-blue-200 dark:border-blue-800">
                    <span className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                      <span>🔥</span>
                      Aktive prosesser
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">
                      {
                        jobs.filter(
                          (j) =>
                            j.status === "SCREENING" || j.status === "INTERVIEW"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800/50 hover:scale-[1.02] transition-all duration-200 border border-green-100 dark:border-green-900/50">
                    <span className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                      <span>✅</span>
                      Kommende oppgaver
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-xl">
                      {upcomingTasks.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800/50 hover:scale-[1.02] transition-all duration-200 border border-green-100 dark:border-green-900/50">
                    <span className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                      <span>📁</span>
                      Dokumenter
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-xl">
                      {allDocuments.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800/50 hover:scale-[1.02] transition-all duration-200 border border-green-100 dark:border-green-900/50">
                    <span className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                      <span>📄</span>
                      CV-er
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-xl">
                      {
                        allDocuments.filter((d: IDocument) => d.type === "CV")
                          .length
                      }
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
