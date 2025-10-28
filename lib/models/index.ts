import mongoose from 'mongoose';

// Enums
export enum JobStatus {
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
}

export enum EventType {
  STATUS_CHANGED = 'STATUS_CHANGED',
  NOTE_ADDED = 'NOTE_ADDED',
  TASK_ADDED = 'TASK_ADDED',
  TASK_DONE = 'TASK_DONE',
  FILE_ATTACHED = 'FILE_ATTACHED',
}

// Interfaces
export interface IJob {
  userId: string;
  title: string;
  company: string;
  location?: string;
  remote: boolean;
  source?: string;
  status: JobStatus;
  salaryNote?: string;
  tags: string[];
  url?: string;
  appliedAt?: Date;
  nextActionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  userId: string;
  jobId: mongoose.Types.ObjectId;
  type: EventType;
  payload?: Record<string, any>;
  at: Date;
}

// Schemas
const jobSchema = new mongoose.Schema<IJob>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    remote: { type: Boolean, default: false },
    source: String,
    status: { 
      type: String, 
      enum: Object.values(JobStatus), 
      default: JobStatus.APPLIED,
      index: true 
    },
    salaryNote: String,
    tags: { type: [String], default: [] },
    url: String,
    appliedAt: Date,
    nextActionAt: Date,
  },
  { timestamps: true }
);

jobSchema.index({ userId: 1, status: 1 });

const eventSchema = new mongoose.Schema<IEvent>({
  userId: { type: String, required: true, index: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Job' },
  type: { type: String, enum: Object.values(EventType), required: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  at: { type: Date, default: Date.now },
});

eventSchema.index({ userId: 1, jobId: 1 });

// Helper functions that ALWAYS work
export function getJobModel() {
  try {
    return mongoose.model<IJob>('Job');
  } catch {
    return mongoose.model<IJob>('Job', jobSchema);
  }
}

export function getEventModel() {
  try {
    return mongoose.model<IEvent>('Event');
  } catch {
    return mongoose.model<IEvent>('Event', eventSchema);
  }
}
