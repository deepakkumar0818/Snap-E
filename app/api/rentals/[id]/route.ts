import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Rental, { RentalStatus } from '@/models/Rental';
import Asset, { AssetStatus } from '@/models/Asset';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const rental = await Rental.findById(params.id)
      .populate('driverId', 'name phone licenseNumber')
      .populate('assetId', 'registrationNumber model variant');
    if (!rental) {
      return NextResponse.json({ success: false, error: 'Rental not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rental });
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
    const rental = await Rental.findById(params.id);

    if (!rental) {
      return NextResponse.json({ success: false, error: 'Rental not found' }, { status: 404 });
    }

    // If marking as completed, update asset status
    if (body.status === RentalStatus.COMPLETED && rental.status !== RentalStatus.COMPLETED) {
      const newAssetStatus = body.assetStatusAfterReturn || AssetStatus.AVAILABLE;
      await Asset.findByIdAndUpdate(rental.assetId, { status: newAssetStatus });
      body.endDateTime = body.endDateTime || new Date();
    }

    const updatedRental = await Rental.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate('driverId', 'name phone licenseNumber')
      .populate('assetId', 'registrationNumber model variant');

    return NextResponse.json({ success: true, data: updatedRental });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


