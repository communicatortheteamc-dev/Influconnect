import mongoose, { Schema, model, models } from "mongoose"

const InfluencerSchema = new Schema({
  raw_id: { type: Schema.Types.ObjectId, ref: "RawInfluencer" },

  name: String,
  platform: String,
  location: String,
  category: String,
  language: String,
  followers: Number,

  mobile: String,
  email: String,
  instagram_link: String,
  youtube_link: String,
  notes: String,

  assigned_to: { type: Schema.Types.ObjectId, ref: "Staff" },

  status: {
    type: String,
    enum: ["pending", "completed", "contacted", "not_reachable"],
    default: "pending"
  },

  completeness_score: { type: Number, default: 0 },

  updated_by: { type: Schema.Types.ObjectId, ref: "Staff" },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export default models.Influencer || model("Influencer", InfluencerSchema)