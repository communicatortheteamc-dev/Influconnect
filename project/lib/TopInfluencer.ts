import mongoose, { Schema, model, models, Document } from "mongoose";

// 1. Define the TS interface for your schema
export interface ITopInfluencer extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  category: string;
  photoUrl: string;
  videoUrl: string;
  socials: Record<string, any>;
  termsAccepted: boolean;
  totalFollowers: number;
  slug: string;
}

// 2. Define the schema
const TopInfluencerSchema = new Schema<ITopInfluencer>(
  {
    name: String,
    email: String,
    phone: String,
    location: String,
    bio: String,
    category: String,
    photoUrl: String,
    videoUrl: String,
    socials: Object,
    termsAccepted: Boolean,
    totalFollowers: Number,
    slug: String,
  },
  { timestamps: true }
);

// 3. Fix: explicitly cast model type
const TopInfluencer =
  (models.topinfluencers as mongoose.Model<ITopInfluencer>) ||
  model<ITopInfluencer>("topinfluencers", TopInfluencerSchema);

export default TopInfluencer;
