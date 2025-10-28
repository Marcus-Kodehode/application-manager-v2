import mongoose, { Schema, model, models, Types } from 'mongoose';

export enum EventType {
  STATUS_CHANGED = 'STATUS_CHANGED',
  NOTE_ADDED = 'NOTE_ADDED',
  TASK_ADDED = 'TASK_ADDED',
  TASK_DONE = 'TASK_DONE',
  FILE_ATTACHED = 'FILE_ATTACHED',
}

export interface IEvent {
  userId: string;
  jobId: Types.ObjectId;
  type: EventType;
  payload?: Record<string, any>;
  at: Date;
}

const eventSchema = new Schema<IEvent>({
  userId: { type: String, required: true, index: true },
  jobId: { type: Schema.Types.ObjectId, required: true, ref: 'Job' },
  type: { type: String, enum: Object.values(EventType), required: true },
  payload: { type: Schema.Types.Mixed },
  at: { type: Date, default: Date.now },
});

eventSchema.index({ userId: 1, jobId: 1 });

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
