import mongoose, { Schema, models, model, type Model } from 'mongoose';

// 1. Define the Schema FIRST without the interface generic
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
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// 2. Infer the type from the schema object
export type ICampaign = mongoose.InferSchemaType<typeof CampaignSchema>;

// 3. Initialize the model using a "Type Break"
// We cast the result to 'any' initially to bypass the complex union check
const Campaign = (models.Campaign || model('Campaign', CampaignSchema)) as any;

// Export as the specific type to maintain IntelliSense in your other files
export default Campaign as Model<ICampaign>;