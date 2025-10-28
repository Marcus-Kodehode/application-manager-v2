'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { put, del } from '@vercel/blob';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

function getDocumentModel(): any {
  try {
    return mongoose.model('Document');
  } catch {
    const documentSchema = new mongoose.Schema({
      userId: { type: String, required: true, index: true },
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      label: { type: String, required: true },
      type: { type: String, enum: ['CV', 'COVER_LETTER', 'OTHER'], required: true },
      blobUrl: { type: String, required: true },
      original: String,
      createdAt: { type: Date, default: Date.now },
    });
    return mongoose.model('Document', documentSchema);
  }
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'image/png',
  'image/jpeg',
  'image/webp',
];

export async function uploadDocument(formData: FormData) {
  try {
    const userId = await requireAuth();
    
    const file = formData.get('file') as File;
    const label = formData.get('label') as string;
    const type = formData.get('type') as string;
    const jobId = formData.get('jobId') as string | null;

    if (!file) {
      throw new Error('Ingen fil valgt');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Filen er for stor. Maks 10MB.');
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Ugyldig filtype. Kun PDF, DOCX, PNG, JPEG og WEBP er tillatt.');
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    await connectDB();
    const Document = getDocumentModel();

    const document = await Document.create({
      userId,
      jobId: jobId ? new Types.ObjectId(jobId) : undefined,
      label: label || file.name,
      type: type || 'OTHER',
      blobUrl: blob.url,
      original: file.name,
    });

    if (jobId) {
      revalidatePath(`/jobs/${jobId}`);
    }
    revalidatePath('/documents');

    return { success: true, documentId: document._id.toString() };
  } catch (error: any) {
    console.error('Error uploading document:', error);
    throw new Error(error.message || 'Kunne ikke laste opp fil');
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const userId = await requireAuth();

    await connectDB();
    const Document = getDocumentModel();

    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      throw new Error('Dokument ikke funnet');
    }

    // Delete from Vercel Blob
    try {
      await del(document.blobUrl);
    } catch (error) {
      console.error('Error deleting from blob:', error);
      // Continue even if blob deletion fails
    }

    // Delete from database
    await Document.deleteOne({ _id: documentId });

    if (document.jobId) {
      revalidatePath(`/jobs/${document.jobId.toString()}`);
    }
    revalidatePath('/documents');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting document:', error);
    throw new Error(error.message || 'Kunne ikke slette dokument');
  }
}

export async function getDocumentsByJob(jobId: string) {
  try {
    const userId = await requireAuth();

    await connectDB();
    const Document = getDocumentModel();

    const documents = await Document.find({
      userId,
      jobId: new Types.ObjectId(jobId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return documents.map((doc: any) => ({
      _id: doc._id.toString(),
      userId: doc.userId,
      jobId: doc.jobId?.toString(),
      label: doc.label,
      type: doc.type,
      blobUrl: doc.blobUrl,
      original: doc.original || null,
      createdAt: doc.createdAt.toISOString(),
    }));
  } catch (error: any) {
    console.error('Error getting documents:', error);
    return [];
  }
}

export async function getAllDocuments() {
  try {
    const userId = await requireAuth();

    await connectDB();
    const Document = getDocumentModel();

    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return documents.map((doc: any) => ({
      _id: doc._id.toString(),
      userId: doc.userId,
      jobId: doc.jobId?.toString(),
      label: doc.label,
      type: doc.type,
      blobUrl: doc.blobUrl,
      original: doc.original || null,
      createdAt: doc.createdAt.toISOString(),
    }));
  } catch (error: any) {
    console.error('Error getting all documents:', error);
    return [];
  }
}
