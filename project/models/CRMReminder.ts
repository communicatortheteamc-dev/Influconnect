import mongoose, { Schema, type Model } from "mongoose";

export interface ICRMReminder {
  influencer_id?: mongoose.Types.ObjectId;
  staff_id?: mongoose.Types.ObjectId;
  message?: string;
  reminder_datetime?: Date;
  type?: "email" | "whatsapp";
  status?: "pending" | "sent";
  created_at?: Date;
}

const CRMReminderSchema = new Schema<ICRMReminder>({
  influencer_id: { type: Schema.Types.ObjectId, ref: "CRMInfluencer" },
  staff_id: { type: Schema.Types.ObjectId, ref: "Staff" },

  message: { type: String },
  reminder_datetime: { type: Date },

  type: { type: String, enum: ["email", "whatsapp"] },
  status: { type: String, enum: ["pending", "sent"], default: "pending" },

  created_at: { type: Date, default: Date.now },
});

type CRMReminderModelType = Model<ICRMReminder>;

const Reminder: CRMReminderModelType =
  mongoose.modelNames().includes("CRMReminder")
    ? mongoose.model<ICRMReminder>("CRMReminder")
    : mongoose.model<ICRMReminder>("CRMReminder", CRMReminderSchema);

export default Reminder;