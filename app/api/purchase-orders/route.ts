import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import PurchaseOrder from '@/models/PurchaseOrder';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const purchaseRequestId = searchParams.get('purchaseRequestId');
    const status = searchParams.get('status');

    const filter: any = {};
    if (purchaseRequestId) filter.purchaseRequestId = purchaseRequestId;
    if (status) filter.status = status;

    const purchaseOrders = await PurchaseOrder.find(filter)
      .populate('purchaseRequestId')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: purchaseOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const purchaseOrder = await PurchaseOrder.create(body);
    const populated = await PurchaseOrder.findById(purchaseOrder._id).populate('purchaseRequestId');

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'PO Number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


