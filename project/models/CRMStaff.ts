import mongoose, { Schema } from "mongoose";

const StaffSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "staff" },
  created_at: { type: Date, default: Date.now },
});

const Staff =
  (mongoose.models.Staff as any) ||
  mongoose.model("Staff", StaffSchema);

export default Staff;