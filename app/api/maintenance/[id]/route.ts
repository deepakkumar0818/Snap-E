import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import MaintenanceRequest, { MaintenanceStatus } from '@/models/MaintenanceRequest';
import Asset, { AssetStatus } from '@/models/Asset';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const maintenanceRequest = await MaintenanceRequest.findById(params.id)
      .populate('assetId', 'registrationNumber model variant')
      .populate('raisedByHubManagerId', 'name email hubLocation');
    if (!maintenanceRequest) {
      return NextResponse.json({ success: false, error: 'Maintenance request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: maintenanceRequest });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const maintenanceRequest = await MaintenanceRequest.findById(params.id);

    if (!maintenanceRequest) {
      return NextResponse.json({ success: false, error: 'Maintenance request not found' }, { status: 404 });
    }

    // If marking as completed, update asset status back to AVAILABLE
    if (body.status === MaintenanceStatus.COMPLETED && maintenanceRequest.status !== MaintenanceStatus.COMPLETED) {
      await Asset.findByIdAndUpdate(maintenanceRequest.assetId, { status: AssetStatus.AVAILABLE });
    }

    const updated = await MaintenanceRequest.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate('assetId', 'registrationNumber model variant')
      .populate('raisedByHubManagerId', 'name email hubLocation');

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


