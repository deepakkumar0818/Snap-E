import mongoose, { Schema, Document, Model } from 'mongoose';
import { AssetStatus, OwnershipType } from '@/types';

export { AssetStatus, OwnershipType };

export interface IDocumentDetail {
  type: string; // RC, PUC, Insurance, Permit, Fitness
  url?: string;
  expiryDate?: Date;
  documentNumber?: string;
  metadata?: Record<string, any>;
}

export interface IAsset extends Omit<Document, 'model'> {
  registrationNumber: string;
  model: string;
  variant: string;
  capacity: number;
  purchaseDate: Date;
  ownershipType: OwnershipType;
  status: AssetStatus;
  documents: IDocumentDetail[];
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const DocumentDetailSchema = new Schema<IDocumentDetail>({
  type: { type: String, required: true },
  url: { type: String },
  expiryDate: { type: Date },
  documentNumber: { type: String },
  metadata: { type: Schema.Types.Mixed },
});

const AssetSchema = new Schema<IAsset>(
  {
    registrationNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    variant: { type: String, required: true },
    capacity: { type: Number, required: true },
    purchaseDate: { type: Date, required: true },
    ownershipType: {
      type: String,
      enum: Object.values(OwnershipType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AssetStatus),
      default: AssetStatus.AVAILABLE,
    },
    documents: [DocumentDetailSchema],
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

AssetSchema.index({ registrationNumber: 1 });
AssetSchema.index({ status: 1 });

const Asset: Model<IAsset> = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);

export default Asset;

