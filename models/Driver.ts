import mongoose, { Schema, Document, Model } from 'mongoose';
import { DriverStatus } from '@/types';

export { DriverStatus };

export interface IDriver extends Document {
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
  idProof?: string; // URL or document reference
  address: string;
  isBlacklisted: boolean;
  status: DriverStatus;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseExpiryDate: { type: Date, required: true },
    idProof: { type: String },
    address: { type: String, required: true },
    isBlacklisted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(DriverStatus),
      default: DriverStatus.ACTIVE,
    },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

DriverSchema.index({ phone: 1 });
DriverSchema.index({ licenseNumber: 1 });
DriverSchema.index({ status: 1 });
DriverSchema.index({ isBlacklisted: 1 });

const Driver: Model<IDriver> = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);

export default Driver;

