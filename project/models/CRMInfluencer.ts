import mongoose, { Schema, model, models, type Model } from "mongoose";

// 1. Define the Schema
const CRMInfluencerSchema = new Schema(
  {
    raw_id: { type: Schema.Types.ObjectId, ref: "RawInfluencer" },
    name: { type: String },
    platform: { type: String },
    location: { type: String },
    category: { type: String },
    language: { type: String },
    followers: { type: Number },
    mobile: { type: String },
    email: { type: String },
    instagram_link: { type: String },
    youtube_link: { type: String },
    notes: { type: String },
    assigned_to: { type: Schema.Types.ObjectId, ref: "Staff" },
    status: {
      type: String,
      enum: ["pending", "completed", "contacted", "not_reachable"],
      default: "pending",
    },
    completeness_score: { type: Number, default: 0 },
    updated_by: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  {
    // Automatically handles created_at and updated_at
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// 2. Infer the TypeScript interface from the Schema
export type ICRMInfluencer = mongoose.InferSchemaType<typeof CRMInfluencerSchema>;

// 3. Create the Model Type
// We use a specific Model type to keep the compiler happy
type CRMInfluencerModel = Model<ICRMInfluencer>;

// 4. Initialize the Model (The Fix)
// We cast 'models.CRMInfluencer' to 'any' first to break the "complex union" recursion,
// then cast the whole result to our specific Model type.
const CRMInfluencer = (
  (models.CRMInfluencer as any) || 
  model<ICRMInfluencer>("CRMInfluencer", CRMInfluencerSchema)
) as CRMInfluencerModel;

export default CRMInfluencer;