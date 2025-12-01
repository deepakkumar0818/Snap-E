'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import { MaintenanceStatus } from '@/types';

interface MaintenanceRequest {
  _id: string;
  assetId: { registrationNumber: string; model: string; variant: string };
  raisedByHubManagerId: { name: string; email: string; hubLocation: string };
  serviceCenterName: string;
  issueDescription: string;
  estimatedCost: number;
  estimationDetails: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isApproved?: boolean;
  }>;
  status: MaintenanceStatus;
  approvalComments?: string;
  vendorDetails?: {
    name?: string;
    contact?: string;
    address?: string;
  };
  billReference?: string;
}

// Dummy data mapping
const getDummyMaintenanceRequest = (id: string): MaintenanceRequest | null => {
  const requestMap: Record<string, MaintenanceRequest> = {
    '1': {
      _id: '1',
      assetId: { registrationNumber: 'DL-01-AB-1234', model: 'Tata Nexon', variant: 'EV Prime' },
      raisedByHubManagerId: { name: 'Priya Sharma', email: 'priya.sharma@snap-e.com', hubLocation: 'Delhi Central' },
      serviceCenterName: 'Tata Service Center - Connaught Place',
      issueDescription: 'Regular servicing and brake pad replacement. Vehicle showing signs of brake wear during recent inspection.',
      estimatedCost: 8500,
      estimationDetails: [
        { itemName: 'Brake Pads (Front)', quantity: 1, unitPrice: 3500, totalPrice: 3500, isApproved: false },
        { itemName: 'Brake Pads (Rear)', quantity: 1, unitPrice: 2500, totalPrice: 2500, isApproved: false },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 1500, totalPrice: 1500, isApproved: false },
        { itemName: 'Brake Fluid', quantity: 1, unitPrice: 1000, totalPrice: 1000, isApproved: false },
      ],
      status: MaintenanceStatus.PENDING_APPROVAL,
    },
    '2': {
      _id: '2',
      assetId: { registrationNumber: 'HR-26-AB-5678', model: 'Mahindra eVerito', variant: 'D4' },
      raisedByHubManagerId: { name: 'Rahul Verma', email: 'rahul.verma@snap-e.com', hubLocation: 'Delhi North' },
      serviceCenterName: 'Mahindra Service Center - Gurgaon',
      issueDescription: 'Battery replacement and electrical system check. Battery not holding charge properly.',
      estimatedCost: 12000,
      estimationDetails: [
        { itemName: 'Battery (12V)', quantity: 1, unitPrice: 8500, totalPrice: 8500, isApproved: true },
        { itemName: 'Battery Installation', quantity: 1, unitPrice: 500, totalPrice: 500, isApproved: true },
        { itemName: 'Electrical System Check', quantity: 1, unitPrice: 2000, totalPrice: 2000, isApproved: true },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 1000, totalPrice: 1000, isApproved: true },
      ],
      status: MaintenanceStatus.APPROVED,
      approvalComments: 'Approved for battery replacement. Critical for vehicle operation.',
    },
    '3': {
      _id: '3',
      assetId: { registrationNumber: 'HR-26-CD-3456', model: 'Mahindra e2o', variant: 'Plus' },
      raisedByHubManagerId: { name: 'Anjali Patel', email: 'anjali.patel@snap-e.com', hubLocation: 'Delhi South' },
      serviceCenterName: 'Mahindra Service Center - Delhi',
      issueDescription: 'Tyre replacement (all 4 tyres). Tyres have reached end of life with low tread depth.',
      estimatedCost: 18000,
      estimationDetails: [
        { itemName: 'Tyre (Front Left)', quantity: 1, unitPrice: 4500, totalPrice: 4500, isApproved: true },
        { itemName: 'Tyre (Front Right)', quantity: 1, unitPrice: 4500, totalPrice: 4500, isApproved: true },
        { itemName: 'Tyre (Rear Left)', quantity: 1, unitPrice: 4500, totalPrice: 4500, isApproved: true },
        { itemName: 'Tyre (Rear Right)', quantity: 1, unitPrice: 4500, totalPrice: 4500, isApproved: true },
      ],
      status: MaintenanceStatus.IN_PROGRESS,
      vendorDetails: {
        name: 'Mahindra Service Center - Delhi',
        contact: '+91 33 2456 7890',
        address: '123, MG Road, Gurgaon - 122001',
      },
    },
    '4': {
      _id: '4',
      assetId: { registrationNumber: 'HR-26-EF-2345', model: 'Mahindra eVerito', variant: 'D6' },
      raisedByHubManagerId: { name: 'Vikram Singh', email: 'vikram.singh@snap-e.com', hubLocation: 'Gurgaon Sector 29' },
      serviceCenterName: 'Mahindra Service Center - Gurgaon',
      issueDescription: 'AC compressor repair and gas refill. AC not cooling properly.',
      estimatedCost: 15000,
      estimationDetails: [
        { itemName: 'AC Compressor Repair', quantity: 1, unitPrice: 8000, totalPrice: 8000, isApproved: true },
        { itemName: 'AC Gas Refill', quantity: 1, unitPrice: 3000, totalPrice: 3000, isApproved: true },
        { itemName: 'AC Filter Replacement', quantity: 1, unitPrice: 2000, totalPrice: 2000, isApproved: true },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 2000, totalPrice: 2000, isApproved: true },
      ],
      status: MaintenanceStatus.COMPLETED,
      vendorDetails: {
        name: 'Mahindra Service Center - Gurgaon',
        contact: '+91 33 2456 7891',
        address: '456, Sector 29, Gurgaon - 122001',
      },
      billReference: 'BILL-2024-001234',
    },
    '5': {
      _id: '5',
      assetId: { registrationNumber: 'DL-08-OP-0123', model: 'Mahindra e2o', variant: 'Plus' },
      raisedByHubManagerId: { name: 'Sneha Das', email: 'sneha.das@snap-e.com', hubLocation: 'Gurgaon Cyber City' },
      serviceCenterName: 'Mahindra Service Center - Connaught Place',
      issueDescription: 'Engine oil change and filter replacement. Regular maintenance service.',
      estimatedCost: 3200,
      estimationDetails: [
        { itemName: 'Engine Oil (5W-30)', quantity: 4, unitPrice: 500, totalPrice: 2000, isApproved: false },
        { itemName: 'Oil Filter', quantity: 1, unitPrice: 700, totalPrice: 700, isApproved: false },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 500, totalPrice: 500, isApproved: false },
      ],
      status: MaintenanceStatus.PENDING_APPROVAL,
    },
    '6': {
      _id: '6',
      assetId: { registrationNumber: 'HR-26-IJ-4567', model: 'Tata Tigor', variant: 'EV XZ' },
      raisedByHubManagerId: { name: 'Arjun Banerjee', email: 'arjun.banerjee@snap-e.com', hubLocation: 'Delhi East' },
      serviceCenterName: 'Tata Service Center - Gurgaon',
      issueDescription: 'Windshield replacement due to crack. Large crack affecting visibility.',
      estimatedCost: 9500,
      estimationDetails: [
        { itemName: 'Windshield Glass', quantity: 1, unitPrice: 7500, totalPrice: 7500, isApproved: true },
        { itemName: 'Installation Charge', quantity: 1, unitPrice: 1500, totalPrice: 1500, isApproved: true },
        { itemName: 'Sealant & Adhesive', quantity: 1, unitPrice: 500, totalPrice: 500, isApproved: true },
      ],
      status: MaintenanceStatus.APPROVED,
      approvalComments: 'Approved. Safety concern - windshield replacement necessary.',
    },
    '7': {
      _id: '7',
      assetId: { registrationNumber: 'HR-26-KL-6789', model: 'Tata Nexon', variant: 'EV Max' },
      raisedByHubManagerId: { name: 'Priya Sharma', email: 'priya.sharma@snap-e.com', hubLocation: 'Delhi Central' },
      serviceCenterName: 'Tata Service Center - Connaught Place',
      issueDescription: 'Suspension repair and alignment. Vehicle pulling to one side.',
      estimatedCost: 11000,
      estimationDetails: [
        { itemName: 'Shock Absorber (Front)', quantity: 2, unitPrice: 3000, totalPrice: 6000, isApproved: true },
        { itemName: 'Wheel Alignment', quantity: 1, unitPrice: 2000, totalPrice: 2000, isApproved: true },
        { itemName: 'Suspension Bushing', quantity: 4, unitPrice: 500, totalPrice: 2000, isApproved: true },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 1000, totalPrice: 1000, isApproved: true },
      ],
      status: MaintenanceStatus.IN_PROGRESS,
      vendorDetails: {
        name: 'Tata Service Center - Connaught Place',
        contact: '+91 33 2245 6789',
        address: '789, Connaught Place, New Delhi - 110001',
      },
    },
    '8': {
      _id: '8',
      assetId: { registrationNumber: 'HR-26-MN-8901', model: 'Tata Tigor', variant: 'EV XZ+' },
      raisedByHubManagerId: { name: 'Rahul Verma', email: 'rahul.verma@snap-e.com', hubLocation: 'Delhi North' },
      serviceCenterName: 'Tata Service Center - Gurgaon',
      issueDescription: 'Headlight and taillight replacement. Both lights damaged in minor accident.',
      estimatedCost: 4500,
      estimationDetails: [
        { itemName: 'Headlight Assembly', quantity: 1, unitPrice: 2500, totalPrice: 2500, isApproved: true },
        { itemName: 'Taillight Assembly', quantity: 1, unitPrice: 1500, totalPrice: 1500, isApproved: true },
        { itemName: 'Installation', quantity: 1, unitPrice: 500, totalPrice: 500, isApproved: true },
      ],
      status: MaintenanceStatus.COMPLETED,
      vendorDetails: {
        name: 'Tata Service Center - Gurgaon',
        contact: '+91 33 2456 7892',
        address: '321, Cyber City, Gurgaon - 122002',
      },
      billReference: 'BILL-2024-001235',
    },
    '9': {
      _id: '9',
      assetId: { registrationNumber: 'HR-26-OP-2345', model: 'Tata Nexon', variant: 'EV Prime' },
      raisedByHubManagerId: { name: 'Anjali Patel', email: 'anjali.patel@snap-e.com', hubLocation: 'Delhi South' },
      serviceCenterName: 'Tata Service Center - Delhi',
      issueDescription: 'Wiper blade replacement and fluid top-up. Minor maintenance request.',
      estimatedCost: 1800,
      estimationDetails: [
        { itemName: 'Wiper Blades (Set)', quantity: 1, unitPrice: 800, totalPrice: 800, isApproved: false },
        { itemName: 'Wiper Fluid', quantity: 2, unitPrice: 200, totalPrice: 400, isApproved: false },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 600, totalPrice: 600, isApproved: false },
      ],
      status: MaintenanceStatus.REJECTED,
      approvalComments: 'Rejected - Can be handled during next scheduled service.',
    },
    '10': {
      _id: '10',
      assetId: { registrationNumber: 'HR-26-QR-5678', model: 'Mahindra eVerito', variant: 'D4' },
      raisedByHubManagerId: { name: 'Vikram Singh', email: 'vikram.singh@snap-e.com', hubLocation: 'Gurgaon Sector 29' },
      serviceCenterName: 'Mahindra Service Center - Gurgaon',
      issueDescription: 'Seat cover replacement and interior cleaning. Seats showing wear and tear.',
      estimatedCost: 5500,
      estimationDetails: [
        { itemName: 'Seat Covers (Front)', quantity: 1, unitPrice: 3000, totalPrice: 3000, isApproved: false },
        { itemName: 'Seat Covers (Rear)', quantity: 1, unitPrice: 1500, totalPrice: 1500, isApproved: false },
        { itemName: 'Interior Deep Cleaning', quantity: 1, unitPrice: 1000, totalPrice: 1000, isApproved: false },
      ],
      status: MaintenanceStatus.PENDING_APPROVAL,
    },
    '11': {
      _id: '11',
      assetId: { registrationNumber: 'HR-26-ST-9012', model: 'Tata Tigor', variant: 'EV XZ+' },
      raisedByHubManagerId: { name: 'Sneha Das', email: 'sneha.das@snap-e.com', hubLocation: 'Gurgaon Cyber City' },
      serviceCenterName: 'Tata Service Center - Connaught Place',
      issueDescription: 'Power steering pump replacement. Steering becoming heavy.',
      estimatedCost: 13500,
      estimationDetails: [
        { itemName: 'Power Steering Pump', quantity: 1, unitPrice: 10000, totalPrice: 10000, isApproved: true },
        { itemName: 'Power Steering Fluid', quantity: 2, unitPrice: 800, totalPrice: 1600, isApproved: true },
        { itemName: 'Installation & Service', quantity: 1, unitPrice: 1900, totalPrice: 1900, isApproved: true },
      ],
      status: MaintenanceStatus.APPROVED,
      approvalComments: 'Approved. Critical for safe vehicle operation.',
    },
    '12': {
      _id: '12',
      assetId: { registrationNumber: 'HR-26-UV-6789', model: 'Tata Nexon', variant: 'EV Prime' },
      raisedByHubManagerId: { name: 'Arjun Banerjee', email: 'arjun.banerjee@snap-e.com', hubLocation: 'Delhi East' },
      serviceCenterName: 'Tata Service Center - Gurgaon',
      issueDescription: 'Regular servicing and wheel alignment. Scheduled maintenance.',
      estimatedCost: 7200,
      estimationDetails: [
        { itemName: 'Engine Oil Change', quantity: 1, unitPrice: 2000, totalPrice: 2000, isApproved: true },
        { itemName: 'Oil Filter', quantity: 1, unitPrice: 700, totalPrice: 700, isApproved: true },
        { itemName: 'Air Filter', quantity: 1, unitPrice: 800, totalPrice: 800, isApproved: true },
        { itemName: 'Wheel Alignment', quantity: 1, unitPrice: 2000, totalPrice: 2000, isApproved: true },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 1700, totalPrice: 1700, isApproved: true },
      ],
      status: MaintenanceStatus.IN_PROGRESS,
      vendorDetails: {
        name: 'Tata Service Center - Gurgaon',
        contact: '+91 33 2456 7893',
        address: '654, Sector 56, Gurgaon - 122011',
      },
    },
    '13': {
      _id: '13',
      assetId: { registrationNumber: 'HR-26-WX-4567', model: 'Tata Tigor', variant: 'EV XZ+' },
      raisedByHubManagerId: { name: 'Priya Sharma', email: 'priya.sharma@snap-e.com', hubLocation: 'Delhi Central' },
      serviceCenterName: 'Tata Service Center - Connaught Place',
      issueDescription: 'Mirror replacement (side mirrors). Both side mirrors damaged.',
      estimatedCost: 2800,
      estimationDetails: [
        { itemName: 'Side Mirror (Left)', quantity: 1, unitPrice: 1200, totalPrice: 1200, isApproved: true },
        { itemName: 'Side Mirror (Right)', quantity: 1, unitPrice: 1200, totalPrice: 1200, isApproved: true },
        { itemName: 'Installation', quantity: 1, unitPrice: 400, totalPrice: 400, isApproved: true },
      ],
      status: MaintenanceStatus.COMPLETED,
      vendorDetails: {
        name: 'Tata Service Center - Connaught Place',
        contact: '+91 33 2245 6789',
        address: '789, Connaught Place, New Delhi - 110001',
      },
      billReference: 'BILL-2024-001236',
    },
    '14': {
      _id: '14',
      assetId: { registrationNumber: 'HR-26-YZ-1234', model: 'Mahindra XUV700', variant: 'AX5' },
      raisedByHubManagerId: { name: 'Rahul Verma', email: 'rahul.verma@snap-e.com', hubLocation: 'Delhi North' },
      serviceCenterName: 'Mahindra Service Center - Gurgaon',
      issueDescription: 'Transmission fluid change and service. Vehicle showing transmission issues.',
      estimatedCost: 16500,
      estimationDetails: [
        { itemName: 'Transmission Fluid', quantity: 5, unitPrice: 2000, totalPrice: 10000, isApproved: false },
        { itemName: 'Transmission Filter', quantity: 1, unitPrice: 3500, totalPrice: 3500, isApproved: false },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 3000, totalPrice: 3000, isApproved: false },
      ],
      status: MaintenanceStatus.PENDING_APPROVAL,
    },
    '15': {
      _id: '15',
      assetId: { registrationNumber: 'HR-26-AA-9012', model: 'Mahindra XUV700', variant: 'AX7' },
      raisedByHubManagerId: { name: 'Anjali Patel', email: 'anjali.patel@snap-e.com', hubLocation: 'Delhi South' },
      serviceCenterName: 'Mahindra Service Center - Delhi',
      issueDescription: 'Radiator cleaning and coolant replacement. Overheating issues reported.',
      estimatedCost: 4200,
      estimationDetails: [
        { itemName: 'Coolant (5L)', quantity: 1, unitPrice: 1500, totalPrice: 1500, isApproved: true },
        { itemName: 'Radiator Cleaning', quantity: 1, unitPrice: 1500, totalPrice: 1500, isApproved: true },
        { itemName: 'Service Charge', quantity: 1, unitPrice: 1200, totalPrice: 1200, isApproved: true },
      ],
      status: MaintenanceStatus.APPROVED,
      approvalComments: 'Approved. Important for engine health.',
    },
  };

  return requestMap[id] || null;
};

export default function MaintenanceDetailPage() {
  const params = useParams();
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchRequest();
    }
  }, [params.id]);

  const fetchRequest = async () => {
    try {
      const response = await fetch(`/api/maintenance/${params.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        setRequest(result.data);
      } else {
        // Use dummy data if API doesn't return data
        const dummyRequest = getDummyMaintenanceRequest(params.id as string);
        if (dummyRequest) {
          setRequest(dummyRequest);
        }
      }
    } catch (error) {
      console.error('Error fetching maintenance request:', error);
      // Use dummy data on error
      const dummyRequest = getDummyMaintenanceRequest(params.id as string);
      if (dummyRequest) {
        setRequest(dummyRequest);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    const colors = {
      [MaintenanceStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
      [MaintenanceStatus.APPROVED]: 'bg-snap-teal-100 text-snap-teal-800',
      [MaintenanceStatus.REJECTED]: 'bg-snap-coral-100 text-snap-coral-800',
      [MaintenanceStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [MaintenanceStatus.COMPLETED]: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!request) {
    return <div className="text-center py-12">Maintenance request not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/maintenance">
          <Button variant="secondary" size="sm">← Back to Maintenance</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Maintenance Request</h1>
            {getStatusBadge(request.status)}
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.assetId?.registrationNumber} - {request.assetId?.model}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Raised By</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.raisedByHubManagerId?.name} ({request.raisedByHubManagerId?.hubLocation})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Service Center</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.serviceCenterName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estimated Cost</dt>
              <dd className="mt-1 text-sm text-gray-900">₹{request.estimatedCost.toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Issue Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.issueDescription}</dd>
            </div>
          </dl>

          {request.estimationDetails && request.estimationDetails.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estimation Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {request.estimationDetails.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.itemName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{item.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {request.approvalComments && (
            <div className="mt-6">
              <dt className="text-sm font-medium text-gray-500">Approval Comments</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.approvalComments}</dd>
            </div>
          )}

          {request.vendorDetails && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vendor Details</h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {request.vendorDetails.name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{request.vendorDetails.name}</dd>
                  </div>
                )}
                {request.vendorDetails.contact && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">{request.vendorDetails.contact}</dd>
                  </div>
                )}
                {request.vendorDetails.address && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{request.vendorDetails.address}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {request.billReference && (
            <div className="mt-6">
              <dt className="text-sm font-medium text-gray-500">Bill Reference</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.billReference}</dd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

