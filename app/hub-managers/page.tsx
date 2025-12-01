'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from '@/components/Table';
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

// Dummy data fallback
const dummyHubManagers: HubManager[] = [
  { _id: '1', name: 'Priya Sharma', email: 'priya.sharma@snap-e.com', phone: '+91 98765 41001', hubLocation: 'Delhi Central', employeeCode: 'HM-001', isActive: true },
  { _id: '2', name: 'Rahul Verma', email: 'rahul.verma@snap-e.com', phone: '+91 98765 41002', hubLocation: 'Delhi North', employeeCode: 'HM-002', isActive: true },
  { _id: '3', name: 'Anjali Patel', email: 'anjali.patel@snap-e.com', phone: '+91 98765 41003', hubLocation: 'Delhi South', employeeCode: 'HM-003', isActive: true },
  { _id: '4', name: 'Vikram Singh', email: 'vikram.singh@snap-e.com', phone: '+91 98765 41004', hubLocation: 'Gurgaon Sector 29', employeeCode: 'HM-004', isActive: true },
  { _id: '5', name: 'Sneha Das', email: 'sneha.das@snap-e.com', phone: '+91 98765 41005', hubLocation: 'Gurgaon Cyber City', employeeCode: 'HM-005', isActive: true },
  { _id: '6', name: 'Arjun Banerjee', email: 'arjun.banerjee@snap-e.com', phone: '+91 98765 41006', hubLocation: 'Delhi East', employeeCode: 'HM-006', isActive: true },
];

export default function HubManagersPage() {
  const [hubManagers, setHubManagers] = useState<HubManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHubManagers();
  }, []);

  const fetchHubManagers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hub-managers');
      const result = await response.json();
      
      // Always use dummy data for demo purposes
      // If you want to use real API data when available, uncomment the condition below
      // if (result.success && result.data && result.data.length >= 5) {
      //   setHubManagers(result.data);
      //   return;
      // }
      
      // Use dummy data
      setHubManagers(dummyHubManagers);
    } catch (error) {
      console.error('Error fetching hub managers:', error);
      // Use dummy data on error
      setHubManagers(dummyHubManagers);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hub manager? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/hub-managers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setHubManagers(hubManagers.filter(manager => manager._id !== id));
      } else {
        alert('Failed to delete hub manager: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting hub manager:', error);
      alert('Error deleting hub manager. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      header: 'S.No.',
      accessor: (row: HubManager, index?: number) => (
        <span className="text-gray-600 font-medium">{index !== undefined ? index + 1 : ''}</span>
      ),
    },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Email', accessor: 'email' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Hub Location', accessor: 'hubLocation' as const },
    { header: 'Employee Code', accessor: 'employeeCode' as const },
    {
      header: 'Status',
      accessor: (row: HubManager) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: HubManager) => (
        <div className="flex items-center gap-2">
          <Link href={`/hub-managers/${row._id}`}>
            <Button size="sm" variant="secondary">View</Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(row._id);
            }}
            disabled={deletingId === row._id}
          >
            {deletingId === row._id ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Hub Manager Master</h1>
          <p className="mt-2 text-base text-gray-600">Manage all hub managers</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/hub-managers/new">
            <Button>Add Hub Manager</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : hubManagers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hub managers found</p>
          </div>
        ) : (
          <Table data={hubManagers} columns={columns} />
        )}
      </div>
    </div>
  );
}


