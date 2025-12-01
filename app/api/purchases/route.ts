import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import PurchaseRequest, { PurchaseRequestStatus } from '@/models/PurchaseRequest';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const hubId = searchParams.get('hubId');
    const requestedBy = searchParams.get('requestedBy');

    const filter: any = {};
    if (status && Object.values(PurchaseRequestStatus).includes(status as PurchaseRequestStatus)) {
      filter.status = status;
    }
    if (hubId) filter.hubId = hubId;
    if (requestedBy) filter.requestedByHubManagerId = requestedBy;

    const requests = await PurchaseRequest.find(filter)
      .populate('requestedByHubManagerId', 'name email hubLocation')
      .populate('supervisorId', 'name email')
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
    const purchaseRequest = await PurchaseRequest.create(body);
    const populated = await PurchaseRequest.findById(purchaseRequest._id)
      .populate('requestedByHubManagerId', 'name email hubLocation')
      .populate('supervisorId', 'name email');

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



