'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { DriverStatus } from '@/types';

interface Driver {
  _id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  address: string;
  isBlacklisted: boolean;
  status: DriverStatus;
}

// Dummy data fallback
const dummyDrivers: Driver[] = [
  { _id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', licenseNumber: 'DL-01-2020-1234567', licenseExpiryDate: '2034-03-15', address: '123 MG Road, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '2', name: 'Amit Singh', phone: '+91 98765 43211', licenseNumber: 'DL-01-2020-1234568', licenseExpiryDate: '2034-04-20', address: '456 Park Street, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '3', name: 'Suresh Yadav', phone: '+91 98765 43212', licenseNumber: 'DL-01-2020-1234569', licenseExpiryDate: '2034-05-10', address: '789 Salt Lake, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '4', name: 'Mohan Das', phone: '+91 98765 43213', licenseNumber: 'DL-01-2020-1234570', licenseExpiryDate: '2034-12-31', address: '321 Howrah, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '5', name: 'Vikash Sharma', phone: '+91 98765 43214', licenseNumber: 'DL-01-2020-1234571', licenseExpiryDate: '2034-06-15', address: '654 New Town, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '6', name: 'Ramesh Patel', phone: '+91 98765 43215', licenseNumber: 'DL-01-2020-1234572', licenseExpiryDate: '2034-07-20', address: '987 Behala, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '7', name: 'Anil Kumar', phone: '+91 98765 43216', licenseNumber: 'DL-01-2020-1234573', licenseExpiryDate: '2034-08-25', address: '147 Tollygunge, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '8', name: 'Sunil Verma', phone: '+91 98765 43217', licenseNumber: 'DL-01-2020-1234574', licenseExpiryDate: '2034-09-30', address: '258 Ballygunge, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '9', name: 'Pradeep Roy', phone: '+91 98765 43218', licenseNumber: 'DL-01-2020-1234575', licenseExpiryDate: '2034-10-15', address: '369 Alipore, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '10', name: 'Naresh Ghosh', phone: '+91 98765 43219', licenseNumber: 'DL-01-2020-1234576', licenseExpiryDate: '2034-11-20', address: '741 Sealdah, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '11', name: 'Mahesh Banerjee', phone: '+91 98765 43220', licenseNumber: 'DL-01-2020-1234577', licenseExpiryDate: '2034-12-25', address: '852 Dumdum, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '12', name: 'Dinesh Chatterjee', phone: '+91 98765 43221', licenseNumber: 'DL-01-2020-1234578', licenseExpiryDate: '2035-01-10', address: '963 Barasat, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '13', name: 'Kiran Sen', phone: '+91 98765 43222', licenseNumber: 'DL-01-2020-1234579', licenseExpiryDate: '2035-02-15', address: '159 Kalyani, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '14', name: 'Ravi Mondal', phone: '+91 98765 43223', licenseNumber: 'DL-01-2020-1234580', licenseExpiryDate: '2035-03-20', address: '357 Barrackpore, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '15', name: 'Sandeep Dutta', phone: '+91 98765 43224', licenseNumber: 'DL-01-2020-1234581', licenseExpiryDate: '2035-04-25', address: '468 Serampore, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '16', name: 'Arjun Basu', phone: '+91 98765 43225', licenseNumber: 'DL-01-2020-1234582', licenseExpiryDate: '2035-05-30', address: '579 Chandannagar, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '17', name: 'Deepak Sarkar', phone: '+91 98765 43226', licenseNumber: 'DL-01-2020-1234583', licenseExpiryDate: '2034-11-15', address: '680 Hooghly, Kolkata', isBlacklisted: false, status: DriverStatus.INACTIVE },
  { _id: '18', name: 'Gopal Mitra', phone: '+91 98765 43227', licenseNumber: 'DL-01-2020-1234584', licenseExpiryDate: '2034-10-20', address: '791 Burdwan, Kolkata', isBlacklisted: false, status: DriverStatus.INACTIVE },
  { _id: '19', name: 'Hari Bose', phone: '+91 98765 43228', licenseNumber: 'DL-01-2020-1234585', licenseExpiryDate: '2035-06-10', address: '802 Asansol, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '20', name: 'Ishwar Naskar', phone: '+91 98765 43229', licenseNumber: 'DL-01-2020-1234586', licenseExpiryDate: '2035-07-15', address: '913 Durgapur, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '21', name: 'Jagdish Halder', phone: '+91 98765 43230', licenseNumber: 'DL-01-2020-1234587', licenseExpiryDate: '2035-08-20', address: '124 Siliguri, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '22', name: 'Kailash Saha', phone: '+91 98765 43231', licenseNumber: 'DL-01-2020-1234588', licenseExpiryDate: '2035-09-25', address: '235 Darjeeling, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '23', name: 'Lalit Bhowmick', phone: '+91 98765 43232', licenseNumber: 'DL-01-2020-1234589', licenseExpiryDate: '2035-10-30', address: '346 Jalpaiguri, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '24', name: 'Manish Dasgupta', phone: '+91 98765 43233', licenseNumber: 'DL-01-2020-1234590', licenseExpiryDate: '2035-11-10', address: '457 Cooch Behar, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '25', name: 'Nikhil Kar', phone: '+91 98765 43234', licenseNumber: 'DL-01-2020-1234591', licenseExpiryDate: '2035-12-15', address: '568 Malda, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '26', name: 'Omkar Pal', phone: '+91 98765 43235', licenseNumber: 'DL-01-2020-1234592', licenseExpiryDate: '2035-01-20', address: '679 Murshidabad, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '27', name: 'Pankaj De', phone: '+91 98765 43236', licenseNumber: 'DL-01-2020-1234593', licenseExpiryDate: '2035-02-25', address: '780 Nadia, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '28', name: 'Qamar Ali', phone: '+91 98765 43237', licenseNumber: 'DL-01-2020-1234594', licenseExpiryDate: '2035-03-30', address: '891 Birbhum, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '29', name: 'Rohit Malakar', phone: '+91 98765 43238', licenseNumber: 'DL-01-2020-1234595', licenseExpiryDate: '2034-09-15', address: '902 Purulia, Kolkata', isBlacklisted: true, status: DriverStatus.INACTIVE },
  { _id: '30', name: 'Sachin Pramanik', phone: '+91 98765 43239', licenseNumber: 'DL-01-2020-1234596', licenseExpiryDate: '2035-04-10', address: '113 Bankura, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '31', name: 'Tarun Ray', phone: '+91 98765 43240', licenseNumber: 'DL-01-2020-1234597', licenseExpiryDate: '2035-05-15', address: '224 Paschim Medinipur, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  { _id: '32', name: 'Uday Majumdar', phone: '+91 98765 43241', licenseNumber: 'DL-01-2020-1234598', licenseExpiryDate: '2035-06-20', address: '335 Purba Medinipur, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, [statusFilter]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/api/drivers?status=${statusFilter}` : '/api/drivers';
      const response = await fetch(url);
      const result = await response.json();
      
      // Always use dummy data for demo purposes
      // If you want to use real API data when available, uncomment the condition below
      // if (result.success && result.data && result.data.length >= 30) {
      //   setDrivers(result.data);
      //   return;
      // }
      
      // Use dummy data
      let filteredDummy = dummyDrivers;
      if (statusFilter) {
        filteredDummy = dummyDrivers.filter(driver => driver.status === statusFilter);
      }
      setDrivers(filteredDummy);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      // Use dummy data on error
      let filteredDummy = dummyDrivers;
      if (statusFilter) {
        filteredDummy = dummyDrivers.filter(driver => driver.status === statusFilter);
      }
      setDrivers(filteredDummy);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this driver? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setDrivers(drivers.filter(driver => driver._id !== id));
      } else {
        alert('Failed to delete driver: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Error deleting driver. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: DriverStatus, isBlacklisted: boolean) => {
    if (isBlacklisted) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-snap-coral-100 text-snap-coral-800">
          BLACKLISTED
        </span>
      );
    }
    const colors = {
      [DriverStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [DriverStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
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
      accessor: (row: Driver, index?: number) => (
        <span className="text-gray-600 font-medium">{index !== undefined ? index + 1 : ''}</span>
      ),
    },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'License Number', accessor: 'licenseNumber' as const },
    {
      header: 'License Expiry',
      accessor: (row: Driver) => new Date(row.licenseExpiryDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: (row: Driver) => getStatusBadge(row.status, row.isBlacklisted),
    },
    {
      header: 'Actions',
      accessor: (row: Driver) => (
        <div className="flex items-center gap-2">
          <Link href={`/drivers/${row._id}`}>
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
          <h1 className="text-3xl font-bold text-gray-900">Driver Master</h1>
          <p className="mt-2 text-base text-gray-600">Manage all drivers</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/drivers/new">
            <Button>Add Driver</Button>
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
            {Object.values(DriverStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : drivers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No drivers found</p>
          </div>
        ) : (
          <Table data={drivers} columns={columns} />
        )}
      </div>
    </div>
  );
}

