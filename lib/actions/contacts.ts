'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { contactCreateSchema } from '@/lib/validation';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

function getContactModel(): any {
  try {
    return mongoose.model('Contact');
  } catch {
    const contactSchema = new mongoose.Schema({
      userId: { type: String, required: true, index: true },
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      name: { type: String, required: true },
      email: String,
      phone: String,
      role: String,
      createdAt: { type: Date, default: Date.now },
    });
    contactSchema.index({ userId: 1, jobId: 1 });
    return mongoose.model('Contact', contactSchema);
  }
}

export async function createContact(formData: unknown) {
  try {
    const userId = await requireAuth();
    const input = contactCreateSchema.parse(formData);

    await connectDB();
    
    const Contact = getContactModel();

    const contactData: any = {
      ...input,
      userId,
      jobId: input.jobId ? new Types.ObjectId(input.jobId) : undefined,
    };

    const contact = await Contact.create(contactData);

    if (input.jobId) {
      revalidatePath(`/jobs/${input.jobId}`);
    }

    return { success: true, contactId: contact._id.toString() };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    throw new Error(error.message || 'Kunne ikke opprette kontakt');
  }
}

export async function deleteContact(contactId: string) {
  try {
    const userId = await requireAuth();

    await connectDB();
    
    const Contact = getContactModel();

    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

    if (!contact) {
      throw new Error('Kontakt ikke funnet');
    }

    if (contact.jobId) {
      revalidatePath(`/jobs/${contact.jobId.toString()}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    throw new Error(error.message || 'Kunne ikke slette kontakt');
  }
}

export async function getContactsByJob(jobId: string) {
  try {
    const userId = await requireAuth();

    await connectDB();
    
    const Contact = getContactModel();

    const contacts = await Contact.find({
      userId,
      jobId: new Types.ObjectId(jobId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return contacts.map((contact: any) => ({
      _id: contact._id.toString(),
      userId: contact.userId,
      jobId: contact.jobId?.toString(),
      name: contact.name,
      email: contact.email || null,
      phone: contact.phone || null,
      role: contact.role || null,
      createdAt: contact.createdAt.toISOString(),
    }));
  } catch (error: any) {
    console.error('Error getting contacts:', error);
    return [];
  }
}
