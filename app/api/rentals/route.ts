import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Rental, { RentalStatus } from '@/models/Rental';
import Asset, { AssetStatus } from '@/models/Asset';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const driverId = searchParams.get('driverId');
    const assetId = searchParams.get('assetId');
    const hubId = searchParams.get('hubId');

    const filter: any = {};
    if (status && Object.values(RentalStatus).includes(status as RentalStatus)) {
      filter.status = status;
    }
    if (driverId) filter.driverId = driverId;
    if (assetId) filter.assetId = assetId;
    if (hubId) filter.hubId = hubId;

    const rentals = await Rental.find(filter)
      .populate('driverId', 'name phone licenseNumber')
      .populate('assetId', 'registrationNumber model variant')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: rentals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Check if asset is available
    const asset = await Asset.findById(body.assetId);
    if (!asset) {
      return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    }
    if (asset.status !== AssetStatus.AVAILABLE && asset.status !== AssetStatus.RESERVED) {
      return NextResponse.json(
        { success: false, error: `Asset is ${asset.status}` },
        { status: 400 }
      );
    }

    // Create rental
    const rental = await Rental.create(body);

    // Update asset status
    await Asset.findByIdAndUpdate(body.assetId, { status: AssetStatus.RENTED });

    const populatedRental = await Rental.findById(rental._id)
      .populate('driverId', 'name phone licenseNumber')
      .populate('assetId', 'registrationNumber model variant');

    return NextResponse.json({ success: true, data: populatedRental }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


