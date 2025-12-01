'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { RentalStatus, RentalType } from '@/types';

interface Rental {
  _id: string;
  driverId: { name: string; phone: string };
  assetId: { registrationNumber: string; model: string };
  hubId: string;
  rentalType: string;
  startDateTime: string;
  endDateTime?: string;
  rentalAmount: number;
  depositAmount: number;
  status: RentalStatus;
}

// Dummy data fallback
const dummyRentals: Rental[] = [
  { _id: '1', driverId: { name: 'Rajesh Kumar', phone: '+91 98765 43210' }, assetId: { registrationNumber: 'HR-26-AB-5678', model: 'Mahindra eVerito' }, hubId: 'Delhi Central', rentalType: RentalType.DAILY, startDateTime: '2025-01-15T09:00:00', rentalAmount: 2500, depositAmount: 5000, status: RentalStatus.ONGOING },
  { _id: '2', driverId: { name: 'Amit Singh', phone: '+91 98765 43211' }, assetId: { registrationNumber: 'DL-05-IJ-7890', model: 'Tata Nexon' }, hubId: 'Delhi North', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-10T10:00:00', endDateTime: '2025-01-17T18:00:00', rentalAmount: 15000, depositAmount: 10000, status: RentalStatus.COMPLETED },
  { _id: '3', driverId: { name: 'Suresh Yadav', phone: '+91 98765 43212' }, assetId: { registrationNumber: 'DL-03-EF-9012', model: 'Tata Tigor' }, hubId: 'Delhi South', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-01T08:00:00', rentalAmount: 50000, depositAmount: 15000, status: RentalStatus.ONGOING },
  { _id: '4', driverId: { name: 'Vikash Sharma', phone: '+91 98765 43214' }, assetId: { registrationNumber: 'DL-09-QR-4567', model: 'Tata Nexon' }, hubId: 'Gurgaon Sector 29', rentalType: RentalType.DAILY, startDateTime: '2025-01-12T11:00:00', rentalAmount: 2800, depositAmount: 5000, status: RentalStatus.ONGOING },
  { _id: '5', driverId: { name: 'Ramesh Patel', phone: '+91 98765 43215' }, assetId: { registrationNumber: 'HR-26-KL-6789', model: 'Tata Nexon' }, hubId: 'Gurgaon Cyber City', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-08T09:30:00', endDateTime: '2025-01-15T19:00:00', rentalAmount: 16000, depositAmount: 10000, status: RentalStatus.COMPLETED },
  { _id: '6', driverId: { name: 'Anil Kumar', phone: '+91 98765 43216' }, assetId: { registrationNumber: 'HR-26-OP-2345', model: 'Tata Nexon' }, hubId: 'Delhi East', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-05T08:00:00', rentalAmount: 48000, depositAmount: 15000, status: RentalStatus.ONGOING },
  { _id: '7', driverId: { name: 'Sunil Verma', phone: '+91 98765 43217' }, assetId: { registrationNumber: 'DL-19-FF-4567', model: 'Tata Nexon' }, hubId: 'Delhi Central', rentalType: RentalType.DAILY, startDateTime: '2025-01-14T10:00:00', rentalAmount: 2600, depositAmount: 5000, status: RentalStatus.ONGOING },
  { _id: '8', driverId: { name: 'Pradeep Roy', phone: '+91 98765 43218' }, assetId: { registrationNumber: 'DL-22-II-6789', model: 'Tata Nexon' }, hubId: 'Delhi North', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-05T09:00:00', endDateTime: '2025-01-12T18:00:00', rentalAmount: 15500, depositAmount: 10000, status: RentalStatus.COMPLETED },
  { _id: '9', driverId: { name: 'Mahesh Banerjee', phone: '+91 98765 43220' }, assetId: { registrationNumber: 'DL-25-LL-7890', model: 'Tata Safari' }, hubId: 'Delhi South', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-02T08:00:00', rentalAmount: 60000, depositAmount: 20000, status: RentalStatus.ONGOING },
  { _id: '10', driverId: { name: 'Dinesh Chatterjee', phone: '+91 98765 43221' }, assetId: { registrationNumber: 'HR-26-YZ-1234', model: 'Mahindra XUV700' }, hubId: 'Gurgaon Sector 29', rentalType: RentalType.DAILY, startDateTime: '2025-01-13T11:00:00', rentalAmount: 3500, depositAmount: 7000, status: RentalStatus.ONGOING },
  { _id: '11', driverId: { name: 'Kiran Sen', phone: '+91 98765 43222' }, assetId: { registrationNumber: 'DL-27-NN-5678', model: 'Tata Safari' }, hubId: 'Gurgaon Cyber City', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-03T09:00:00', endDateTime: '2025-01-10T18:00:00', rentalAmount: 20000, depositAmount: 12000, status: RentalStatus.COMPLETED },
  { _id: '12', driverId: { name: 'Ravi Mondal', phone: '+91 98765 43223' }, assetId: { registrationNumber: 'HR-26-AA-9012', model: 'Mahindra XUV700' }, hubId: 'Delhi East', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-04T08:00:00', rentalAmount: 65000, depositAmount: 20000, status: RentalStatus.ONGOING },
  { _id: '13', driverId: { name: 'Sandeep Dutta', phone: '+91 98765 43224' }, assetId: { registrationNumber: 'DL-30-QQ-7890', model: 'Mahindra XUV700' }, hubId: 'Delhi Central', rentalType: RentalType.DAILY, startDateTime: '2025-01-11T10:30:00', rentalAmount: 3200, depositAmount: 7000, status: RentalStatus.ONGOING },
  { _id: '14', driverId: { name: 'Arjun Basu', phone: '+91 98765 43225' }, assetId: { registrationNumber: 'HR-26-CC-6789', model: 'Mahindra XUV700' }, hubId: 'Delhi North', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-01T09:00:00', endDateTime: '2025-01-08T18:00:00', rentalAmount: 19500, depositAmount: 12000, status: RentalStatus.COMPLETED },
  { _id: '15', driverId: { name: 'Hari Bose', phone: '+91 98765 43228' }, assetId: { registrationNumber: 'DL-33-TT-0123', model: 'Tata Safari' }, hubId: 'Delhi South', rentalType: RentalType.MONTHLY, startDateTime: '2025-01-06T08:00:00', rentalAmount: 58000, depositAmount: 20000, status: RentalStatus.ONGOING },
  { _id: '16', driverId: { name: 'Ishwar Naskar', phone: '+91 98765 43229' }, assetId: { registrationNumber: 'DL-35-VV-8901', model: 'Tata Safari' }, hubId: 'Gurgaon Sector 29', rentalType: RentalType.DAILY, startDateTime: '2025-01-10T12:00:00', rentalAmount: 3000, depositAmount: 7000, status: RentalStatus.ONGOING },
  { _id: '17', driverId: { name: 'Jagdish Halder', phone: '+91 98765 43230' }, assetId: { registrationNumber: 'HR-26-WX-4567', model: 'Tata Tigor' }, hubId: 'Gurgaon Cyber City', rentalType: RentalType.WEEKLY, startDateTime: '2025-01-07T09:00:00', endDateTime: '2025-01-14T18:00:00', rentalAmount: 14500, depositAmount: 10000, status: RentalStatus.COMPLETED },
  { _id: '18', driverId: { name: 'Kailash Saha', phone: '+91 98765 43231' }, assetId: { registrationNumber: 'DL-01-AB-1234', model: 'Tata Nexon' }, hubId: 'Delhi East', rentalType: RentalType.DAILY, startDateTime: '2025-01-09T10:00:00', rentalAmount: 2400, depositAmount: 5000, status: RentalStatus.ONGOING },
];

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchRentals();
  }, [statusFilter]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/api/rentals?status=${statusFilter}` : '/api/rentals';
      const response = await fetch(url);
      const result = await response.json();
      
      // Always use dummy data for demo purposes
      // If you want to use real API data when available, uncomment the condition below
      // if (result.success && result.data && result.data.length >= 15) {
      //   setRentals(result.data);
      //   return;
      // }
      
      // Use dummy data
      let filteredDummy = dummyRentals;
      if (statusFilter) {
        filteredDummy = dummyRentals.filter(rental => rental.status === statusFilter);
      }
      setRentals(filteredDummy);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      // Use dummy data on error
      let filteredDummy = dummyRentals;
      if (statusFilter) {
        filteredDummy = dummyRentals.filter(rental => rental.status === statusFilter);
      }
      setRentals(filteredDummy);
    } finally {
      setLoading(false);
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

  const columns = [
    {
      header: 'S.No.',
      accessor: (row: Rental, index?: number) => (
        <span className="text-gray-600 font-medium">{index !== undefined ? index + 1 : ''}</span>
      ),
    },
    {
      header: 'Driver',
      accessor: (row: Rental) => row.driverId?.name || 'N/A',
    },
    {
      header: 'Vehicle',
      accessor: (row: Rental) => row.assetId?.registrationNumber || 'N/A',
    },
    { header: 'Hub', accessor: 'hubId' as const },
    { header: 'Type', accessor: 'rentalType' as const },
    {
      header: 'Start Date',
      accessor: (row: Rental) => new Date(row.startDateTime).toLocaleDateString(),
    },
    {
      header: 'Amount',
      accessor: (row: Rental) => `₹${row.rentalAmount.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (row: Rental) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessor: (row: Rental) => (
        <Link href={`/rentals/${row._id}`}>
          <Button size="sm" variant="secondary">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Hub Operations</h1>
          <p className="mt-2 text-base text-gray-600">Manage vehicle rentals</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/rentals/new">
            <Button>Start New Rental</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {Object.values(RentalStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No rentals found</p>
          </div>
        ) : (
          <Table data={rentals} columns={columns} />
        )}
      </div>
    </div>
  );
}

