import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import MaintenanceRequest, { MaintenanceStatus } from '@/models/MaintenanceRequest';
import Asset, { AssetStatus } from '@/models/Asset';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const assetId = searchParams.get('assetId');

    const filter: any = {};
    if (status && Object.values(MaintenanceStatus).includes(status as MaintenanceStatus)) {
      filter.status = status;
    }
    if (assetId) filter.assetId = assetId;

    const requests = await MaintenanceRequest.find(filter)
      .populate('assetId', 'registrationNumber model variant')
      .populate('raisedByHubManagerId', 'name email hubLocation')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Update asset status to UNDER_MAINTENANCE if not already
    const asset = await Asset.findById(body.assetId);
    if (asset && asset.status !== AssetStatus.UNDER_MAINTENANCE) {
      await Asset.findByIdAndUpdate(body.assetId, { status: AssetStatus.UNDER_MAINTENANCE });
    }

    const maintenanceRequest = await MaintenanceRequest.create(body);
    const populated = await MaintenanceRequest.findById(maintenanceRequest._id)
      .populate('assetId', 'registrationNumber model variant')
      .populate('raisedByHubManagerId', 'name email hubLocation');

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


