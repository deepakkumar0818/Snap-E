import mongoose, { Schema, Document, Model } from 'mongoose';
import { MaintenanceStatus } from '@/types';

export { MaintenanceStatus };

export interface IEstimationItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isApproved?: boolean;
}

export interface IMaintenanceRequest extends Document {
  assetId: mongoose.Types.ObjectId;
  raisedByHubManagerId: mongoose.Types.ObjectId;
  serviceCenterName: string;
  issueDescription: string;
  estimatedCost: number;
  estimationDetails: IEstimationItem[];
  status: MaintenanceStatus;
  approvalComments?: string;
  vendorDetails?: {
    name?: string;
    contact?: string;
    address?: string;
  };
  billReference?: string;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

const EstimationItemSchema = new Schema<IEstimationItem>({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  isApproved: { type: Boolean },
});

const MaintenanceRequestSchema = new Schema<IMaintenanceRequest>(
  {
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    raisedByHubManagerId: { type: Schema.Types.ObjectId, ref: 'HubManager', required: true },
    serviceCenterName: { type: String, required: true },
    issueDescription: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    estimationDetails: [EstimationItemSchema],
    status: {
      type: String,
      enum: Object.values(MaintenanceStatus),
      default: MaintenanceStatus.PENDING_APPROVAL,
    },
    approvalComments: { type: String },
    vendorDetails: {
      name: { type: String },
      contact: { type: String },
      address: { type: String },
    },
    billReference: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

MaintenanceRequestSchema.index({ assetId: 1 });
MaintenanceRequestSchema.index({ raisedByHubManagerId: 1 });
MaintenanceRequestSchema.index({ status: 1 });

const MaintenanceRequest: Model<IMaintenanceRequest> =
  mongoose.models.MaintenanceRequest ||
  mongoose.model<IMaintenanceRequest>('MaintenanceRequest', MaintenanceRequestSchema);

export default MaintenanceRequest;

