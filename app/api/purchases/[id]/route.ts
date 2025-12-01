import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import PurchaseRequest, { PurchaseRequestStatus } from '@/models/PurchaseRequest';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const purchaseRequest = await PurchaseRequest.findById(params.id)
      .populate('requestedByHubManagerId', 'name email hubLocation')
      .populate('supervisorId', 'name email');
    if (!purchaseRequest) {
      return NextResponse.json({ success: false, error: 'Purchase request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: purchaseRequest });
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
    const purchaseRequest = await PurchaseRequest.findById(params.id);

    if (!purchaseRequest) {
      return NextResponse.json({ success: false, error: 'Purchase request not found' }, { status: 404 });
    }

    // Handle status transitions
    if (body.status === PurchaseRequestStatus.APPROVED) {
      body.supervisorApprovedAt = new Date();
      // Auto-transition to SENT_TO_FINANCE
      body.status = PurchaseRequestStatus.SENT_TO_FINANCE;
      body.financeNotified = true;
      body.financeNotifiedAt = new Date();
    }

    const updated = await PurchaseRequest.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate('requestedByHubManagerId', 'name email hubLocation')
      .populate('supervisorId', 'name email');

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


