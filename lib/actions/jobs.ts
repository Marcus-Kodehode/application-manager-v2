'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { jobCreateSchema, jobUpdateSchema } from '@/lib/validation';
import { getJobModel, getEventModel, EventType } from '@/lib/models';

export async function createJob(formData: unknown) {
  try {
    const userId = await requireAuth();
    const input = jobCreateSchema.parse(formData);

    await connectDB();
    
    const Job = getJobModel();
    const Event = getEventModel();

    const job = await Job.create({
      ...input,
      userId,
    });

    await Event.create({
      userId,
      jobId: job._id,
      type: EventType.STATUS_CHANGED,
      payload: { to: job.status },
    });

    revalidatePath('/');
    revalidatePath('/jobs');

    return { success: true, jobId: job._id.toString() };
  } catch (error: any) {
    console.error('Error creating job:', error);
    throw new Error(error.message || 'Kunne ikke opprette jobb');
  }
}

export async function updateJob(jobId: string, formData: unknown) {
  const userId = await requireAuth();
  const input = jobUpdateSchema.parse(formData);

  await connectDB();
  
  const Job = getJobModel();

  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { $set: input },
    { new: true }
  );

  if (!job) {
    throw new Error('Jobb ikke funnet');
  }

  revalidatePath('/');
  revalidatePath('/jobs');
  revalidatePath(`/jobs/${jobId}`);

  return { success: true };
}

export async function deleteJob(jobId: string) {
  const userId = await requireAuth();

  await connectDB();
  
  const Job = getJobModel();

  const job = await Job.findOneAndDelete({ _id: jobId, userId });

  if (!job) {
    throw new Error('Jobb ikke funnet');
  }

  revalidatePath('/');
  revalidatePath('/jobs');

  return { success: true };
}

export async function moveJobStatus(jobId: string, newStatus: string) {
  const userId = await requireAuth();

  await connectDB();
  
  const Job = getJobModel();
  const Event = getEventModel();

  const job = await Job.findOne({ _id: jobId, userId });

  if (!job) {
    throw new Error('Jobb ikke funnet');
  }

  const oldStatus = job.status;
  job.status = newStatus as any;
  await job.save();

  await Event.create({
    userId,
    jobId: job._id,
    type: EventType.STATUS_CHANGED,
    payload: { from: oldStatus, to: newStatus },
  });

  revalidatePath('/');
  revalidatePath('/jobs');
  revalidatePath(`/jobs/${jobId}`);

  return { success: true };
}

export async function getJobs(filters?: { status?: string; search?: string }) {
  const userId = await requireAuth();

  await connectDB();
  
  const Job = getJobModel();

  const query: any = { userId };

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { company: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const jobs = await Job.find(query).sort({ updatedAt: -1 }).lean();

  return jobs.map((job: any) => ({
    ...job,
    _id: job._id.toString(),
  }));
}

export async function getJobById(jobId: string) {
  try {
    const userId = await requireAuth();

    await connectDB();
    
    const Job = getJobModel();

    const job = await Job.findOne({ _id: jobId, userId }).lean();

    if (!job) {
      return null;
    }

    return {
      _id: job._id.toString(),
      userId: job.userId,
      title: job.title,
      company: job.company,
      location: job.location || '',
      remote: job.remote,
      source: job.source || '',
      status: job.status,
      salaryNote: job.salaryNote || '',
      tags: job.tags || [],
      url: job.url || '',
      appliedAt: job.appliedAt?.toISOString() || null,
      nextActionAt: job.nextActionAt?.toISOString() || null,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };
  } catch (error: any) {
    console.error('Error getting job:', error);
    return null;
  }
}

export async function importJobsFromCSV(jobs: any[]) {
  try {
    const userId = await requireAuth();

    await connectDB();
    
    const Job = getJobModel();
    const Event = getEventModel();

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < jobs.length; i++) {
      try {
        const jobData = jobs[i];

        // Convert CSV data to job format
        const job = await Job.create({
          userId,
          title: jobData.title,
          company: jobData.company,
          location: jobData.location || undefined,
          remote: jobData.remote?.toLowerCase() === 'yes' || jobData.remote?.toLowerCase() === 'ja',
          salary: jobData.salary || undefined,
          url: jobData.url || undefined,
          description: jobData.description || undefined,
          status: jobData.status?.toUpperCase() || 'WISHLIST',
          tags: jobData.tags ? jobData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
          appliedAt: jobData.appliedAt ? new Date(jobData.appliedAt) : undefined,
        });

        // Create initial event
        await Event.create({
          userId,
          jobId: job._id,
          type: EventType.STATUS_CHANGED,
          payload: { to: job.status },
        });

        // Add note if provided
        if (jobData.notes && jobData.notes.trim()) {
          await Event.create({
            userId,
            jobId: job._id,
            type: EventType.NOTE_ADDED,
            payload: { content: jobData.notes.trim() },
          });
        }

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Rad ${i + 2}: ${error.message}`);
      }
    }

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/dashboard');

    return results;
  } catch (error: any) {
    console.error('Error importing jobs:', error);
    throw new Error(error.message || 'Kunne ikke importere jobber');
  }
}

export async function getJobWithDetails(jobId: string) {
  try {
    const userId = await requireAuth();

    await connectDB();
    
    const Job = getJobModel();
    const Event = getEventModel();

    const job = await Job.findOne({ _id: jobId, userId }).lean();
    if (!job) {
      throw new Error('Jobb ikke funnet');
    }

    const events = await Event.find({ jobId, userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get related data from other models
    const mongoose = require('mongoose');
    
    let tasks = [];
    let contacts = [];
    let documents = [];

    try {
      const Task = mongoose.model('Task');
      tasks = await Task.find({ jobId, userId }).lean();
    } catch (e) {
      // Model might not exist
    }

    try {
      const Contact = mongoose.model('Contact');
      contacts = await Contact.find({ jobId, userId }).lean();
    } catch (e) {
      // Model might not exist
    }

    try {
      const Document = mongoose.model('Document');
      documents = await Document.find({ jobId, userId }).lean();
    } catch (e) {
      // Model might not exist
    }

    return {
      job: JSON.parse(JSON.stringify(job)),
      events: JSON.parse(JSON.stringify(events)),
      tasks: JSON.parse(JSON.stringify(tasks)),
      contacts: JSON.parse(JSON.stringify(contacts)),
      documents: JSON.parse(JSON.stringify(documents)),
    };
  } catch (error: any) {
    console.error('Error getting job with details:', error);
    throw new Error(error.message || 'Kunne ikke hente jobbdetaljer');
  }
}

export async function getAllJobsWithDetails() {
  try {
    const userId = await requireAuth();

    await connectDB();
    
    const Job = getJobModel();
    const Event = getEventModel();

    const jobs = await Job.find({ userId }).lean();
    
    const mongoose = require('mongoose');
    
    // Get all related data for all jobs
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const jobId = job._id.toString();
        
        const events = await Event.find({ jobId: job._id, userId })
          .sort({ createdAt: -1 })
          .lean();

        let tasks = [];
        let contacts = [];
        let documents = [];

        try {
          const Task = mongoose.model('Task');
          tasks = await Task.find({ jobId: job._id, userId }).lean();
        } catch (e) {
          // Model might not exist
        }

        try {
          const Contact = mongoose.model('Contact');
          contacts = await Contact.find({ jobId: job._id, userId }).lean();
        } catch (e) {
          // Model might not exist
        }

        try {
          const Document = mongoose.model('Document');
          documents = await Document.find({ jobId: job._id, userId }).lean();
        } catch (e) {
          // Model might not exist
        }

        return {
          job: JSON.parse(JSON.stringify(job)),
          events: JSON.parse(JSON.stringify(events)),
          tasks: JSON.parse(JSON.stringify(tasks)),
          contacts: JSON.parse(JSON.stringify(contacts)),
          documents: JSON.parse(JSON.stringify(documents)),
        };
      })
    );

    return jobsWithDetails;
  } catch (error: any) {
    console.error('Error getting all jobs with details:', error);
    throw new Error(error.message || 'Kunne ikke hente jobber');
  }
}
