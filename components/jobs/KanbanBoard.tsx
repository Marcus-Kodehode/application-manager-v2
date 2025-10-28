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
}

const statusLabels: Record<string, string> = {
  [JobStatus.APPLIED]: 'Søkt',
  [JobStatus.SCREENING]: 'Screening',
  [JobStatus.INTERVIEW]: 'Intervju',
  [JobStatus.OFFER]: 'Tilbud',
  [JobStatus.REJECTED]: 'Avvist',
  [JobStatus.ON_HOLD]: 'På vent',
};

const statusColors: Record<string, string> = {
  [JobStatus.APPLIED]: 'bg-blue-50 border-blue-200',
  [JobStatus.SCREENING]: 'bg-yellow-50 border-yellow-200',
  [JobStatus.INTERVIEW]: 'bg-purple-50 border-purple-200',
  [JobStatus.OFFER]: 'bg-green-50 border-green-200',
  [JobStatus.REJECTED]: 'bg-red-50 border-red-200',
  [JobStatus.ON_HOLD]: 'bg-gray-50 border-gray-200',
};

export function KanbanBoard({ jobs }: KanbanBoardProps) {
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

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(jobsByStatus).map(([status, statusJobs]) => (
          <KanbanColumn
            key={status}
            status={status}
            label={statusLabels[status]}
            jobs={statusJobs}
            color={statusColors[status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob && (
          <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-blue-500 opacity-90">
            <h3 className="font-medium text-gray-900">{activeJob.title}</h3>
            <p className="text-sm text-gray-600">{activeJob.company}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ status, label, jobs, color }: { status: string; label: string; jobs: Job[]; color: string }) {
  const { useDroppable } = require('@dnd-kit/core');
  const { useDraggable } = require('@dnd-kit/core');
  
  const { setNodeRef: setDroppableRef } = useDroppable({ id: status });

  return (
    <div
      ref={setDroppableRef}
      className={`rounded-lg border-2 p-4 min-h-[400px] ${color}`}
    >
      <h2 className="font-semibold text-gray-900 mb-4">
        {label} ({jobs.length})
      </h2>
      <div className="space-y-3">
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">Ingen jobber</p>
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
      className="bg-white p-3 rounded-lg hover:shadow-md transition-shadow border border-gray-200 group"
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          {...listeners}
          {...attributes}
          className="mt-1 cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0"
          title="Dra for å flytte"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
        
        {/* Job Content - Clickable */}
        <Link href={`/jobs/${job._id}`} className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 hover:text-blue-600 truncate">{job.title}</h3>
          <p className="text-sm text-gray-600 truncate">{job.company}</p>
          {job.location && (
            <p className="text-xs text-gray-500 mt-1 truncate">{job.location}</p>
          )}
        </Link>
      </div>
    </div>
  );
}
