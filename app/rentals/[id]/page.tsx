'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import { RentalStatus, AssetStatus, RentalType } from '@/types';

interface Rental {
  _id: string;
  driverId: { name: string; phone: string; licenseNumber?: string };
  assetId: { registrationNumber: string; model: string; variant?: string };
  hubId: string;
  rentalType: string;
  startDateTime: string;
  endDateTime?: string;
  expectedReturnDateTime?: string;
  rentalAmount: number;
  depositAmount: number;
  penaltyAmount?: number;
  startKm?: number;
  endKm?: number;
  status: RentalStatus;
}

// Dummy data mapping - matches rentals from the main page
const getDummyRental = (id: string): Rental | null => {
  const rentalMap: Record<string, Rental> = {
    '1': { _id: '1', driverId: { name: 'Rajesh Kumar', phone: '+91 98765 43210', licenseNumber: 'DL-01-2020-1234567' }, assetId: { registrationNumber: 'HR-26-AB-5678', model: 'Mahindra eVerito', variant: 'D4' }, hubId: 'Delhi Central', rentalType: RentalType.DAILY, startDateTime: '2025-01-15T09:00:00', rentalAmount: 2500, depositAmount: 5000, startKm: 15234, status: RentalStatus.ONGOING },
    '2': { _id: '2', driverId: { name: 'Amit Singh', phone: '+91 98765 43211', licenseNumber: 'DL-01-2020-1234568' }, assetId: { registrationNumber: 'DL-05-IJ-7890', model: 'Tata Nexon', variant: 'EV Max' }, hubId: 'Delhi North', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-10T10:00:00', endDateTime: '2025-01-17T18:00:00', rentalAmount: 15000, depositAmount: 10000, startKm: 23456, endKm: 24567, status: RentalStatus.COMPLETED },
    '3': { _id: '3', driverId: { name: 'Suresh Yadav', phone: '+91 98765 43212', licenseNumber: 'DL-01-2020-1234569' }, assetId: { registrationNumber: 'DL-03-EF-9012', model: 'Tata Tigor', variant: 'EV XZ+' }, hubId: 'Delhi South', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-01T08:00:00', rentalAmount: 50000, depositAmount: 15000, startKm: 18765, status: RentalStatus.ONGOING },
    '4': { _id: '4', driverId: { name: 'Vikash Sharma', phone: '+91 98765 43214', licenseNumber: 'DL-01-2020-1234571' }, assetId: { registrationNumber: 'DL-09-QR-4567', model: 'Tata Nexon', variant: 'EV Prime' }, hubId: 'Gurgaon Sector 29', rentalType: RentalType.DAILY, startDateTime: '2025-01-12T11:00:00', rentalAmount: 2800, depositAmount: 5000, startKm: 32145, status: RentalStatus.ONGOING },
    '5': { _id: '5', driverId: { name: 'Ramesh Patel', phone: '+91 98765 43215', licenseNumber: 'DL-01-2020-1234572' }, assetId: { registrationNumber: 'HR-26-KL-6789', model: 'Tata Nexon', variant: 'EV Max' }, hubId: 'Gurgaon Cyber City', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-08T09:30:00', endDateTime: '2025-01-15T19:00:00', rentalAmount: 16000, depositAmount: 10000, startKm: 28934, endKm: 30123, status: RentalStatus.COMPLETED },
    '6': { _id: '6', driverId: { name: 'Anil Kumar', phone: '+91 98765 43216', licenseNumber: 'DL-01-2020-1234573' }, assetId: { registrationNumber: 'HR-26-OP-2345', model: 'Tata Nexon', variant: 'EV Prime' }, hubId: 'Delhi East', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-05T08:00:00', rentalAmount: 48000, depositAmount: 15000, startKm: 15678, status: RentalStatus.ONGOING },
    '7': { _id: '7', driverId: { name: 'Sunil Verma', phone: '+91 98765 43217', licenseNumber: 'DL-01-2020-1234574' }, assetId: { registrationNumber: 'DL-19-FF-4567', model: 'Tata Nexon', variant: 'EV Max' }, hubId: 'Delhi Central', rentalType: RentalType.DAILY, startDateTime: '2025-01-14T10:00:00', rentalAmount: 2600, depositAmount: 5000, startKm: 41234, status: RentalStatus.ONGOING },
    '8': { _id: '8', driverId: { name: 'Pradeep Roy', phone: '+91 98765 43218', licenseNumber: 'DL-01-2020-1234575' }, assetId: { registrationNumber: 'DL-22-II-6789', model: 'Tata Nexon', variant: 'EV Prime' }, hubId: 'Delhi North', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-05T09:00:00', endDateTime: '2025-01-12T18:00:00', rentalAmount: 15500, depositAmount: 10000, startKm: 25678, endKm: 26890, status: RentalStatus.COMPLETED },
    '9': { _id: '9', driverId: { name: 'Mahesh Banerjee', phone: '+91 98765 43220', licenseNumber: 'DL-01-2020-1234577' }, assetId: { registrationNumber: 'DL-25-LL-7890', model: 'Tata Safari', variant: 'XE' }, hubId: 'Delhi South', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-02T08:00:00', rentalAmount: 60000, depositAmount: 20000, startKm: 12345, status: RentalStatus.ONGOING },
    '10': { _id: '10', driverId: { name: 'Dinesh Chatterjee', phone: '+91 98765 43221', licenseNumber: 'DL-01-2020-1234578' }, assetId: { registrationNumber: 'HR-26-YZ-1234', model: 'Mahindra XUV700', variant: 'AX5' }, hubId: 'Gurgaon Sector 29', rentalType: RentalType.DAILY, startDateTime: '2025-01-13T11:00:00', rentalAmount: 3500, depositAmount: 7000, startKm: 37890, status: RentalStatus.ONGOING },
    '11': { _id: '11', driverId: { name: 'Kiran Sen', phone: '+91 98765 43222', licenseNumber: 'DL-01-2020-1234579' }, assetId: { registrationNumber: 'DL-27-NN-5678', model: 'Tata Safari', variant: 'XM' }, hubId: 'Gurgaon Cyber City', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-03T09:00:00', endDateTime: '2025-01-10T18:00:00', rentalAmount: 20000, depositAmount: 12000, startKm: 29876, endKm: 31234, status: RentalStatus.COMPLETED },
    '12': { _id: '12', driverId: { name: 'Ravi Mondal', phone: '+91 98765 43223', licenseNumber: 'DL-01-2020-1234580' }, assetId: { registrationNumber: 'HR-26-AA-9012', model: 'Mahindra XUV700', variant: 'AX7' }, hubId: 'Delhi East', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-04T08:00:00', rentalAmount: 65000, depositAmount: 20000, startKm: 14567, status: RentalStatus.ONGOING },
    '13': { _id: '13', driverId: { name: 'Sandeep Dutta', phone: '+91 98765 43224', licenseNumber: 'DL-01-2020-1234581' }, assetId: { registrationNumber: 'DL-30-QQ-7890', model: 'Mahindra XUV700', variant: 'AX3' }, hubId: 'Delhi Central', rentalType: RentalType.DAILY, startDateTime: '2025-01-11T10:30:00', rentalAmount: 3200, depositAmount: 7000, startKm: 40123, status: RentalStatus.ONGOING },
    '14': { _id: '14', driverId: { name: 'Arjun Basu', phone: '+91 98765 43225', licenseNumber: 'DL-01-2020-1234582' }, assetId: { registrationNumber: 'HR-26-CC-6789', model: 'Mahindra XUV700', variant: 'AX5' }, hubId: 'Delhi North', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-01T09:00:00', endDateTime: '2025-01-08T18:00:00', rentalAmount: 19500, depositAmount: 12000, startKm: 26789, endKm: 28012, status: RentalStatus.COMPLETED },
    '15': { _id: '15', driverId: { name: 'Hari Bose', phone: '+91 98765 43228', licenseNumber: 'DL-01-2020-1234585' }, assetId: { registrationNumber: 'DL-33-TT-0123', model: 'Tata Safari', variant: 'XM Plus' }, hubId: 'Delhi South', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-06T08:00:00', rentalAmount: 58000, depositAmount: 20000, startKm: 11234, status: RentalStatus.ONGOING },
    '16': { _id: '16', driverId: { name: 'Ishwar Naskar', phone: '+91 98765 43229', licenseNumber: 'DL-01-2020-1234586' }, assetId: { registrationNumber: 'DL-35-VV-8901', model: 'Tata Safari', variant: 'XZ Plus' }, hubId: 'Gurgaon Sector 29', rentalType: RentalType.DAILY, startDateTime: '2025-01-10T12:00:00', rentalAmount: 3000, depositAmount: 7000, startKm: 36567, status: RentalStatus.ONGOING },
    '17': { _id: '17', driverId: { name: 'Jagdish Halder', phone: '+91 98765 43230', licenseNumber: 'DL-01-2020-1234587' }, assetId: { registrationNumber: 'HR-26-WX-4567', model: 'Tata Tigor', variant: 'EV XZ+' }, hubId: 'Gurgaon Cyber City', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-07T09:00:00', endDateTime: '2025-01-14T18:00:00', rentalAmount: 14500, depositAmount: 10000, startKm: 22345, endKm: 23567, status: RentalStatus.COMPLETED },
    '18': { _id: '18', driverId: { name: 'Kailash Saha', phone: '+91 98765 43231', licenseNumber: 'DL-01-2020-1234588' }, assetId: { registrationNumber: 'DL-01-AB-1234', model: 'Tata Nexon', variant: 'EV Prime' }, hubId: 'Delhi East', rentalType: RentalType.DAILY, startDateTime: '2025-01-09T10:00:00', rentalAmount: 2400, depositAmount: 5000, startKm: 44567, status: RentalStatus.ONGOING },
  };

  return rentalMap[id] || null;
};

export default function RentalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [assetStatusAfterReturn, setAssetStatusAfterReturn] = useState<AssetStatus>(AssetStatus.AVAILABLE);

  useEffect(() => {
    if (params.id) {
      fetchRental();
    }
  }, [params.id]);

  const fetchRental = async () => {
    try {
      const response = await fetch(`/api/rentals/${params.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        setRental(result.data);
      } else {
        // Use dummy data if API doesn't return data
        const dummyRental = getDummyRental(params.id as string);
        if (dummyRental) {
          setRental(dummyRental);
        }
      }
    } catch (error) {
      console.error('Error fetching rental:', error);
      // Use dummy data on error
      const dummyRental = getDummyRental(params.id as string);
      if (dummyRental) {
        setRental(dummyRental);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRental = async () => {
    if (!confirm('Mark this rental as completed?')) return;

    // Check if this is a dummy data ID (numeric string)
    const isDummyData = /^\d+$/.test(params.id as string);
    
    if (isDummyData) {
      // For dummy data, just show success and redirect (no API call)
      alert('Rental marked as completed! (Note: This is dummy data - changes are not persisted)');
      router.push('/rentals');
      return;
    }

    setCompleting(true);
    try {
      const response = await fetch(`/api/rentals/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: RentalStatus.COMPLETED,
          assetStatusAfterReturn: assetStatusAfterReturn,
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/rentals');
      } else {
        alert(result.error || 'Failed to complete rental');
      }
    } catch (error) {
      console.error('Error completing rental:', error);
      alert('Failed to complete rental');
    } finally {
      setCompleting(false);
    }
  };

  const getStatusBadge = (status: RentalStatus) => {
    const colors = {
      [RentalStatus.ONGOING]: 'bg-snap-teal-100 text-snap-teal-800',
      [RentalStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [RentalStatus.CANCELLED]: 'bg-snap-coral-100 text-snap-coral-800',
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

  if (!rental) {
    return <div className="text-center py-12">Rental not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/rentals">
          <Button variant="secondary" size="sm">← Back to Rentals</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Rental Details</h1>
            {getStatusBadge(rental.status)}
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Driver</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {rental.driverId?.name} ({rental.driverId?.phone})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {rental.assetId?.registrationNumber} - {rental.assetId?.model}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Hub</dt>
              <dd className="mt-1 text-sm text-gray-900">{rental.hubId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rental Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{rental.rentalType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Start Date & Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(rental.startDateTime).toLocaleString()}
              </dd>
            </div>
            {rental.endDateTime && (
              <div>
                <dt className="text-sm font-medium text-gray-500">End Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(rental.endDateTime).toLocaleString()}
                </dd>
              </div>
            )}
            {rental.startKm !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">KM at Start</dt>
                <dd className="mt-1 text-sm text-gray-900">{rental.startKm.toLocaleString()} km</dd>
              </div>
            )}
            {rental.endKm !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">KM at Return</dt>
                <dd className="mt-1 text-sm text-gray-900">{rental.endKm.toLocaleString()} km</dd>
              </div>
            )}
            {rental.startKm !== undefined && rental.endKm !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Distance Traveled</dt>
                <dd className="mt-1 text-sm text-gray-900 font-semibold text-snap-teal-600">
                  {(rental.endKm - rental.startKm).toLocaleString()} km
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Rental Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">₹{rental.rentalAmount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Deposit Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">₹{rental.depositAmount.toLocaleString()}</dd>
            </div>
            {rental.penaltyAmount && rental.penaltyAmount > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Penalty Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">₹{rental.penaltyAmount.toLocaleString()}</dd>
              </div>
            )}
          </dl>

          {rental.status === RentalStatus.ONGOING && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Rental</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Status After Return
                </label>
                <select
                  value={assetStatusAfterReturn}
                  onChange={(e) => setAssetStatusAfterReturn(e.target.value as AssetStatus)}
                  className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
                >
                  <option value={AssetStatus.AVAILABLE}>AVAILABLE</option>
                  <option value={AssetStatus.UNDER_MAINTENANCE}>UNDER_MAINTENANCE</option>
                </select>
              </div>
              <Button onClick={handleCompleteRental} disabled={completing} variant="success">
                {completing ? 'Completing...' : 'Mark as Completed'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

