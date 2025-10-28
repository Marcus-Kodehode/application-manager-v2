import mongoose, { Schema, model, models } from 'mongoose';

export enum DocType {
  CV = 'CV',
  COVER_LETTER = 'COVER_LETTER',
  OTHER = 'OTHER',
}

export interface IDocument {
  userId: string;
  label: string;
  type: DocType;
  blobUrl: string;
  original?: string;
  createdAt: Date;
}

const documentSchema = new Schema<IDocument>({
  userId: { type: String, required: true, index: true },
  label: { type: String, required: true },
  type: { type: String, enum: Object.values(DocType), required: true },
  blobUrl: { type: String, required: true },
  original: String,
  createdAt: { type: Date, default: Date.now },
});

export const Document = mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);
