import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Asset, { AssetStatus } from '@/models/Asset';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const filter: any = {};
    if (status && Object.values(AssetStatus).includes(status as AssetStatus)) {
      filter.status = status;
    }

    const assets = await Asset.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: assets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const asset = await Asset.create(body);
    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Registration number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


