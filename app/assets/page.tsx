'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { AssetStatus, OwnershipType } from '@/types';

interface Asset {
  _id: string;
  registrationNumber: string;
  model: string;
  variant: string;
  capacity: number;
  purchaseDate: string;
  ownershipType: string;
  status: AssetStatus;
}

// Dummy data fallback
const dummyAssets: Asset[] = [
  {
    _id: '1',
    registrationNumber: 'DL-01-AB-1234',
    model: 'Tata Nexon',
    variant: 'EV Prime',
    capacity: 4,
    purchaseDate: '2023-01-15',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '2',
    registrationNumber: 'HR-26-AB-5678',
    model: 'Mahindra eVerito',
    variant: 'D4',
    capacity: 4,
    purchaseDate: '2023-02-20',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '3',
    registrationNumber: 'DL-03-EF-9012',
    model: 'Tata Tigor',
    variant: 'EV XZ+',
    capacity: 4,
    purchaseDate: '2023-03-10',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '4',
    registrationNumber: 'HR-26-CD-3456',
    model: 'Mahindra e2o',
    variant: 'Plus',
    capacity: 4,
    purchaseDate: '2023-04-05',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.UNDER_MAINTENANCE,
  },
  {
    _id: '5',
    registrationNumber: 'DL-05-IJ-7890',
    model: 'Tata Nexon',
    variant: 'EV Max',
    capacity: 5,
    purchaseDate: '2023-05-12',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '6',
    registrationNumber: 'HR-26-EF-2345',
    model: 'Mahindra eVerito',
    variant: 'D6',
    capacity: 4,
    purchaseDate: '2023-06-18',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '7',
    registrationNumber: 'DL-07-MN-6789',
    model: 'Tata Tigor',
    variant: 'EV XZ',
    capacity: 4,
    purchaseDate: '2023-07-22',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RESERVED,
  },
  {
    _id: '8',
    registrationNumber: 'HR-26-GH-0123',
    model: 'Mahindra e2o',
    variant: 'Plus',
    capacity: 4,
    purchaseDate: '2023-08-30',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '9',
    registrationNumber: 'DL-09-QR-4567',
    model: 'Tata Nexon',
    variant: 'EV Prime',
    capacity: 5,
    purchaseDate: '2023-09-14',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '10',
    registrationNumber: 'HR-26-IJ-8901',
    model: 'Mahindra eVerito',
    variant: 'D4',
    capacity: 4,
    purchaseDate: '2023-10-08',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.UNDER_MAINTENANCE,
  },
  {
    _id: '11',
    registrationNumber: 'DL-11-UV-2345',
    model: 'Tata Tigor',
    variant: 'EV XZ+',
    capacity: 4,
    purchaseDate: '2023-11-19',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '12',
    registrationNumber: 'HR-26-KL-6789',
    model: 'Tata Nexon',
    variant: 'EV Max',
    capacity: 5,
    purchaseDate: '2023-12-25',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '13',
    registrationNumber: 'DL-13-YZ-0123',
    model: 'Mahindra e2o',
    variant: 'Plus',
    capacity: 4,
    purchaseDate: '2024-01-10',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '14',
    registrationNumber: 'HR-26-MN-4567',
    model: 'Tata Tigor',
    variant: 'EV XZ',
    capacity: 4,
    purchaseDate: '2024-02-15',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RESERVED,
  },
  {
    _id: '15',
    registrationNumber: 'DL-15-BB-8901',
    model: 'Mahindra eVerito',
    variant: 'D6',
    capacity: 4,
    purchaseDate: '2024-03-20',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '16',
    registrationNumber: 'HR-26-OP-2345',
    model: 'Tata Nexon',
    variant: 'EV Prime',
    capacity: 5,
    purchaseDate: '2024-04-05',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '17',
    registrationNumber: 'DL-17-DD-6789',
    model: 'Tata Tigor',
    variant: 'EV XZ+',
    capacity: 4,
    purchaseDate: '2024-05-12',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.UNDER_MAINTENANCE,
  },
  {
    _id: '18',
    registrationNumber: 'HR-26-QR-0123',
    model: 'Mahindra e2o',
    variant: 'Plus',
    capacity: 4,
    purchaseDate: '2024-06-18',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '19',
    registrationNumber: 'DL-19-FF-4567',
    model: 'Tata Nexon',
    variant: 'EV Max',
    capacity: 5,
    purchaseDate: '2024-07-22',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '20',
    registrationNumber: 'HR-26-ST-8901',
    model: 'Mahindra eVerito',
    variant: 'D4',
    capacity: 4,
    purchaseDate: '2024-08-30',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '21',
    registrationNumber: 'DL-21-HH-2345',
    model: 'Tata Tigor',
    variant: 'EV XZ',
    capacity: 4,
    purchaseDate: '2024-09-14',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RESERVED,
  },
  {
    _id: '22',
    registrationNumber: 'HR-26-UV-6789',
    model: 'Tata Nexon',
    variant: 'EV Prime',
    capacity: 5,
    purchaseDate: '2024-10-08',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '23',
    registrationNumber: 'DL-23-JJ-0123',
    model: 'Mahindra e2o',
    variant: 'Plus',
    capacity: 4,
    purchaseDate: '2024-11-19',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.UNDER_MAINTENANCE,
  },
  {
    _id: '24',
    registrationNumber: 'HR-26-WX-4567',
    model: 'Tata Tigor',
    variant: 'EV XZ+',
    capacity: 4,
    purchaseDate: '2024-12-25',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '25',
    registrationNumber: 'DL-25-LL-7890',
    model: 'Tata Safari',
    variant: 'XE',
    capacity: 7,
    purchaseDate: '2023-03-15',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '26',
    registrationNumber: 'HR-26-YZ-1234',
    model: 'Mahindra XUV700',
    variant: 'AX5',
    capacity: 7,
    purchaseDate: '2023-04-20',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '27',
    registrationNumber: 'DL-27-NN-5678',
    model: 'Tata Safari',
    variant: 'XM',
    capacity: 7,
    purchaseDate: '2023-05-25',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '28',
    registrationNumber: 'HR-26-AA-9012',
    model: 'Mahindra XUV700',
    variant: 'AX7',
    capacity: 7,
    purchaseDate: '2023-06-10',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '29',
    registrationNumber: 'DL-29-PP-3456',
    model: 'Tata Safari',
    variant: 'XZ',
    capacity: 7,
    purchaseDate: '2023-07-18',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.UNDER_MAINTENANCE,
  },
  {
    _id: '30',
    registrationNumber: 'HR-26-BB-7890',
    model: 'Mahindra XUV700',
    variant: 'AX3',
    capacity: 7,
    purchaseDate: '2023-08-22',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '31',
    registrationNumber: 'DL-31-RR-2345',
    model: 'Tata Safari',
    variant: 'XE Plus',
    capacity: 7,
    purchaseDate: '2023-09-30',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RESERVED,
  },
  {
    _id: '32',
    registrationNumber: 'HR-26-CC-6789',
    model: 'Mahindra XUV700',
    variant: 'AX5',
    capacity: 7,
    purchaseDate: '2023-10-15',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '33',
    registrationNumber: 'DL-33-TT-0123',
    model: 'Tata Safari',
    variant: 'XM Plus',
    capacity: 7,
    purchaseDate: '2023-11-20',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.AVAILABLE,
  },
  {
    _id: '34',
    registrationNumber: 'HR-26-DD-4567',
    model: 'Mahindra XUV700',
    variant: 'AX7',
    capacity: 7,
    purchaseDate: '2023-12-05',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.UNDER_MAINTENANCE,
  },
  {
    _id: '35',
    registrationNumber: 'DL-35-VV-8901',
    model: 'Tata Safari',
    variant: 'XZ Plus',
    capacity: 7,
    purchaseDate: '2024-01-12',
    ownershipType: OwnershipType.OWNED,
    status: AssetStatus.RENTED,
  },
  {
    _id: '36',
    registrationNumber: 'HR-26-EE-2345',
    model: 'Mahindra XUV700',
    variant: 'AX3',
    capacity: 7,
    purchaseDate: '2024-02-28',
    ownershipType: OwnershipType.LEASED,
    status: AssetStatus.AVAILABLE,
  },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, [statusFilter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/api/assets?status=${statusFilter}` : '/api/assets';
      const response = await fetch(url);
      const result = await response.json();
      
      // Always use dummy data for demo purposes
      // If you want to use real API data when available, uncomment the condition below
      // if (result.success && result.data && result.data.length >= 5) {
      //   setAssets(result.data);
      //   return;
      // }
      
      // Use dummy data
      let filteredDummy = dummyAssets;
      if (statusFilter) {
        filteredDummy = dummyAssets.filter(asset => asset.status === statusFilter);
      }
      setAssets(filteredDummy);
    } catch (error) {
      console.error('Error fetching assets:', error);
      // Use dummy data on error
      let filteredDummy = dummyAssets;
      if (statusFilter) {
        filteredDummy = dummyAssets.filter(asset => asset.status === statusFilter);
      }
      setAssets(filteredDummy);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setAssets(assets.filter(asset => asset._id !== id));
      } else {
        alert('Failed to delete asset: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Error deleting asset. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    const colors = {
      [AssetStatus.AVAILABLE]: 'bg-green-100 text-green-800',
      [AssetStatus.RENTED]: 'bg-snap-teal-100 text-snap-teal-800',
      [AssetStatus.UNDER_MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
      [AssetStatus.RESERVED]: 'bg-snap-coral-100 text-snap-coral-800',
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
      accessor: (row: Asset, index?: number) => (
        <span className="text-gray-600 font-medium">{index !== undefined ? index + 1 : ''}</span>
      ),
    },
    { header: 'Registration Number', accessor: 'registrationNumber' as const },
    { header: 'Model', accessor: 'model' as const },
    { header: 'Variant', accessor: 'variant' as const },
    { header: 'Capacity', accessor: 'capacity' as const },
    {
      header: 'Status',
      accessor: (row: Asset) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessor: (row: Asset) => (
        <div className="flex items-center gap-2">
          <Link href={`/assets/${row._id}`}>
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
          <h1 className="text-3xl font-bold text-gray-900">Asset Master</h1>
          <p className="mt-2 text-base text-gray-600">Manage all vehicle assets</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/assets/new">
            <Button>Add Asset</Button>
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
            {Object.values(AssetStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No assets found</p>
          </div>
        ) : (
          <Table data={assets} columns={columns} />
        )}
      </div>
    </div>
  );
}

