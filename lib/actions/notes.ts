'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Note } from '@/lib/models/Note';
import { Event, EventType } from '@/lib/models/Event';
import { noteCreateSchema } from '@/lib/validation';
import { Types } from 'mongoose';

export async function createNote(formData: unknown) {
  const userId = await requireAuth();
  const input = noteCreateSchema.parse(formData);

  await connectDB();

  const note = await Note.create({
    ...input,
    userId,
    jobId: new Types.ObjectId(input.jobId),
  });

  await Event.create({
    userId,
    jobId: new Types.ObjectId(input.jobId),
    type: EventType.NOTE_ADDED,
    payload: { noteId: note._id.toString() },
  });

  revalidatePath(`/jobs/${input.jobId}`);

  return { success: true, noteId: note._id.toString() };
}

export async function deleteNote(noteId: string) {
  const userId = await requireAuth();

  await connectDB();

  const note = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!note) {
    throw new Error('Note not found');
  }

  revalidatePath(`/jobs/${note.jobId.toString()}`);

  return { success: true };
}

export async function getNotesByJob(jobId: string) {
  const userId = await requireAuth();

  await connectDB();

  const notes = await Note.find({
    userId,
    jobId: new Types.ObjectId(jobId),
  })
    .sort({ createdAt: -1 })
    .lean();

  return notes.map(note => ({
    ...note,
    _id: note._id.toString(),
    jobId: note.jobId.toString(),
  }));
}
