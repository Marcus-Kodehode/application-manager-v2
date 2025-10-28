import mongoose, { Schema, model, models } from 'mongoose';

export interface IUserProfile {
  userId: string;
  locale?: string;
  createdAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  userId: { type: String, required: true, unique: true, index: true },
  locale: { type: String, default: 'nb' },
  createdAt: { type: Date, default: Date.now },
});

export const UserProfile = mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', userProfileSchema);
