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
    throw new Error(error.message || 'Failed to create job');
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
    throw new Error('Job not found');
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
    throw new Error('Job not found');
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
    throw new Error('Job not found');
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
