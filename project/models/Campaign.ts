import mongoose, { Schema, models } from 'mongoose';

const CampaignSchema = new Schema(
  {
    title: { type: String, required: true },
    influencerId: { type: Schema.Types.ObjectId, ref: 'Influencer', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

const Campaign = models.Campaign || mongoose.model('Campaign', CampaignSchema);
export default Campaign;
