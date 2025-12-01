import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Asset from '@/models/Asset';
import HubManager from '@/models/HubManager';
import Driver from '@/models/Driver';
import Rental from '@/models/Rental';
import MaintenanceRequest from '@/models/MaintenanceRequest';
import PurchaseRequest from '@/models/PurchaseRequest';
import { AssetStatus, OwnershipType, DriverStatus, RentalType, RentalStatus, MaintenanceStatus, PurchaseRequestStatus, ItemCategory } from '@/types';

export async function POST() {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Asset.deleteMany({});
    await HubManager.deleteMany({});
    await Driver.deleteMany({});
    await Rental.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    await PurchaseRequest.deleteMany({});

    // Create Hub Managers
    const hubManager1 = await HubManager.create({
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@snap-e.com',
      phone: '+91-9876543210',
      hubLocation: 'HUB-DEL-001',
      employeeCode: 'HM001',
      isActive: true,
    });

    const hubManager2 = await HubManager.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@snap-e.com',
      phone: '+91-9876543211',
      hubLocation: 'HUB-MUM-001',
      employeeCode: 'HM002',
      isActive: true,
    });

    const hubManager3 = await HubManager.create({
      name: 'Amit Patel',
      email: 'amit.patel@snap-e.com',
      phone: '+91-9876543212',
      hubLocation: 'HUB-BLR-001',
      employeeCode: 'HM003',
      isActive: true,
    });

    // Create Drivers
    const driver1 = await Driver.create({
      name: 'Mohammed Ali',
      phone: '+91-9123456789',
      licenseNumber: 'DL-1234567890',
      licenseExpiryDate: new Date('2025-12-31'),
      address: '123 Main Street, New Delhi',
      isBlacklisted: false,
      status: DriverStatus.ACTIVE,
    });

    const driver2 = await Driver.create({
      name: 'Suresh Reddy',
      phone: '+91-9123456790',
      licenseNumber: 'DL-1234567891',
      licenseExpiryDate: new Date('2025-11-30'),
      address: '456 Park Avenue, Mumbai',
      isBlacklisted: false,
      status: DriverStatus.ACTIVE,
    });

    const driver3 = await Driver.create({
      name: 'Ravi Singh',
      phone: '+91-9123456791',
      licenseNumber: 'DL-1234567892',
      licenseExpiryDate: new Date('2024-10-15'),
      address: '789 MG Road, Bangalore',
      isBlacklisted: false,
      status: DriverStatus.ACTIVE,
    });

    const driver4 = await Driver.create({
      name: 'Kiran Desai',
      phone: '+91-9123456792',
      licenseNumber: 'DL-1234567893',
      licenseExpiryDate: new Date('2025-09-20'),
      address: '321 Church Street, Bangalore',
      isBlacklisted: true,
      status: DriverStatus.INACTIVE,
    });

    // Create Assets
    const asset1 = await Asset.create({
      registrationNumber: 'DL-01-AB-1234',
      model: 'Maruti Swift',
      variant: 'VDI',
      capacity: 5,
      purchaseDate: new Date('2023-01-15'),
      ownershipType: OwnershipType.OWNED,
      status: AssetStatus.AVAILABLE,
      documents: [
        {
          type: 'RC',
          documentNumber: 'RC123456',
          expiryDate: new Date('2025-01-15'),
        },
        {
          type: 'Insurance',
          documentNumber: 'INS789012',
          expiryDate: new Date('2024-12-31'),
        },
      ],
    });

    const asset2 = await Asset.create({
      registrationNumber: 'MH-01-CD-5678',
      model: 'Hyundai Creta',
      variant: 'SX',
      capacity: 5,
      purchaseDate: new Date('2023-03-20'),
      ownershipType: OwnershipType.OWNED,
      status: AssetStatus.RENTED,
      documents: [
        {
          type: 'RC',
          documentNumber: 'RC234567',
          expiryDate: new Date('2025-03-20'),
        },
      ],
    });

    const asset3 = await Asset.create({
      registrationNumber: 'KA-01-EF-9012',
      model: 'Toyota Innova',
      variant: 'VX',
      capacity: 7,
      purchaseDate: new Date('2022-11-10'),
      ownershipType: OwnershipType.LEASED,
      status: AssetStatus.UNDER_MAINTENANCE,
      documents: [
        {
          type: 'RC',
          documentNumber: 'RC345678',
          expiryDate: new Date('2024-11-10'),
        },
        {
          type: 'PUC',
          documentNumber: 'PUC456789',
          expiryDate: new Date('2024-06-30'),
        },
      ],
    });

    const asset4 = await Asset.create({
      registrationNumber: 'DL-02-GH-3456',
      model: 'Mahindra XUV500',
      variant: 'W8',
      capacity: 7,
      purchaseDate: new Date('2023-05-12'),
      ownershipType: OwnershipType.OWNED,
      status: AssetStatus.AVAILABLE,
      documents: [
        {
          type: 'RC',
          documentNumber: 'RC456789',
          expiryDate: new Date('2025-05-12'),
        },
      ],
    });

    const asset5 = await Asset.create({
      registrationNumber: 'MH-02-IJ-7890',
      model: 'Honda City',
      variant: 'VX',
      capacity: 5,
      purchaseDate: new Date('2023-07-25'),
      ownershipType: OwnershipType.OWNED,
      status: AssetStatus.RESERVED,
      documents: [
        {
          type: 'RC',
          documentNumber: 'RC567890',
          expiryDate: new Date('2025-07-25'),
        },
      ],
    });

    // Create Rentals
    const rental1 = await Rental.create({
      driverId: driver1._id,
      assetId: asset2._id,
      hubId: 'HUB-DEL-001',
      rentalType: RentalType.WEEKLY,
      startDateTime: new Date('2024-01-15T08:00:00'),
      expectedReturnDateTime: new Date('2024-01-22T18:00:00'),
      rentalAmount: 5000,
      depositAmount: 10000,
      status: RentalStatus.ONGOING,
    });

    const rental2 = await Rental.create({
      driverId: driver2._id,
      assetId: asset4._id,
      hubId: 'HUB-MUM-001',
      rentalType: RentalType.WEEKLY,
      startDateTime: new Date('2024-01-10T09:00:00'),
      endDateTime: new Date('2024-01-17T18:00:00'),
      rentalAmount: 12000,
      depositAmount: 15000,
      status: RentalStatus.COMPLETED,
    });

    // Create Maintenance Requests
    const maintenance1 = await MaintenanceRequest.create({
      assetId: asset3._id,
      raisedByHubManagerId: hubManager3._id,
      serviceCenterName: 'AutoCare Service Center',
      issueDescription: 'Engine oil leak and brake pad replacement required',
      estimatedCost: 8500,
      estimationDetails: [
        {
          itemName: 'Engine Oil',
          quantity: 4,
          unitPrice: 500,
          totalPrice: 2000,
          isApproved: true,
        },
        {
          itemName: 'Brake Pads (Front)',
          quantity: 2,
          unitPrice: 2500,
          totalPrice: 5000,
          isApproved: true,
        },
        {
          itemName: 'Labor Charges',
          quantity: 1,
          unitPrice: 1500,
          totalPrice: 1500,
          isApproved: true,
        },
      ],
      status: MaintenanceStatus.IN_PROGRESS,
      vendorDetails: {
        name: 'AutoCare Service Center',
        contact: '+91-9876543215',
        address: '123 Service Road, Bangalore',
      },
    });

    const maintenance2 = await MaintenanceRequest.create({
      assetId: asset1._id,
      raisedByHubManagerId: hubManager1._id,
      serviceCenterName: 'QuickFix Garage',
      issueDescription: 'AC not working, needs servicing',
      estimatedCost: 3500,
      estimationDetails: [
        {
          itemName: 'AC Gas Refill',
          quantity: 1,
          unitPrice: 2000,
          totalPrice: 2000,
        },
        {
          itemName: 'AC Filter Replacement',
          quantity: 1,
          unitPrice: 800,
          totalPrice: 800,
        },
        {
          itemName: 'Service Charges',
          quantity: 1,
          unitPrice: 700,
          totalPrice: 700,
        },
      ],
      status: MaintenanceStatus.PENDING_APPROVAL,
    });

    // Create Purchase Requests
    const purchase1 = await PurchaseRequest.create({
      requestedByHubManagerId: hubManager1._id,
      hubId: 'HUB-DEL-001',
      items: [
        {
          itemName: 'MRF Tyre 185/65 R15',
          category: ItemCategory.TYRE,
          quantity: 4,
          estimatedUnitPrice: 4500,
          justification: 'Replacement of worn out tyres for 3 vehicles',
        },
        {
          itemName: 'Engine Oil 5W-30',
          category: ItemCategory.OIL,
          quantity: 20,
          estimatedUnitPrice: 500,
          justification: 'Regular maintenance stock for fleet',
        },
        {
          itemName: 'Brake Pads Front',
          category: ItemCategory.BRAKE_PAD,
          quantity: 4,
          estimatedUnitPrice: 2500,
          justification: 'Replacement parts for upcoming services',
        },
      ],
      status: PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL,
    });

    const purchase2 = await PurchaseRequest.create({
      requestedByHubManagerId: hubManager2._id,
      hubId: 'HUB-MUM-001',
      items: [
        {
          itemName: 'Seat Covers Premium',
          category: ItemCategory.SEAT_COVER,
          quantity: 5,
          estimatedUnitPrice: 2000,
          justification: 'Upgrade interior for customer satisfaction',
        },
        {
          itemName: 'Floor Mats Rubber',
          category: ItemCategory.FLOOR_MAT,
          quantity: 5,
          estimatedUnitPrice: 800,
          justification: 'Protect vehicle flooring',
        },
      ],
      status: PurchaseRequestStatus.SENT_TO_FINANCE,
      financeNotified: true,
      financeNotifiedAt: new Date(),
    });

    const purchase3 = await PurchaseRequest.create({
      requestedByHubManagerId: hubManager3._id,
      hubId: 'HUB-BLR-001',
      items: [
        {
          itemName: 'Battery 12V 60Ah',
          category: ItemCategory.BATTERY,
          quantity: 2,
          estimatedUnitPrice: 6500,
          justification: 'Replace old batteries in 2 vehicles',
        },
        {
          itemName: 'Windshield Wipers',
          category: ItemCategory.WIPER,
          quantity: 6,
          estimatedUnitPrice: 400,
          justification: 'Replace worn wipers for monsoon season',
        },
      ],
      status: PurchaseRequestStatus.DRAFT,
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        hubManagers: 3,
        drivers: 4,
        assets: 5,
        rentals: 2,
        maintenanceRequests: 2,
        purchaseRequests: 3,
      },
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

