import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import PurchaseRequest, { PurchaseRequestStatus } from '@/models/PurchaseRequest';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, comments, supervisorId } = body;

    const purchaseRequest = await PurchaseRequest.findById(params.id);
    if (!purchaseRequest) {
      return NextResponse.json({ success: false, error: 'Purchase request not found' }, { status: 404 });
    }

    if (purchaseRequest.status !== PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL) {
      return NextResponse.json(
        { success: false, error: 'Request is not pending supervisor approval' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      purchaseRequest.status = PurchaseRequestStatus.APPROVED;
      purchaseRequest.supervisorId = supervisorId;
      purchaseRequest.supervisorApprovedAt = new Date();
      purchaseRequest.financeNotified = true;
      purchaseRequest.financeNotifiedAt = new Date();
      // Auto-transition to SENT_TO_FINANCE
      purchaseRequest.status = PurchaseRequestStatus.SENT_TO_FINANCE;
    } else if (action === 'reject') {
      purchaseRequest.status = PurchaseRequestStatus.REJECTED;
      purchaseRequest.approvalComments = comments;
    }

    await purchaseRequest.save();

    const populated = await PurchaseRequest.findById(purchaseRequest._id)
      .populate('requestedByHubManagerId', 'name email hubLocation')
      .populate('supervisorId', 'name email');

    return NextResponse.json({ success: true, data: populated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



