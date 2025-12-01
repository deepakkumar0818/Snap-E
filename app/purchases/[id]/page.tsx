'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import { PurchaseRequestStatus, ItemCategory } from '@/types';

interface PurchaseRequest {
  _id: string;
  requestedByHubManagerId: { name: string; hubLocation: string };
  supervisorId?: { name: string; email: string };
  hubId: string;
  items: Array<{
    itemName: string;
    category: string;
    quantity: number;
    estimatedUnitPrice: number;
    justification: string;
  }>;
  status: PurchaseRequestStatus;
  approvalComments?: string;
  financeNotified: boolean;
  createdAt: string;
  supervisorApprovedAt?: string;
}

// Dummy data mapping
const getDummyPurchaseRequest = (id: string): PurchaseRequest | null => {
  const requestMap: Record<string, PurchaseRequest> = {
    '1': {
      _id: '1',
      requestedByHubManagerId: { name: 'Priya Sharma', hubLocation: 'Delhi Central' },
      hubId: 'Delhi Central',
      items: [
        { itemName: 'Tyre - MRF 175/65 R14', category: ItemCategory.TYRE, quantity: 4, estimatedUnitPrice: 4500, justification: 'Replacement needed for 4 vehicles with worn-out tyres' },
        { itemName: 'Battery - Exide 12V 60Ah', category: ItemCategory.BATTERY, quantity: 2, estimatedUnitPrice: 8500, justification: 'Battery replacement for vehicles with weak batteries' },
      ],
      status: PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL,
      financeNotified: false,
      createdAt: '2024-01-15T10:00:00',
    },
    '2': {
      _id: '2',
      requestedByHubManagerId: { name: 'Rahul Verma', hubLocation: 'Delhi North' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Delhi North',
      items: [
        { itemName: 'Engine Oil - Castrol 5W-30', category: ItemCategory.OIL, quantity: 10, estimatedUnitPrice: 500, justification: 'Regular maintenance oil change for fleet vehicles' },
        { itemName: 'Oil Filter', category: ItemCategory.FILTER, quantity: 10, estimatedUnitPrice: 700, justification: 'Oil filter replacement during service' },
        { itemName: 'Air Filter', category: ItemCategory.FILTER, quantity: 8, estimatedUnitPrice: 800, justification: 'Air filter replacement for better engine performance' },
      ],
      status: PurchaseRequestStatus.APPROVED,
      approvalComments: 'Approved for regular maintenance supplies',
      financeNotified: true,
      createdAt: '2024-01-12T09:30:00',
      supervisorApprovedAt: '2024-01-12T14:30:00',
    },
    '3': {
      _id: '3',
      requestedByHubManagerId: { name: 'Anjali Patel', hubLocation: 'Delhi South' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Delhi South',
      items: [
        { itemName: 'Brake Pads - Front', category: ItemCategory.BRAKE_PAD, quantity: 6, estimatedUnitPrice: 3500, justification: 'Front brake pad replacement for safety' },
        { itemName: 'Brake Pads - Rear', category: ItemCategory.BRAKE_PAD, quantity: 6, estimatedUnitPrice: 2500, justification: 'Rear brake pad replacement for safety' },
      ],
      status: PurchaseRequestStatus.SENT_TO_FINANCE,
      approvalComments: 'Approved - Critical safety items',
      financeNotified: true,
      createdAt: '2024-01-10T11:00:00',
      supervisorApprovedAt: '2024-01-10T16:00:00',
    },
    '4': {
      _id: '4',
      requestedByHubManagerId: { name: 'Vikram Singh', hubLocation: 'Gurgaon Sector 29' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Gurgaon Sector 29',
      items: [
        { itemName: 'Headlight - LED', category: ItemCategory.LIGHT, quantity: 4, estimatedUnitPrice: 2500, justification: 'Headlight replacement for damaged units' },
        { itemName: 'Taillight Assembly', category: ItemCategory.LIGHT, quantity: 4, estimatedUnitPrice: 1500, justification: 'Taillight replacement for damaged units' },
      ],
      status: PurchaseRequestStatus.COMPLETED,
      approvalComments: 'Approved and completed',
      financeNotified: true,
      createdAt: '2024-01-08T14:00:00',
      supervisorApprovedAt: '2024-01-08T17:00:00',
    },
    '5': {
      _id: '5',
      requestedByHubManagerId: { name: 'Sneha Das', hubLocation: 'Gurgaon Cyber City' },
      hubId: 'Gurgaon Cyber City',
      items: [
        { itemName: 'Wiper Blades - Bosch', category: ItemCategory.WIPER, quantity: 12, estimatedUnitPrice: 800, justification: 'Wiper blade replacement for better visibility' },
        { itemName: 'Wiper Fluid', category: ItemCategory.OTHER, quantity: 20, estimatedUnitPrice: 200, justification: 'Wiper fluid for regular maintenance' },
      ],
      status: PurchaseRequestStatus.DRAFT,
      financeNotified: false,
      createdAt: '2024-01-14T16:00:00',
    },
    '6': {
      _id: '6',
      requestedByHubManagerId: { name: 'Arjun Banerjee', hubLocation: 'Delhi East' },
      hubId: 'Delhi East',
      items: [
        { itemName: 'Seat Covers - Premium', category: ItemCategory.SEAT_COVER, quantity: 8, estimatedUnitPrice: 3000, justification: 'Seat cover replacement for worn-out covers' },
        { itemName: 'Floor Mats - Rubber', category: ItemCategory.FLOOR_MAT, quantity: 8, estimatedUnitPrice: 1500, justification: 'Floor mat replacement for better interior' },
      ],
      status: PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL,
      financeNotified: false,
      createdAt: '2024-01-13T10:30:00',
    },
    '7': {
      _id: '7',
      requestedByHubManagerId: { name: 'Priya Sharma', hubLocation: 'Delhi Central' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Delhi Central',
      items: [
        { itemName: 'Battery - Amaron 12V 70Ah', category: ItemCategory.BATTERY, quantity: 3, estimatedUnitPrice: 9500, justification: 'Battery replacement for vehicles with weak batteries' },
      ],
      status: PurchaseRequestStatus.APPROVED,
      approvalComments: 'Approved for battery replacement',
      financeNotified: true,
      createdAt: '2024-01-11T09:00:00',
      supervisorApprovedAt: '2024-01-11T13:00:00',
    },
    '8': {
      _id: '8',
      requestedByHubManagerId: { name: 'Rahul Verma', hubLocation: 'Delhi North' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Delhi North',
      items: [
        { itemName: 'Tyre - Apollo 185/70 R14', category: ItemCategory.TYRE, quantity: 8, estimatedUnitPrice: 4800, justification: 'Tyre replacement for fleet vehicles' },
        { itemName: 'Tyre Tube', category: ItemCategory.TUBE, quantity: 8, estimatedUnitPrice: 600, justification: 'Tyre tube replacement' },
      ],
      status: PurchaseRequestStatus.REJECTED,
      approvalComments: 'Rejected - Budget constraints. Please prioritize critical items only.',
      financeNotified: false,
      createdAt: '2024-01-09T11:30:00',
    },
    '9': {
      _id: '9',
      requestedByHubManagerId: { name: 'Anjali Patel', hubLocation: 'Delhi South' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Delhi South',
      items: [
        { itemName: 'Side Mirror - Electric', category: ItemCategory.MIRROR, quantity: 6, estimatedUnitPrice: 1200, justification: 'Side mirror replacement for damaged mirrors' },
      ],
      status: PurchaseRequestStatus.SENT_TO_FINANCE,
      approvalComments: 'Approved - Safety item',
      financeNotified: true,
      createdAt: '2024-01-07T13:00:00',
      supervisorApprovedAt: '2024-01-07T18:00:00',
    },
    '10': {
      _id: '10',
      requestedByHubManagerId: { name: 'Vikram Singh', hubLocation: 'Gurgaon Sector 29' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Gurgaon Sector 29',
      items: [
        { itemName: 'Engine Oil - Mobil 1', category: ItemCategory.OIL, quantity: 15, estimatedUnitPrice: 600, justification: 'Premium engine oil for better performance' },
        { itemName: 'Gear Oil', category: ItemCategory.LUBRICANT, quantity: 10, estimatedUnitPrice: 800, justification: 'Gear oil for transmission maintenance' },
      ],
      status: PurchaseRequestStatus.COMPLETED,
      approvalComments: 'Approved and completed',
      financeNotified: true,
      createdAt: '2024-01-05T15:00:00',
      supervisorApprovedAt: '2024-01-05T19:00:00',
    },
    '11': {
      _id: '11',
      requestedByHubManagerId: { name: 'Sneha Das', hubLocation: 'Gurgaon Cyber City' },
      hubId: 'Gurgaon Cyber City',
      items: [
        { itemName: 'Alloy Wheel - 15 inch', category: ItemCategory.ALLOY_WHEEL, quantity: 4, estimatedUnitPrice: 12000, justification: 'Alloy wheel replacement for damaged wheels' },
      ],
      status: PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL,
      financeNotified: false,
      createdAt: '2024-01-16T10:00:00',
    },
    '12': {
      _id: '12',
      requestedByHubManagerId: { name: 'Arjun Banerjee', hubLocation: 'Delhi East' },
      supervisorId: { name: 'Supervisor Name', email: 'supervisor@snap-e.com' },
      hubId: 'Delhi East',
      items: [
        { itemName: 'Brake Fluid', category: ItemCategory.OTHER, quantity: 12, estimatedUnitPrice: 1000, justification: 'Brake fluid replacement for safety' },
        { itemName: 'Coolant - Prestone', category: ItemCategory.OTHER, quantity: 15, estimatedUnitPrice: 1500, justification: 'Coolant replacement for engine cooling' },
      ],
      status: PurchaseRequestStatus.APPROVED,
      approvalComments: 'Approved for maintenance supplies',
      financeNotified: true,
      createdAt: '2024-01-14T09:00:00',
      supervisorApprovedAt: '2024-01-14T14:00:00',
    },
  };

  return requestMap[id] || null;
};

export default function PurchaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchRequest();
    }
  }, [params.id]);

  const fetchRequest = async () => {
    try {
      const response = await fetch(`/api/purchases/${params.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        setRequest(result.data);
      } else {
        // Use dummy data if API doesn't return data
        const dummyRequest = getDummyPurchaseRequest(params.id as string);
        if (dummyRequest) {
          setRequest(dummyRequest);
        }
      }
    } catch (error) {
      console.error('Error fetching purchase request:', error);
      // Use dummy data on error
      const dummyRequest = getDummyPurchaseRequest(params.id as string);
      if (dummyRequest) {
        setRequest(dummyRequest);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (actionType: 'approve' | 'reject') => {
    if (actionType === 'reject' && !comments.trim()) {
      alert('Please provide comments for rejection');
      return;
    }

    // Check if this is a dummy data ID (numeric string)
    const isDummyData = /^\d+$/.test(params.id as string);
    
    if (isDummyData) {
      // For dummy data, just show success and redirect (no API call)
      alert(`Purchase request ${actionType === 'approve' ? 'approved' : 'rejected'}! (Note: This is dummy data - changes are not persisted)`);
      router.push('/purchases');
      return;
    }

    setApproving(true);
    try {
      const response = await fetch(`/api/purchases/${params.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          comments: comments,
          supervisorId: 'supervisor-id-placeholder', // In real app, get from auth context
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/purchases');
      } else {
        alert(result.error || 'Failed to process approval');
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Failed to process approval');
    } finally {
      setApproving(false);
      setAction(null);
      setComments('');
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

  const calculateTotal = () => {
    if (!request) return 0;
    return request.items.reduce(
      (sum, item) => sum + item.quantity * item.estimatedUnitPrice,
      0
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!request) {
    return <div className="text-center py-12">Purchase request not found</div>;
  }

  const canApprove = request.status === PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/purchases">
          <Button variant="secondary" size="sm">← Back to Purchase Requests</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Purchase Request</h1>
            {getStatusBadge(request.status)}
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Requested By</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.requestedByHubManagerId?.name} ({request.requestedByHubManagerId?.hubLocation})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Hub ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.hubId}</dd>
            </div>
            {request.supervisorId && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Supervisor</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.supervisorId.name}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(request.createdAt).toLocaleString()}
              </dd>
            </div>
            {request.supervisorApprovedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Approved At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(request.supervisorApprovedAt).toLocaleString()}
                </dd>
              </div>
            )}
            {request.financeNotified && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Finance Notified</dt>
                <dd className="mt-1 text-sm text-gray-900">Yes</dd>
              </div>
            )}
          </dl>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Justification</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {request.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.category.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{item.estimatedUnitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ₹{(item.quantity * item.estimatedUnitPrice).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.justification}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{calculateTotal().toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {request.approvalComments && (
            <div className="mt-6">
              <dt className="text-sm font-medium text-gray-500">Approval Comments</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.approvalComments}</dd>
            </div>
          )}

          {canApprove && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Supervisor Approval</h3>
              {action ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {action === 'approve' ? 'Approval' : 'Rejection'} Comments
                    </label>
                    <textarea
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
                      placeholder={action === 'approve' ? 'Optional comments...' : 'Required: Please provide reason for rejection'}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApproval(action)}
                      disabled={approving || (action === 'reject' && !comments.trim())}
                      variant={action === 'approve' ? 'success' : 'danger'}
                    >
                      {approving ? 'Processing...' : action === 'approve' ? 'Approve' : 'Reject'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setAction(null);
                        setComments('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Button onClick={() => setAction('approve')} variant="success">
                    Approve
                  </Button>
                  <Button onClick={() => setAction('reject')} variant="danger">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

