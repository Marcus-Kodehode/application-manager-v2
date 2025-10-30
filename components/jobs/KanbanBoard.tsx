'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { moveJobStatus } from '@/lib/actions/jobs';
import { JobStatus } from '@/lib/models';

interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  status: string;
}

interface KanbanBoardProps {
  jobs: Job[];
  showStats?: boolean;
}

const statusLabels: Record<string, string> = {
  [JobStatus.APPLIED]: 'Søkt',
  [JobStatus.SCREENING]: 'Screening',
  [JobStatus.INTERVIEW]: 'Intervju',
  [JobStatus.OFFER]: 'Tilbud',
  [JobStatus.REJECTED]: 'Avvist',
  [JobStatus.ON_HOLD]: 'På vent',
};

const statusEmojis: Record<string, string> = {
  [JobStatus.APPLIED]: '📤',
  [JobStatus.SCREENING]: '🔍',
  [JobStatus.INTERVIEW]: '💬',
  [JobStatus.OFFER]: '🎉',
  [JobStatus.REJECTED]: '❌',
  [JobStatus.ON_HOLD]: '⏸️',
};

const statusColors: Record<string, { bg: string; border: string; text: string; badge: string; hover: string }> = {
  [JobStatus.APPLIED]: {
    bg: 'bg-blue-100/80 dark:bg-blue-950/30',
    border: 'border-blue-300 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-300',
    badge: 'bg-blue-200 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700',
    hover: 'hover:bg-blue-200/80 dark:hover:bg-blue-900/40',
  },
  [JobStatus.SCREENING]: {
    bg: 'bg-amber-100/80 dark:bg-amber-950/30',
    border: 'border-amber-300 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-300',
    badge: 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700',
    hover: 'hover:bg-amber-200/80 dark:hover:bg-amber-900/40',
  },
  [JobStatus.INTERVIEW]: {
    bg: 'bg-purple-100/80 dark:bg-purple-950/30',
    border: 'border-purple-300 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-300',
    badge: 'bg-purple-200 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700',
    hover: 'hover:bg-purple-200/80 dark:hover:bg-purple-900/40',
  },
  [JobStatus.OFFER]: {
    bg: 'bg-emerald-100/80 dark:bg-emerald-950/30',
    border: 'border-emerald-300 dark:border-emerald-800',
    text: 'text-emerald-900 dark:text-emerald-300',
    badge: 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700',
    hover: 'hover:bg-emerald-200/80 dark:hover:bg-emerald-900/40',
  },
  [JobStatus.REJECTED]: {
    bg: 'bg-rose-100/80 dark:bg-rose-950/30',
    border: 'border-rose-300 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-300',
    badge: 'bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-700',
    hover: 'hover:bg-rose-200/80 dark:hover:bg-rose-900/40',
  },
  [JobStatus.ON_HOLD]: {
    bg: 'bg-slate-100/80 dark:bg-slate-950/30',
    border: 'border-slate-300 dark:border-slate-800',
    text: 'text-slate-900 dark:text-slate-300',
    badge: 'bg-slate-200 dark:bg-slate-900/60 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    hover: 'hover:bg-slate-200/80 dark:hover:bg-slate-900/40',
  },
};

export function KanbanBoard({ jobs, showStats = true }: KanbanBoardProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const jobsByStatus = {
    [JobStatus.APPLIED]: jobs.filter(j => j.status === JobStatus.APPLIED),
    [JobStatus.SCREENING]: jobs.filter(j => j.status === JobStatus.SCREENING),
    [JobStatus.INTERVIEW]: jobs.filter(j => j.status === JobStatus.INTERVIEW),
    [JobStatus.OFFER]: jobs.filter(j => j.status === JobStatus.OFFER),
    [JobStatus.REJECTED]: jobs.filter(j => j.status === JobStatus.REJECTED),
    [JobStatus.ON_HOLD]: jobs.filter(j => j.status === JobStatus.ON_HOLD),
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveId(null);

    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as string;

    // Find the job to get its current status
    const job = jobs.find(j => j._id === jobId);
    if (!job || job.status === newStatus) return;

    try {
      await moveJobStatus(jobId, newStatus);
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke flytte jobb');
    }
  };

  const activeJob = activeId ? jobs.find(j => j._id === activeId) : null;

  // Calculate statistics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => 
    j.status !== JobStatus.REJECTED && j.status !== JobStatus.ON_HOLD
  ).length;
  const successRate = totalJobs > 0 
    ? Math.round((jobsByStatus[JobStatus.OFFER].length / totalJobs) * 100) 
    : 0;

  return (
    <div className={showStats ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : ""}>
      {/* Kanban Board - Left Side with Horizontal Scroll */}
      <div className={showStats ? "lg:col-span-9" : ""}>
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Horizontal scrollable container */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {Object.entries(jobsByStatus).map(([status, statusJobs]) => (
                <div key={status} className="w-80 flex-shrink-0">
                  <KanbanColumn
                    status={status}
                    label={statusLabels[status]}
                    emoji={statusEmojis[status]}
                    jobs={statusJobs}
                    colors={statusColors[status]}
                  />
                </div>
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeJob && (
              <div className="bg-card p-4 rounded-xl shadow-2xl border-2 border-primary opacity-95 transition-all w-80">
                <h3 className="font-semibold text-foreground">{activeJob.title}</h3>
                <p className="text-sm text-muted mt-1">{activeJob.company}</p>
                {activeJob.location && (
                  <p className="text-xs text-muted mt-1">📍 {activeJob.location}</p>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Combined Stats Panel - Right Side */}
      {showStats && <div className="lg:col-span-3">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors space-y-6">
          {/* Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              📊 Statistikk
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted mb-1">Totalt søknader</p>
                <p className="text-2xl font-bold text-foreground">{totalJobs}</p>
              </div>
              
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted mb-1">Aktive søknader</p>
                <p className="text-2xl font-bold text-primary">{activeJobs}</p>
              </div>
              
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted mb-1">Tilbudsrate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{successRate}%</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Status Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              📈 Oversikt
            </h3>
            
            <div className="space-y-2">
              {Object.entries(jobsByStatus).map(([status, statusJobs]) => (
                <div key={status} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{statusEmojis[status]}</span>
                    <span className="text-sm text-foreground">{statusLabels[status]}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[status].badge}`}>
                    {statusJobs.length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              ⚡ Hurtigvalg
            </h3>
            
            <div className="space-y-2">
              <Link
                href="/jobs/new"
                className="block w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-center font-medium text-sm shadow-sm hover:shadow"
              >
                ➕ Ny søknad
              </Link>
              
              <Link
                href="/documents"
                className="block w-full px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all text-center font-medium text-sm border border-border"
              >
                📁 Dokumenter
              </Link>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

function KanbanColumn({ 
  status, 
  label, 
  emoji,
  jobs, 
  colors 
}: { 
  status: string; 
  label: string; 
  emoji: string;
  jobs: Job[]; 
  colors: { bg: string; border: string; text: string; badge: string; hover: string };
}) {
  const { useDroppable } = require('@dnd-kit/core');
  
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setDroppableRef}
      className={`rounded-xl border-2 p-4 min-h-[600px] transition-all ${colors.bg} ${colors.border} ${
        isOver ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-current/20">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <h2 className={`font-bold text-sm ${colors.text}`}>
            {label}
          </h2>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
          {jobs.length}
        </span>
      </div>

      {/* Jobs List */}
      <div className="space-y-2">
        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3 opacity-30">{emoji}</div>
            <p className="text-sm text-muted font-medium">Ingen jobber</p>
            <p className="text-xs text-muted mt-1">Dra en jobb hit</p>
          </div>
        ) : (
          jobs.map((job) => <DraggableJobCard key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
}

function DraggableJobCard({ job }: { job: Job }) {
  const { useDraggable } = require('@dnd-kit/core');
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card rounded-lg hover:shadow-md transition-all border border-border group"
      suppressHydrationWarning
    >
      <div className="flex items-start gap-2 p-3">
        {/* Drag Handle */}
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted hover:text-foreground transition-colors flex-shrink-0 p-1 hover:bg-accent rounded"
          title="Dra for å flytte"
          suppressHydrationWarning
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
        
        {/* Job Content - Clickable */}
        <Link 
          href={`/jobs/${job._id}`} 
          className="flex-1 min-w-0 group/link"
        >
          <h3 className="font-semibold text-foreground group-hover/link:text-primary truncate transition-colors text-sm">
            {job.title}
          </h3>
          <p className="text-xs text-muted truncate mt-1">
            {job.company}
          </p>
          {job.location && (
            <p className="text-xs text-muted mt-0.5 truncate">
              📍 {job.location}
            </p>
          )}
        </Link>
      </div>
    </div>
  );
}
