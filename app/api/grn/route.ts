import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import GRN from '@/models/GRN';
import PurchaseRequest, { PurchaseRequestStatus } from '@/models/PurchaseRequest';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const purchaseRequestId = searchParams.get('purchaseRequestId');

    const filter: any = {};
    if (purchaseRequestId) filter.purchaseRequestId = purchaseRequestId;

    const grns = await GRN.find(filter)
      .populate('purchaseRequestId')
      .populate('purchaseOrderId')
      .populate('receivedBy', 'name email')
      .sort({ receivedDate: -1 });
    return NextResponse.json({ success: true, data: grns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const grn = await GRN.create(body);

    // Update purchase request status to completed
    await PurchaseRequest.findByIdAndUpdate(body.purchaseRequestId, {
      status: PurchaseRequestStatus.COMPLETED,
    });

    const populated = await GRN.findById(grn._id)
      .populate('purchaseRequestId')
      .populate('purchaseOrderId')
      .populate('receivedBy', 'name email');

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


