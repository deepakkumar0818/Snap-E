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
    // Use dummy data immediately for fast loading
    setLoading(true);
    setHubManagers(dummyHubManagers);
    setLoading(false);
    
    // Optional: Fetch real data in the background (commented out for performance)
    // try {
    //   const response = await fetch('/api/hub-managers');
    //   const result = await response.json();
    //   if (result.success && result.data && result.data.length >= 5) {
    //     setHubManagers(result.data);
    //   }
    // } catch (error) {
    //   console.error('Error fetching hub managers:', error);
    // }
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
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Hub Manager Master</h1>
          <p className="text-lg text-gray-400">Manage all hub managers across locations</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/hub-managers/new">
            <Button className="shadow-lg">+ Add Hub Manager</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-snap-teal-500 mb-4"></div>
            <p className="text-gray-400 font-medium">Loading hub managers...</p>
          </div>
        ) : hubManagers.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl shadow-md border border-gray-700">
            <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-semibold text-gray-300 mb-1">No hub managers found</p>
            <p className="text-gray-500">Add a new hub manager to get started</p>
          </div>
        ) : (
          <Table data={hubManagers} columns={columns} />
        )}
      </div>
    </div>
  );
}


