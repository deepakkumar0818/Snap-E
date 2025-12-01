import mongoose, { Schema, Document, Model } from 'mongoose';
import { RentalType, RentalStatus } from '@/types';

export { RentalType, RentalStatus };

export interface IRental extends Document {
  driverId: mongoose.Types.ObjectId;
  assetId: mongoose.Types.ObjectId;
  hubId: string;
  rentalType: RentalType;
  startDateTime: Date;
  endDateTime?: Date;
  expectedReturnDateTime?: Date;
  rentalAmount: number;
  depositAmount: number;
  penaltyAmount?: number;
  startKm?: number;
  endKm?: number;
  status: RentalStatus;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const RentalSchema = new Schema<IRental>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    hubId: { type: String, required: true },
    rentalType: {
      type: String,
      enum: Object.values(RentalType),
      required: true,
    },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date },
    expectedReturnDateTime: { type: Date },
    rentalAmount: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    penaltyAmount: { type: Number, default: 0 },
    startKm: { type: Number },
    endKm: { type: Number },
    status: {
      type: String,
      enum: Object.values(RentalStatus),
      default: RentalStatus.ONGOING,
    },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

RentalSchema.index({ driverId: 1 });
RentalSchema.index({ assetId: 1 });
RentalSchema.index({ hubId: 1 });
RentalSchema.index({ status: 1 });
RentalSchema.index({ startDateTime: 1 });

const Rental: Model<IRental> = mongoose.models.Rental || mongoose.model<IRental>('Rental', RentalSchema);

export default Rental;

