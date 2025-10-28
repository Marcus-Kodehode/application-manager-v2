'use server';

import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { getEventModel } from '@/lib/models';
import { Types } from 'mongoose';

export async function getEventsByJob(jobId: string) {
  try {
    const userId = await requireAuth();

    await connectDB();
    
    const Event = getEventModel();

    const events = await Event.find({
      userId,
      jobId: new Types.ObjectId(jobId),
    })
      .sort({ at: -1 })
      .lean();

    return events.map((event: any) => ({
      _id: event._id.toString(),
      userId: event.userId,
      jobId: event.jobId.toString(),
      type: event.type,
      payload: event.payload || null,
      at: event.at.toISOString(),
    }));
  } catch (error: any) {
    console.error('Error getting events:', error);
    return [];
  }
}
