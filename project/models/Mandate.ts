import mongoose, { Schema, Document } from "mongoose";

export interface IMandate extends Document {
  mandateId: string;
  autopayId?: string;       // optional, link to recurring payment record
  userId: string;
  amount: number;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  status: "ACTIVE" | "CANCELLED";
  instrument?: "PHONEPE" | "PAYTM" | "GOOGLEPAY" | "ALL";
  createdAt: Date;
  updatedAt: Date;
}

const MandateSchema = new Schema<IMandate>({
  mandateId: { type: String, required: true, unique: true },
  autopayId: { type: String },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ["DAILY","WEEKLY","MONTHLY"], required: true },
  status: { type: String, enum: ["ACTIVE", "CANCELLED"], default: "ACTIVE" },
  instrument: { type: String, enum: ["PHONEPE","PAYTM","GOOGLEPAY","ALL"], default: "ALL" },
}, { timestamps: true });

export default mongoose.models.Mandate || mongoose.model<IMandate>("Mandate", MandateSchema);
