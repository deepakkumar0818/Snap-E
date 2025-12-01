import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Driver, { DriverStatus } from '@/models/Driver';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const isBlacklisted = searchParams.get('isBlacklisted');

    const filter: any = {};
    if (status && Object.values(DriverStatus).includes(status as DriverStatus)) {
      filter.status = status;
    }
    if (isBlacklisted !== null) {
      filter.isBlacklisted = isBlacklisted === 'true';
    }

    const drivers = await Driver.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const driver = await Driver.create(body);
    return NextResponse.json({ success: true, data: driver }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Phone or License Number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



