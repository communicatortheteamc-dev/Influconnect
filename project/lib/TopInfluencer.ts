import mongoose, { Schema, model, models } from "mongoose";

const TopInfluencerSchema = new Schema(
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

const TopInfluencer =
  models.topinfluencers || model("topinfluencers", TopInfluencerSchema);

export default TopInfluencer;
