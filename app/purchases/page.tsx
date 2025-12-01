'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { PurchaseRequestStatus, ItemCategory } from '@/types';

interface PurchaseRequest {
  _id: string;
  requestedByHubManagerId: { name: string; hubLocation: string };
  hubId: string;
  items: Array<{ itemName: string; category: string; quantity: number; estimatedUnitPrice: number }>;
  status: PurchaseRequestStatus;
  createdAt: string;
}

// Dummy data fallback
const dummyPurchaseRequests: PurchaseRequest[] = [
  {
    _id: '1',
    requestedByHubManagerId: { name: 'Priya Sharma', hubLocation: 'Delhi Central' },
    hubId: 'Delhi Central',
    items: [
      { itemName: 'Tyre - MRF 175/65 R14', category: ItemCategory.TYRE, quantity: 4, estimatedUnitPrice: 4500 },
      { itemName: 'Battery - Exide 12V 60Ah', category: ItemCategory.BATTERY, quantity: 2, estimatedUnitPrice: 8500 },
    ],
    status: PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL,
    createdAt: '2024-01-15T10:00:00',
  },
  {
    _id: '2',
    requestedByHubManagerId: { name: 'Rahul Verma', hubLocation: 'Delhi North' },
    hubId: 'Delhi North',
    items: [
      { itemName: 'Engine Oil - Castrol 5W-30', category: ItemCategory.OIL, quantity: 10, estimatedUnitPrice: 500 },
      { itemName: 'Oil Filter', category: ItemCategory.FILTER, quantity: 10, estimatedUnitPrice: 700 },
      { itemName: 'Air Filter', category: ItemCategory.FILTER, quantity: 8, estimatedUnitPrice: 800 },
    ],
    status: PurchaseRequestStatus.APPROVED,
    createdAt: '2024-01-12T09:30:00',
  },
  {
    _id: '3',
    requestedByHubManagerId: { name: 'Anjali Patel', hubLocation: 'Delhi South' },
    hubId: 'Delhi South',
    items: [
      { itemName: 'Brake Pads - Front', category: ItemCategory.BRAKE_PAD, quantity: 6, estimatedUnitPrice: 3500 },
      { itemName: 'Brake Pads - Rear', category: ItemCategory.BRAKE_PAD, quantity: 6, estimatedUnitPrice: 2500 },
    ],
    status: PurchaseRequestStatus.SENT_TO_FINANCE,
    createdAt: '2024-01-10T11:00:00',
  },
  {
    _id: '4',
    requestedByHubManagerId: { name: 'Vikram Singh', hubLocation: 'Gurgaon Sector 29' },
    hubId: 'Gurgaon Sector 29',
    items: [
      { itemName: 'Headlight - LED', category: ItemCategory.LIGHT, quantity: 4, estimatedUnitPrice: 2500 },
      { itemName: 'Taillight Assembly', category: ItemCategory.LIGHT, quantity: 4, estimatedUnitPrice: 1500 },
    ],
    status: PurchaseRequestStatus.COMPLETED,
    createdAt: '2024-01-08T14:00:00',
  },
  {
    _id: '5',
    requestedByHubManagerId: { name: 'Sneha Das', hubLocation: 'Gurgaon Cyber City' },
    hubId: 'Gurgaon Cyber City',
    items: [
      { itemName: 'Wiper Blades - Bosch', category: ItemCategory.WIPER, quantity: 12, estimatedUnitPrice: 800 },
      { itemName: 'Wiper Fluid', category: ItemCategory.OTHER, quantity: 20, estimatedUnitPrice: 200 },
    ],
    status: PurchaseRequestStatus.DRAFT,
    createdAt: '2024-01-14T16:00:00',
  },
  {
    _id: '6',
    requestedByHubManagerId: { name: 'Arjun Banerjee', hubLocation: 'Delhi East' },
    hubId: 'Delhi East',
    items: [
      { itemName: 'Seat Covers - Premium', category: ItemCategory.SEAT_COVER, quantity: 8, estimatedUnitPrice: 3000 },
      { itemName: 'Floor Mats - Rubber', category: ItemCategory.FLOOR_MAT, quantity: 8, estimatedUnitPrice: 1500 },
    ],
    status: PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL,
    createdAt: '2024-01-13T10:30:00',
  },
  {
    _id: '7',
    requestedByHubManagerId: { name: 'Priya Sharma', hubLocation: 'Delhi Central' },
    hubId: 'Delhi Central',
    items: [
      { itemName: 'Battery - Amaron 12V 70Ah', category: ItemCategory.BATTERY, quantity: 3, estimatedUnitPrice: 9500 },
    ],
    status: PurchaseRequestStatus.APPROVED,
    createdAt: '2024-01-11T09:00:00',
  },
  {
    _id: '8',
    requestedByHubManagerId: { name: 'Rahul Verma', hubLocation: 'Delhi North' },
    hubId: 'Delhi North',
    items: [
      { itemName: 'Tyre - Apollo 185/70 R14', category: ItemCategory.TYRE, quantity: 8, estimatedUnitPrice: 4800 },
      { itemName: 'Tyre Tube', category: ItemCategory.TUBE, quantity: 8, estimatedUnitPrice: 600 },
    ],
    status: PurchaseRequestStatus.REJECTED,
    createdAt: '2024-01-09T11:30:00',
  },
  {
    _id: '9',
    requestedByHubManagerId: { name: 'Anjali Patel', hubLocation: 'Delhi South' },
    hubId: 'Delhi South',
    items: [
      { itemName: 'Side Mirror - Electric', category: ItemCategory.MIRROR, quantity: 6, estimatedUnitPrice: 1200 },
    ],
    status: PurchaseRequestStatus.SENT_TO_FINANCE,
    createdAt: '2024-01-07T13:00:00',
  },
  {
    _id: '10',
    requestedByHubManagerId: { name: 'Vikram Singh', hubLocation: 'Gurgaon Sector 29' },
    hubId: 'Gurgaon Sector 29',
    items: [
      { itemName: 'Engine Oil - Mobil 1', category: ItemCategory.OIL, quantity: 15, estimatedUnitPrice: 600 },
      { itemName: 'Gear Oil', category: ItemCategory.LUBRICANT, quantity: 10, estimatedUnitPrice: 800 },
    ],
    status: PurchaseRequestStatus.COMPLETED,
    createdAt: '2024-01-05T15:00:00',
  },
  {
    _id: '11',
    requestedByHubManagerId: { name: 'Sneha Das', hubLocation: 'Gurgaon Cyber City' },
    hubId: 'Gurgaon Cyber City',
    items: [
      { itemName: 'Alloy Wheel - 15 inch', category: ItemCategory.ALLOY_WHEEL, quantity: 4, estimatedUnitPrice: 12000 },
    ],
    status: PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL,
    createdAt: '2024-01-16T10:00:00',
  },
  {
    _id: '12',
    requestedByHubManagerId: { name: 'Arjun Banerjee', hubLocation: 'Delhi East' },
    hubId: 'Delhi East',
    items: [
      { itemName: 'Brake Fluid', category: ItemCategory.OTHER, quantity: 12, estimatedUnitPrice: 1000 },
      { itemName: 'Coolant - Prestone', category: ItemCategory.OTHER, quantity: 15, estimatedUnitPrice: 1500 },
    ],
    status: PurchaseRequestStatus.APPROVED,
    createdAt: '2024-01-14T09:00:00',
  },
];

export default function PurchasesPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/api/purchases?status=${statusFilter}` : '/api/purchases';
      const response = await fetch(url);
      const result = await response.json();
      
      // Always use dummy data for demo purposes
      let filteredData = dummyPurchaseRequests;
      if (statusFilter) {
        filteredData = dummyPurchaseRequests.filter(req => req.status === statusFilter);
      }
      setRequests(filteredData);
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
      // Use dummy data on error
      let filteredData = dummyPurchaseRequests;
      if (statusFilter) {
        filteredData = dummyPurchaseRequests.filter(req => req.status === statusFilter);
      }
      setRequests(filteredData);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this purchase request? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/purchases/${id}`, {
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
      console.error('Error deleting purchase request:', error);
      // For dummy data, just remove from local state
      setRequests(requests.filter(req => req._id !== id));
    }
  };

  const getStatusBadge = (status: PurchaseRequestStatus) => {
    const colors = {
      [PurchaseRequestStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL]: 'bg-yellow-100 text-yellow-800',
      [PurchaseRequestStatus.APPROVED]: 'bg-snap-teal-100 text-snap-teal-800',
      [PurchaseRequestStatus.REJECTED]: 'bg-snap-coral-100 text-snap-coral-800',
      [PurchaseRequestStatus.SENT_TO_FINANCE]: 'bg-purple-100 text-purple-800',
      [PurchaseRequestStatus.COMPLETED]: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const calculateTotal = (items: PurchaseRequest['items']) => {
    return items.reduce((sum, item) => sum + item.quantity * item.estimatedUnitPrice, 0);
  };

  const columns = [
    {
      header: 'S.No.',
      accessor: (row: PurchaseRequest, index?: number) => (
        <span className="text-gray-600 font-medium">{index !== undefined ? index + 1 : ''}</span>
      ),
    },
    {
      header: 'Requested By',
      accessor: (row: PurchaseRequest) => row.requestedByHubManagerId?.name || 'N/A',
    },
    { header: 'Hub', accessor: 'hubId' as const },
    {
      header: 'Items Count',
      accessor: (row: PurchaseRequest) => row.items.length,
    },
    {
      header: 'Total Amount',
      accessor: (row: PurchaseRequest) => `₹${calculateTotal(row.items).toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (row: PurchaseRequest) => getStatusBadge(row.status),
    },
    {
      header: 'Created',
      accessor: (row: PurchaseRequest) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (row: PurchaseRequest) => (
        <div className="flex gap-2">
          <Link href={`/purchases/${row._id}`}>
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
          <h1 className="text-3xl font-semibold text-gray-900">Purchase Requests</h1>
          <p className="mt-2 text-sm text-gray-700">Manage car upkeep purchase requests and approvals</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/purchases/new">
            <Button>Create Purchase Request</Button>
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
            {Object.values(PurchaseRequestStatus).map((status) => (
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

