import mongoose, { Schema, model, models, Types } from 'mongoose';

export interface ITask {
  userId: string;
  jobId?: Types.ObjectId;
  title: string;
  dueAt?: Date;
  done: boolean;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>({
  userId: { type: String, required: true, index: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  title: { type: String, required: true },
  dueAt: Date,
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

taskSchema.index({ userId: 1, done: 1, dueAt: 1 });

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);
