'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import { DriverStatus } from '@/types';

interface Driver {
  _id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  idProof?: string;
  address: string;
  isBlacklisted: boolean;
  status: DriverStatus;
}

// Dummy data mapping - same as in detail page
const getDummyDriver = (id: string): Driver | null => {
  const driverMap: Record<string, Driver> = {
    '1': { _id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', licenseNumber: 'DL-01-2020-1234567', licenseExpiryDate: '2034-03-15', address: '123 MG Road, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '2': { _id: '2', name: 'Amit Singh', phone: '+91 98765 43211', licenseNumber: 'DL-01-2020-1234568', licenseExpiryDate: '2034-04-20', address: '456 Park Street, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '3': { _id: '3', name: 'Suresh Yadav', phone: '+91 98765 43212', licenseNumber: 'DL-01-2020-1234569', licenseExpiryDate: '2034-05-10', address: '789 Salt Lake, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '4': { _id: '4', name: 'Mohan Das', phone: '+91 98765 43213', licenseNumber: 'DL-01-2020-1234570', licenseExpiryDate: '2034-12-31', address: '321 Howrah, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '5': { _id: '5', name: 'Vikash Sharma', phone: '+91 98765 43214', licenseNumber: 'DL-01-2020-1234571', licenseExpiryDate: '2034-06-15', address: '654 New Town, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '6': { _id: '6', name: 'Ramesh Patel', phone: '+91 98765 43215', licenseNumber: 'DL-01-2020-1234572', licenseExpiryDate: '2034-07-20', address: '987 Behala, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '7': { _id: '7', name: 'Anil Kumar', phone: '+91 98765 43216', licenseNumber: 'DL-01-2020-1234573', licenseExpiryDate: '2034-08-25', address: '147 Tollygunge, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '8': { _id: '8', name: 'Sunil Verma', phone: '+91 98765 43217', licenseNumber: 'DL-01-2020-1234574', licenseExpiryDate: '2034-09-30', address: '258 Ballygunge, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '9': { _id: '9', name: 'Pradeep Roy', phone: '+91 98765 43218', licenseNumber: 'DL-01-2020-1234575', licenseExpiryDate: '2034-10-15', address: '369 Alipore, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '10': { _id: '10', name: 'Naresh Ghosh', phone: '+91 98765 43219', licenseNumber: 'DL-01-2020-1234576', licenseExpiryDate: '2034-11-20', address: '741 Sealdah, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '11': { _id: '11', name: 'Mahesh Banerjee', phone: '+91 98765 43220', licenseNumber: 'DL-01-2020-1234577', licenseExpiryDate: '2034-12-25', address: '852 Dumdum, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '12': { _id: '12', name: 'Dinesh Chatterjee', phone: '+91 98765 43221', licenseNumber: 'DL-01-2020-1234578', licenseExpiryDate: '2035-01-10', address: '963 Barasat, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '13': { _id: '13', name: 'Kiran Sen', phone: '+91 98765 43222', licenseNumber: 'DL-01-2020-1234579', licenseExpiryDate: '2035-02-15', address: '159 Kalyani, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '14': { _id: '14', name: 'Ravi Mondal', phone: '+91 98765 43223', licenseNumber: 'DL-01-2020-1234580', licenseExpiryDate: '2035-03-20', address: '357 Barrackpore, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '15': { _id: '15', name: 'Sandeep Dutta', phone: '+91 98765 43224', licenseNumber: 'DL-01-2020-1234581', licenseExpiryDate: '2035-04-25', address: '468 Serampore, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '16': { _id: '16', name: 'Arjun Basu', phone: '+91 98765 43225', licenseNumber: 'DL-01-2020-1234582', licenseExpiryDate: '2035-05-30', address: '579 Chandannagar, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '17': { _id: '17', name: 'Deepak Sarkar', phone: '+91 98765 43226', licenseNumber: 'DL-01-2020-1234583', licenseExpiryDate: '2034-11-15', address: '680 Hooghly, Kolkata', isBlacklisted: false, status: DriverStatus.INACTIVE },
    '18': { _id: '18', name: 'Gopal Mitra', phone: '+91 98765 43227', licenseNumber: 'DL-01-2020-1234584', licenseExpiryDate: '2034-10-20', address: '791 Burdwan, Kolkata', isBlacklisted: false, status: DriverStatus.INACTIVE },
    '19': { _id: '19', name: 'Hari Bose', phone: '+91 98765 43228', licenseNumber: 'DL-01-2020-1234585', licenseExpiryDate: '2035-06-10', address: '802 Asansol, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '20': { _id: '20', name: 'Ishwar Naskar', phone: '+91 98765 43229', licenseNumber: 'DL-01-2020-1234586', licenseExpiryDate: '2035-07-15', address: '913 Durgapur, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '21': { _id: '21', name: 'Jagdish Halder', phone: '+91 98765 43230', licenseNumber: 'DL-01-2020-1234587', licenseExpiryDate: '2035-08-20', address: '124 Siliguri, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '22': { _id: '22', name: 'Kailash Saha', phone: '+91 98765 43231', licenseNumber: 'DL-01-2020-1234588', licenseExpiryDate: '2035-09-25', address: '235 Darjeeling, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '23': { _id: '23', name: 'Lalit Bhowmick', phone: '+91 98765 43232', licenseNumber: 'DL-01-2020-1234589', licenseExpiryDate: '2035-10-30', address: '346 Jalpaiguri, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '24': { _id: '24', name: 'Manish Dasgupta', phone: '+91 98765 43233', licenseNumber: 'DL-01-2020-1234590', licenseExpiryDate: '2035-11-10', address: '457 Cooch Behar, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '25': { _id: '25', name: 'Nikhil Kar', phone: '+91 98765 43234', licenseNumber: 'DL-01-2020-1234591', licenseExpiryDate: '2035-12-15', address: '568 Malda, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '26': { _id: '26', name: 'Omkar Pal', phone: '+91 98765 43235', licenseNumber: 'DL-01-2020-1234592', licenseExpiryDate: '2035-01-20', address: '679 Murshidabad, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '27': { _id: '27', name: 'Pankaj De', phone: '+91 98765 43236', licenseNumber: 'DL-01-2020-1234593', licenseExpiryDate: '2035-02-25', address: '780 Nadia, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '28': { _id: '28', name: 'Qamar Ali', phone: '+91 98765 43237', licenseNumber: 'DL-01-2020-1234594', licenseExpiryDate: '2035-03-30', address: '891 Birbhum, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '29': { _id: '29', name: 'Rohit Malakar', phone: '+91 98765 43238', licenseNumber: 'DL-01-2020-1234595', licenseExpiryDate: '2034-09-15', address: '902 Purulia, Kolkata', isBlacklisted: true, status: DriverStatus.INACTIVE },
    '30': { _id: '30', name: 'Sachin Pramanik', phone: '+91 98765 43239', licenseNumber: 'DL-01-2020-1234596', licenseExpiryDate: '2035-04-10', address: '113 Bankura, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '31': { _id: '31', name: 'Tarun Ray', phone: '+91 98765 43240', licenseNumber: 'DL-01-2020-1234597', licenseExpiryDate: '2035-05-15', address: '224 Paschim Medinipur, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
    '32': { _id: '32', name: 'Uday Majumdar', phone: '+91 98765 43241', licenseNumber: 'DL-01-2020-1234598', licenseExpiryDate: '2035-06-20', address: '335 Purba Medinipur, Kolkata', isBlacklisted: false, status: DriverStatus.ACTIVE },
  };

  return driverMap[id] || null;
};

export default function EditDriverPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    address: '',
    isBlacklisted: false,
    status: DriverStatus.ACTIVE,
  });

  useEffect(() => {
    if (params.id) {
      fetchDriver();
    }
  }, [params.id]);

  const fetchDriver = async () => {
    try {
      setFetching(true);
      const response = await fetch(`/api/drivers/${params.id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const driver = result.data;
        setFormData({
          name: driver.name || '',
          phone: driver.phone || '',
          licenseNumber: driver.licenseNumber || '',
          licenseExpiryDate: driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toISOString().split('T')[0] : '',
          address: driver.address || '',
          isBlacklisted: driver.isBlacklisted || false,
          status: driver.status || DriverStatus.ACTIVE,
        });
      } else {
        // Use dummy data if API doesn't return data
        const dummyDriver = getDummyDriver(params.id as string);
        if (dummyDriver) {
          setFormData({
            name: dummyDriver.name,
            phone: dummyDriver.phone,
            licenseNumber: dummyDriver.licenseNumber,
            licenseExpiryDate: dummyDriver.licenseExpiryDate ? new Date(dummyDriver.licenseExpiryDate).toISOString().split('T')[0] : '',
            address: dummyDriver.address,
            isBlacklisted: dummyDriver.isBlacklisted,
            status: dummyDriver.status,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching driver:', error);
      // Use dummy data on error
      const dummyDriver = getDummyDriver(params.id as string);
      if (dummyDriver) {
        setFormData({
          name: dummyDriver.name,
          phone: dummyDriver.phone,
          licenseNumber: dummyDriver.licenseNumber,
          licenseExpiryDate: dummyDriver.licenseExpiryDate ? new Date(dummyDriver.licenseExpiryDate).toISOString().split('T')[0] : '',
          address: dummyDriver.address,
          isBlacklisted: dummyDriver.isBlacklisted,
          status: dummyDriver.status,
        });
      }
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if this is a dummy data ID (numeric string)
      const isDummyData = /^\d+$/.test(params.id as string);
      
      if (isDummyData) {
        // For dummy data, just show success and redirect (no API call)
        alert('Driver updated successfully! (Note: This is dummy data - changes are not persisted)');
        router.push(`/drivers/${params.id}`);
        return;
      }

      // For real data, call the API
      const response = await fetch(`/api/drivers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          licenseExpiryDate: new Date(formData.licenseExpiryDate),
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/drivers/${params.id}`);
      } else {
        alert(result.error || 'Failed to update driver');
      }
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('Failed to update driver');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl">
      <div className="mb-6">
        <Link href={`/drivers/${params.id}`}>
          <Button variant="secondary" size="sm">← Back to Driver</Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Driver</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Number *</label>
            <input
              type="text"
              required
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Expiry Date *</label>
            <input
              type="date"
              required
              value={formData.licenseExpiryDate}
              onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status *</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DriverStatus })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-snap-teal-500 focus:ring-snap-teal-500 sm:text-sm"
            >
              {Object.values(DriverStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isBlacklisted"
              checked={formData.isBlacklisted}
              onChange={(e) => setFormData({ ...formData, isBlacklisted: e.target.checked })}
              className="h-4 w-4 text-snap-teal-600 focus:ring-snap-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="isBlacklisted" className="ml-2 block text-sm text-gray-900">
              Mark as Blacklisted
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Driver'}
          </Button>
        </div>
      </form>
    </div>
  );
}

