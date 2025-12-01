import mongoose, { Schema, Document, Model } from 'mongoose';

export enum POStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IPurchaseOrder extends Document {
  purchaseRequestId: mongoose.Types.ObjectId;
  vendorName: string;
  vendorContact?: string;
  vendorAddress?: string;
  poNumber: string;
  totalAmount: number;
  status: POStatus;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    purchaseRequestId: { type: Schema.Types.ObjectId, ref: 'PurchaseRequest', required: true },
    vendorName: { type: String, required: true },
    vendorContact: { type: String },
    vendorAddress: { type: String },
    poNumber: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(POStatus),
      default: POStatus.DRAFT,
    },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

PurchaseOrderSchema.index({ purchaseRequestId: 1 });
PurchaseOrderSchema.index({ poNumber: 1 });
PurchaseOrderSchema.index({ status: 1 });

const PurchaseOrder: Model<IPurchaseOrder> =
  mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);

export default PurchaseOrder;


