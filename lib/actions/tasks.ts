'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Task } from '@/lib/models/Task';
import { Event, EventType } from '@/lib/models/Event';
import { taskCreateSchema, taskUpdateSchema } from '@/lib/validation';
import { Types } from 'mongoose';

export async function createTask(formData: unknown) {
  const userId = await requireAuth();
  const input = taskCreateSchema.parse(formData);

  await connectDB();

  const task = await Task.create({
    ...input,
    userId,
    jobId: input.jobId ? new Types.ObjectId(input.jobId) : undefined,
  });

  if (input.jobId) {
    await Event.create({
      userId,
      jobId: new Types.ObjectId(input.jobId),
      type: EventType.TASK_ADDED,
      payload: { taskId: task._id.toString(), title: task.title },
    });
  }

  revalidatePath('/');
  revalidatePath('/jobs');
  if (input.jobId) {
    revalidatePath(`/jobs/${input.jobId}`);
  }

  return { success: true, taskId: task._id.toString() };
}

export async function updateTask(taskId: string, formData: unknown) {
  const userId = await requireAuth();
  const input = taskUpdateSchema.parse(formData);

  await connectDB();

  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { $set: input },
    { new: true }
  );

  if (!task) {
    throw new Error('Oppgave ikke funnet');
  }

  revalidatePath('/');
  revalidatePath('/jobs');
  if (task.jobId) {
    revalidatePath(`/jobs/${task.jobId.toString()}`);
  }

  return { success: true };
}

export async function toggleTask(taskId: string) {
  const userId = await requireAuth();

  await connectDB();

  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    throw new Error('Oppgave ikke funnet');
  }

  task.done = !task.done;
  await task.save();

  if (task.done && task.jobId) {
    await Event.create({
      userId,
      jobId: task.jobId,
      type: EventType.TASK_DONE,
      payload: { taskId: task._id.toString(), title: task.title },
    });
  }

  revalidatePath('/');
  revalidatePath('/jobs');
  if (task.jobId) {
    revalidatePath(`/jobs/${task.jobId.toString()}`);
  }

  return { success: true };
}

export async function deleteTask(taskId: string) {
  const userId = await requireAuth();

  await connectDB();

  const task = await Task.findOneAndDelete({ _id: taskId, userId });

  if (!task) {
    throw new Error('Oppgave ikke funnet');
  }

  revalidatePath('/');
  revalidatePath('/jobs');
  if (task.jobId) {
    revalidatePath(`/jobs/${task.jobId.toString()}`);
  }

  return { success: true };
}

export async function getTasksByJob(jobId: string) {
  const userId = await requireAuth();

  await connectDB();

  const tasks = await Task.find({ 
    userId, 
    jobId: new Types.ObjectId(jobId) 
  })
    .sort({ done: 1, dueAt: 1 })
    .lean();

  return tasks.map((task: any) => ({
    ...task,
    _id: task._id.toString(),
    jobId: task.jobId?.toString(),
  }));
}

export async function getUpcomingTasks(limit = 10) {
  const userId = await requireAuth();

  await connectDB();

  const tasks = await Task.find({
    userId,
    done: false,
    dueAt: { $exists: true, $gte: new Date() },
  })
    .sort({ dueAt: 1 })
    .limit(limit)
    .lean();

  return tasks.map((task: any) => ({
    ...task,
    _id: task._id.toString(),
    jobId: task.jobId?.toString(),
  }));
}
