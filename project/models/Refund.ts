import mongoose, { Schema, Document } from "mongoose";

export interface IRefund extends Document {
  refundId: string;
  orderId: string;
  autopayId?: string; // optional, for recurring payments
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  instrument?: "PHONEPE" | "PAYTM" | "GOOGLEPAY" | "ALL";
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<IRefund>({
  refundId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  autopayId: { type: String }, // optional for recurring payment refunds
  amount: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  instrument: { type: String, enum: ["PHONEPE","PAYTM","GOOGLEPAY","ALL"], default: "PHONEPE" },
}, { timestamps: true });

export default mongoose.models.Refund || mongoose.model<IRefund>("Refund", RefundSchema);
