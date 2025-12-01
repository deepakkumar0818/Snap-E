import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import HubManager from '@/models/HubManager';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const hubLocation = searchParams.get('hubLocation');
    const isActive = searchParams.get('isActive');

    const filter: any = {};
    if (hubLocation) filter.hubLocation = hubLocation;
    if (isActive !== null) filter.isActive = isActive === 'true';

    const hubManagers = await HubManager.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: hubManagers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const hubManager = await HubManager.create(body);
    return NextResponse.json({ success: true, data: hubManager }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Email or Employee Code already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


