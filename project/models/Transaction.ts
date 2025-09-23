import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  orderId: string;
  userId?: string;
  amount?: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  type: "ONE_TIME" | "AUTOPAY";
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY";
  instrument?: "PHONEPE" | "PAYTM" | "GOOGLEPAY" | "ALL";
  phonePeTransactionId?: string;
  autopayId?: string;
  refundId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String },
  amount: { type: Number },
  status: { type: String, enum: ["PENDING","SUCCESS","FAILED","REFUNDED"], default: "PENDING" },
  type: { type: String, enum: ["ONE_TIME", "AUTOPAY"], default: "ONE_TIME" },
  frequency: { type: String, enum: ["DAILY","WEEKLY","MONTHLY"] },
  instrument: { type: String, enum: ["PHONEPE","PAYTM","GOOGLEPAY","ALL"], default: "PHONEPE" },
  phonePeTransactionId: { type: String },
  autopayId: { type: String },
  refundId: { type: String },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

