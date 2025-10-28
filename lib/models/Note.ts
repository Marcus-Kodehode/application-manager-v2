import mongoose, { Schema, model, models, Types } from 'mongoose';

export interface INote {
  userId: string;
  jobId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const noteSchema = new Schema<INote>({
  userId: { type: String, required: true, index: true },
  jobId: { type: Schema.Types.ObjectId, required: true, ref: 'Job', index: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

noteSchema.index({ userId: 1, jobId: 1 });

export const Note = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);
