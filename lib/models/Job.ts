import mongoose from 'mongoose';

export enum JobStatus {
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
}

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

const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);

export { Job };
