'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { RentalType } from '@/types';

interface Driver {
  _id: string;
  name: string;
  phone: string;
}

interface Asset {
  _id: string;
  registrationNumber: string;
  model: string;
  status: string;
}

export default function NewRentalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState({
    driverId: '',
    assetId: '',
    hubId: '',
    rentalType: RentalType.DAILY,
    startDateTime: new Date().toISOString().slice(0, 16),
    expectedReturnDateTime: '',
    rentalAmount: '',
    depositAmount: '',
  });

  useEffect(() => {
    fetchDrivers();
    fetchAvailableAssets();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/drivers?status=ACTIVE');
      const result = await response.json();
      if (result.success) {
        setDrivers(result.data.filter((d: Driver) => !d.isBlacklisted));
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchAvailableAssets = async () => {
    try {
      const response = await fetch('/api/assets?status=AVAILABLE');
      const result = await response.json();
      if (result.success) {
        setAssets(result.data);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDateTime: new Date(formData.startDateTime),
          expectedReturnDateTime: formData.expectedReturnDateTime
            ? new Date(formData.expectedReturnDateTime)
            : undefined,
          rentalAmount: parseFloat(formData.rentalAmount),
          depositAmount: parseFloat(formData.depositAmount),
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/rentals');
      } else {
        alert(result.error || 'Failed to create rental');
      }
    } catch (error) {
      console.error('Error creating rental:', error);
      alert('Failed to create rental');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Start New Rental</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver *</label>
            <select
              required
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name} - {driver.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle *</label>
            <select
              required
              value={formData.assetId}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Vehicle</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.registrationNumber} - {asset.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hub ID *</label>
            <input
              type="text"
              required
              value={formData.hubId}
              onChange={(e) => setFormData({ ...formData, hubId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rental Type *</label>
            <select
              required
              value={formData.rentalType}
              onChange={(e) => setFormData({ ...formData, rentalType: e.target.value as RentalType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {Object.values(RentalType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.startDateTime}
              onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Return Date & Time</label>
            <input
              type="datetime-local"
              value={formData.expectedReturnDateTime}
              onChange={(e) => setFormData({ ...formData, expectedReturnDateTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rental Amount (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.rentalAmount}
                onChange={(e) => setFormData({ ...formData, rentalAmount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Deposit Amount (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Start Rental'}
          </Button>
        </div>
      </form>
    </div>
  );
}

