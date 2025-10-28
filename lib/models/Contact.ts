import mongoose, { Schema, model, models, Types } from 'mongoose';

export interface IContact {
  userId: string;
  jobId?: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  createdAt: Date;
}

const contactSchema = new Schema<IContact>({
  userId: { type: String, required: true, index: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  name: { type: String, required: true },
  email: String,
  phone: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
});

contactSchema.index({ userId: 1, jobId: 1 });

export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);
