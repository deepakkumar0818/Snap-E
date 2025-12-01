import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHub extends Document {
  hubId: string;
  hubName: string;
  location: string;
  budgetLimit?: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const HubSchema = new Schema<IHub>(
  {
    hubId: { type: String, required: true, unique: true },
    hubName: { type: String, required: true },
    location: { type: String, required: true },
    budgetLimit: { type: Number },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

HubSchema.index({ hubId: 1 });
HubSchema.index({ location: 1 });

const Hub: Model<IHub> = mongoose.models.Hub || mongoose.model<IHub>('Hub', HubSchema);

export default Hub;



