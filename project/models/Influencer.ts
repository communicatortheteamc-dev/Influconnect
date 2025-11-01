import mongoose, { Schema, models } from "mongoose";

const influencerSchema = new Schema({
  pageName: { type: String, required: true },
  phoneNumber: String,
  email: String,
  instagram: Object,
  facebook: Object,
  snapchat: Object,
  twitter: Object,
  threads: Object,
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent model re-compilation errors in dev
export const Influencer =
  models.Influencer || mongoose.model("Influencer", influencerSchema);