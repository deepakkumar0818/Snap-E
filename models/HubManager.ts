import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHubManager extends Document {
  name: string;
  email: string;
  phone: string;
  hubLocation: string;
  employeeCode: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const HubManagerSchema = new Schema<IHubManager>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    hubLocation: { type: String, required: true },
    employeeCode: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

HubManagerSchema.index({ employeeCode: 1 });
HubManagerSchema.index({ email: 1 });
HubManagerSchema.index({ hubLocation: 1 });

const HubManager: Model<IHubManager> =
  mongoose.models.HubManager || mongoose.model<IHubManager>('HubManager', HubManagerSchema);

export default HubManager;


