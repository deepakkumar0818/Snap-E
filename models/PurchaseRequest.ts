import mongoose, { Schema, Document, Model } from 'mongoose';
import { PurchaseRequestStatus, ItemCategory } from '@/types';

export { PurchaseRequestStatus, ItemCategory };

export interface IPurchaseItem {
  itemName: string;
  category: ItemCategory;
  quantity: number;
  estimatedUnitPrice: number;
  justification: string;
}

export interface IPurchaseRequest extends Document {
  requestedByHubManagerId: mongoose.Types.ObjectId;
  supervisorId?: mongoose.Types.ObjectId;
  hubId: string;
  items: IPurchaseItem[];
  status: PurchaseRequestStatus;
  approvalComments?: string;
  financeNotified: boolean;
  supervisorApprovedAt?: Date;
  financeNotifiedAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const PurchaseItemSchema = new Schema<IPurchaseItem>({
  itemName: { type: String, required: true },
  category: {
    type: String,
    enum: Object.values(ItemCategory),
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  estimatedUnitPrice: { type: Number, required: true, min: 0 },
  justification: { type: String, required: true },
});

const PurchaseRequestSchema = new Schema<IPurchaseRequest>(
  {
    requestedByHubManagerId: { type: Schema.Types.ObjectId, ref: 'HubManager', required: true },
    supervisorId: { type: Schema.Types.ObjectId, ref: 'HubManager' },
    hubId: { type: String, required: true },
    items: [PurchaseItemSchema],
    status: {
      type: String,
      enum: Object.values(PurchaseRequestStatus),
      default: PurchaseRequestStatus.DRAFT,
    },
    approvalComments: { type: String },
    financeNotified: { type: Boolean, default: false },
    supervisorApprovedAt: { type: Date },
    financeNotifiedAt: { type: Date },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

PurchaseRequestSchema.index({ requestedByHubManagerId: 1 });
PurchaseRequestSchema.index({ hubId: 1 });
PurchaseRequestSchema.index({ status: 1 });
PurchaseRequestSchema.index({ createdAt: -1 });

const PurchaseRequest: Model<IPurchaseRequest> =
  mongoose.models.PurchaseRequest ||
  mongoose.model<IPurchaseRequest>('PurchaseRequest', PurchaseRequestSchema);

export default PurchaseRequest;

