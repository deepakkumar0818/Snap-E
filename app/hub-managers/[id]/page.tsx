'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';

interface HubManager {
  _id: string;
  name: string;
  email: string;
  phone: string;
  hubLocation: string;
  employeeCode: string;
  isActive: boolean;
}

// Dummy data mapping - matches hub managers from the main page
const getDummyHubManager = (id: string): HubManager | null => {
  const hubManagerMap: Record<string, HubManager> = {
    '1': { _id: '1', name: 'Priya Sharma', email: 'priya.sharma@snap-e.com', phone: '+91 98765 41001', hubLocation: 'Delhi Central', employeeCode: 'HM-001', isActive: true },
    '2': { _id: '2', name: 'Rahul Verma', email: 'rahul.verma@snap-e.com', phone: '+91 98765 41002', hubLocation: 'Delhi North', employeeCode: 'HM-002', isActive: true },
    '3': { _id: '3', name: 'Anjali Patel', email: 'anjali.patel@snap-e.com', phone: '+91 98765 41003', hubLocation: 'Delhi South', employeeCode: 'HM-003', isActive: true },
    '4': { _id: '4', name: 'Vikram Singh', email: 'vikram.singh@snap-e.com', phone: '+91 98765 41004', hubLocation: 'Gurgaon Sector 29', employeeCode: 'HM-004', isActive: true },
    '5': { _id: '5', name: 'Sneha Das', email: 'sneha.das@snap-e.com', phone: '+91 98765 41005', hubLocation: 'Gurgaon Cyber City', employeeCode: 'HM-005', isActive: true },
    '6': { _id: '6', name: 'Arjun Banerjee', email: 'arjun.banerjee@snap-e.com', phone: '+91 98765 41006', hubLocation: 'Delhi East', employeeCode: 'HM-006', isActive: true },
  };

  return hubManagerMap[id] || null;
};

export default function HubManagerDetailPage() {
  const params = useParams();
  const [hubManager, setHubManager] = useState<HubManager | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchHubManager();
    }
  }, [params.id]);

  const fetchHubManager = async () => {
    try {
      const response = await fetch(`/api/hub-managers/${params.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        setHubManager(result.data);
      } else {
        // Use dummy data if API doesn't return data
        const dummyHubManager = getDummyHubManager(params.id as string);
        if (dummyHubManager) {
          setHubManager(dummyHubManager);
        }
      }
    } catch (error) {
      console.error('Error fetching hub manager:', error);
      // Use dummy data on error
      const dummyHubManager = getDummyHubManager(params.id as string);
      if (dummyHubManager) {
        setHubManager(dummyHubManager);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!hubManager) {
    return <div className="text-center py-12">Hub Manager not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/hub-managers">
          <Button variant="secondary" size="sm">← Back to Hub Managers</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{hubManager.name}</h1>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                hubManager.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {hubManager.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{hubManager.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{hubManager.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Hub Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{hubManager.hubLocation}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Employee Code</dt>
              <dd className="mt-1 text-sm text-gray-900">{hubManager.employeeCode}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}


