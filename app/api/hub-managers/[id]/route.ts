import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import HubManager from '@/models/HubManager';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const hubManager = await HubManager.findById(params.id);
    if (!hubManager) {
      return NextResponse.json({ success: false, error: 'Hub Manager not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: hubManager });
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
    const hubManager = await HubManager.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!hubManager) {
      return NextResponse.json({ success: false, error: 'Hub Manager not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: hubManager });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const hubManager = await HubManager.findByIdAndDelete(params.id);
    if (!hubManager) {
      return NextResponse.json({ success: false, error: 'Hub Manager not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Hub Manager deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



