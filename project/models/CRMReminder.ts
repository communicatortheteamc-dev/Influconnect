import mongoose, { Schema, model, models } from "mongoose"

const ReminderSchema = new Schema({
  influencer_id: { type: Schema.Types.ObjectId, ref: "Influencer" },
  staff_id: { type: Schema.Types.ObjectId, ref: "Staff" },

  message: String,
  reminder_datetime: Date,

  type: { type: String, enum: ["email", "whatsapp"] },
  status: { type: String, enum: ["pending", "sent"], default: "pending" },

  created_at: { type: Date, default: Date.now }
})

export default models.Reminder || model("Reminder", ReminderSchema)