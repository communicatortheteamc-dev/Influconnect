import mongoose, { Schema } from "mongoose";

const RawSchema = new Schema({
  name: String,
  platform: String,
  location: String,
  category: String,
  language: String,
  followers: Number,
  source: String,
  created_at: { type: Date, default: Date.now },
});

const RawInfluencer =
  (mongoose.models.RawInfluencer as any) ||
  mongoose.model("RawInfluencer", RawSchema);

export default RawInfluencer;