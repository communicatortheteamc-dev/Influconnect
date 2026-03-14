import mongoose, { Schema, model, models } from "mongoose"

const RawSchema = new Schema({
  name: String,
  platform: String,
  location: String,
  category: String,
  language: String,
  followers: Number,
  source: String,
  created_at: { type: Date, default: Date.now }
})

export default models.RawInfluencer || model("RawInfluencer", RawSchema)