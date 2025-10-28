import mongoose, { Schema, model, models } from 'mongoose';

export interface IAnalyticsEvent {
  userId?: string;
  name: string;
  props?: Record<string, any>;
  ts: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>({
  userId: { type: String, index: true },
  name: { type: String, required: true },
  props: { type: Schema.Types.Mixed },
  ts: { type: Date, default: Date.now },
});

export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);
