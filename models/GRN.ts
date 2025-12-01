import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGRNItem {
  itemName: string;
  category: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
}

export interface IGRN extends Document {
  purchaseRequestId: mongoose.Types.ObjectId;
  purchaseOrderId?: mongoose.Types.ObjectId;
  receivedBy: mongoose.Types.ObjectId;
  receivedDate: Date;
  itemsReceived: IGRNItem[];
  notes?: string;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const GRNItemSchema = new Schema<IGRNItem>({
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantityOrdered: { type: Number, required: true },
  quantityReceived: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

const GRNSchema = new Schema<IGRN>(
  {
    purchaseRequestId: { type: Schema.Types.ObjectId, ref: 'PurchaseRequest', required: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    receivedBy: { type: Schema.Types.ObjectId, ref: 'HubManager', required: true },
    receivedDate: { type: Date, required: true },
    itemsReceived: [GRNItemSchema],
    notes: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

GRNSchema.index({ purchaseRequestId: 1 });
GRNSchema.index({ receivedDate: -1 });

const GRN: Model<IGRN> = mongoose.models.GRN || mongoose.model<IGRN>('GRN', GRNSchema);

export default GRN;


