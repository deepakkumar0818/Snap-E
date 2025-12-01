'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { MaintenanceStatus } from '@/types';

interface MaintenanceRequest {
  _id: string;
  assetId: { registrationNumber: string; model: string };
  raisedByHubManagerId: { name: string; hubLocation: string };
  serviceCenterName: string;
  issueDescription: string;
  estimatedCost: number;
  status: MaintenanceStatus;
}

// Dummy data fallback
const dummyMaintenanceRequests: MaintenanceRequest[] = [
  { _id: '1', assetId: { registrationNumber: 'DL-01-AB-1234', model: 'Tata Nexon' }, raisedByHubManagerId: { name: 'Priya Sharma', hubLocation: 'Delhi Central' }, serviceCenterName: 'Tata Service Center - Connaught Place', issueDescription: 'Regular servicing and brake pad replacement', estimatedCost: 8500, status: MaintenanceStatus.PENDING_APPROVAL },
  { _id: '2', assetId: { registrationNumber: 'HR-26-AB-5678', model: 'Mahindra eVerito' }, raisedByHubManagerId: { name: 'Rahul Verma', hubLocation: 'Delhi North' }, serviceCenterName: 'Mahindra Service Center - Gurgaon', issueDescription: 'Battery replacement and electrical system check', estimatedCost: 12000, status: MaintenanceStatus.APPROVED },
  { _id: '3', assetId: { registrationNumber: 'HR-26-CD-3456', model: 'Mahindra e2o' }, raisedByHubManagerId: { name: 'Anjali Patel', hubLocation: 'Delhi South' }, serviceCenterName: 'Mahindra Service Center - Delhi', issueDescription: 'Tyre replacement (all 4 tyres)', estimatedCost: 18000, status: MaintenanceStatus.IN_PROGRESS },
  { _id: '4', assetId: { registrationNumber: 'HR-26-EF-2345', model: 'Mahindra eVerito' }, raisedByHubManagerId: { name: 'Vikram Singh', hubLocation: 'Gurgaon Sector 29' }, serviceCenterName: 'Mahindra Service Center - Gurgaon', issueDescription: 'AC compressor repair and gas refill', estimatedCost: 15000, status: MaintenanceStatus.COMPLETED },
  { _id: '5', assetId: { registrationNumber: 'DL-08-OP-0123', model: 'Mahindra e2o' }, raisedByHubManagerId: { name: 'Sneha Das', hubLocation: 'Gurgaon Cyber City' }, serviceCenterName: 'Mahindra Service Center - Connaught Place', issueDescription: 'Engine oil change and filter replacement', estimatedCost: 3200, status: MaintenanceStatus.PENDING_APPROVAL },
  { _id: '6', assetId: { registrationNumber: 'HR-26-IJ-4567', model: 'Tata Tigor' }, raisedByHubManagerId: { name: 'Arjun Banerjee', hubLocation: 'Delhi East' }, serviceCenterName: 'Tata Service Center - Gurgaon', issueDescription: 'Windshield replacement due to crack', estimatedCost: 9500, status: MaintenanceStatus.APPROVED },
  { _id: '7', assetId: { registrationNumber: 'HR-26-KL-6789', model: 'Tata Nexon' }, raisedByHubManagerId: { name: 'Priya Sharma', hubLocation: 'Delhi Central' }, serviceCenterName: 'Tata Service Center - Connaught Place', issueDescription: 'Suspension repair and alignment', estimatedCost: 11000, status: MaintenanceStatus.IN_PROGRESS },
  { _id: '8', assetId: { registrationNumber: 'HR-26-MN-8901', model: 'Tata Tigor' }, raisedByHubManagerId: { name: 'Rahul Verma', hubLocation: 'Delhi North' }, serviceCenterName: 'Tata Service Center - Gurgaon', issueDescription: 'Headlight and taillight replacement', estimatedCost: 4500, status: MaintenanceStatus.COMPLETED },
  { _id: '9', assetId: { registrationNumber: 'HR-26-OP-2345', model: 'Tata Nexon' }, raisedByHubManagerId: { name: 'Anjali Patel', hubLocation: 'Delhi South' }, serviceCenterName: 'Tata Service Center - Delhi', issueDescription: 'Wiper blade replacement and fluid top-up', estimatedCost: 1800, status: MaintenanceStatus.REJECTED },
  { _id: '10', assetId: { registrationNumber: 'HR-26-QR-5678', model: 'Mahindra eVerito' }, raisedByHubManagerId: { name: 'Vikram Singh', hubLocation: 'Gurgaon Sector 29' }, serviceCenterName: 'Mahindra Service Center - Gurgaon', issueDescription: 'Seat cover replacement and interior cleaning', estimatedCost: 5500, status: MaintenanceStatus.PENDING_APPROVAL },
  { _id: '11', assetId: { registrationNumber: 'HR-26-ST-9012', model: 'Tata Tigor' }, raisedByHubManagerId: { name: 'Sneha Das', hubLocation: 'Gurgaon Cyber City' }, serviceCenterName: 'Tata Service Center - Connaught Place', issueDescription: 'Power steering pump replacement', estimatedCost: 13500, status: MaintenanceStatus.APPROVED },
  { _id: '12', assetId: { registrationNumber: 'HR-26-UV-6789', model: 'Tata Nexon' }, raisedByHubManagerId: { name: 'Arjun Banerjee', hubLocation: 'Delhi East' }, serviceCenterName: 'Tata Service Center - Gurgaon', issueDescription: 'Regular servicing and wheel alignment', estimatedCost: 7200, status: MaintenanceStatus.IN_PROGRESS },
  { _id: '13', assetId: { registrationNumber: 'HR-26-WX-4567', model: 'Tata Tigor' }, raisedByHubManagerId: { name: 'Priya Sharma', hubLocation: 'Delhi Central' }, serviceCenterName: 'Tata Service Center - Connaught Place', issueDescription: 'Mirror replacement (side mirrors)', estimatedCost: 2800, status: MaintenanceStatus.COMPLETED },
  { _id: '14', assetId: { registrationNumber: 'HR-26-YZ-1234', model: 'Mahindra XUV700' }, raisedByHubManagerId: { name: 'Rahul Verma', hubLocation: 'Delhi North' }, serviceCenterName: 'Mahindra Service Center - Gurgaon', issueDescription: 'Transmission fluid change and service', estimatedCost: 16500, status: MaintenanceStatus.PENDING_APPROVAL },
  { _id: '15', assetId: { registrationNumber: 'HR-26-AA-9012', model: 'Mahindra XUV700' }, raisedByHubManagerId: { name: 'Anjali Patel', hubLocation: 'Delhi South' }, serviceCenterName: 'Mahindra Service Center - Delhi', issueDescription: 'Radiator cleaning and coolant replacement', estimatedCost: 4200, status: MaintenanceStatus.APPROVED },
];

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    // Use dummy data immediately for fast loading
    setLoading(true);
    
    // Filter dummy data based on status filter
    let filteredData = dummyMaintenanceRequests;
    if (statusFilter) {
      filteredData = dummyMaintenanceRequests.filter(req => req.status === statusFilter);
    }
    setRequests(filteredData);
    setLoading(false);
    
    // Optional: Fetch real data in the background (commented out for performance)
    // try {
    //   const url = statusFilter ? `/api/maintenance?status=${statusFilter}` : '/api/maintenance';
    //   const response = await fetch(url);
    //   const result = await response.json();
    //   if (result.success && result.data) {
    //     setRequests(result.data);
    //   }
    // } catch (error) {
    //   console.error('Error fetching maintenance requests:', error);
    // }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance request? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setRequests(requests.filter(req => req._id !== id));
      } else {
        // For dummy data, just remove from local state
        setRequests(requests.filter(req => req._id !== id));
      }
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      // For dummy data, just remove from local state
      setRequests(requests.filter(req => req._id !== id));
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

  const columns = [
    {
      header: 'S.No.',
      accessor: (row: MaintenanceRequest, index?: number) => (
        <span className="text-gray-600 font-medium">{index !== undefined ? index + 1 : ''}</span>
      ),
    },
    {
      header: 'Vehicle',
      accessor: (row: MaintenanceRequest) => row.assetId?.registrationNumber || 'N/A',
    },
    {
      header: 'Raised By',
      accessor: (row: MaintenanceRequest) => row.raisedByHubManagerId?.name || 'N/A',
    },
    { header: 'Service Center', accessor: 'serviceCenterName' as const },
    {
      header: 'Estimated Cost',
      accessor: (row: MaintenanceRequest) => `₹${row.estimatedCost.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (row: MaintenanceRequest) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessor: (row: MaintenanceRequest) => (
        <div className="flex gap-2">
          <Link href={`/maintenance/${row._id}`}>
            <Button size="sm" variant="secondary">View</Button>
          </Link>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Maintenance Requests</h1>
          <p className="mt-2 text-sm text-gray-700">Manage vehicle maintenance and service requests</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/maintenance/new">
            <Button>Raise Maintenance Request</Button>
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
            {Object.values(MaintenanceStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <Table data={requests} columns={columns} />
        )}
      </div>
    </div>
  );
}

