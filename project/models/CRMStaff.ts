import mongoose, { Schema, model, models } from "mongoose"

const StaffSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff"], default: "staff" },
  created_at: { type: Date, default: Date.now }
})

export default models.Staff || model("Staff", StaffSchema)