'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface Asset {
  _id: string;
  registrationNumber: string;
  model: string;
  status: string;
}

interface HubManager {
  _id: string;
  name: string;
  hubLocation: string;
}

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hubManagers, setHubManagers] = useState<HubManager[]>([]);
  const [formData, setFormData] = useState({
    assetId: '',
    raisedByHubManagerId: '',
    serviceCenterName: '',
    issueDescription: '',
    estimatedCost: '',
    estimationDetails: [{ itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
  });

  useEffect(() => {
    fetchAssets();
    fetchHubManagers();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets');
      const result = await response.json();
      if (result.success) {
        setAssets(result.data);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchHubManagers = async () => {
    try {
      const response = await fetch('/api/hub-managers?isActive=true');
      const result = await response.json();
      if (result.success) {
        setHubManagers(result.data);
      }
    } catch (error) {
      console.error('Error fetching hub managers:', error);
    }
  };

  const updateEstimationItem = (index: number, field: string, value: any) => {
    const updated = [...formData.estimationDetails];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].totalPrice = updated[index].quantity * updated[index].unitPrice;
    }
    setFormData({ ...formData, estimationDetails: updated });
  };

  const addEstimationItem = () => {
    setFormData({
      ...formData,
      estimationDetails: [
        ...formData.estimationDetails,
        { itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 },
      ],
    });
  };

  const removeEstimationItem = (index: number) => {
    const updated = formData.estimationDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, estimationDetails: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const totalEstimatedCost = formData.estimationDetails.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedCost: parseFloat(formData.estimatedCost) || totalEstimatedCost,
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/maintenance');
      } else {
        alert(result.error || 'Failed to create maintenance request');
      }
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      alert('Failed to create maintenance request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Raise Maintenance Request</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
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
            <label className="block text-sm font-medium text-gray-700">Raised By (Hub Manager) *</label>
            <select
              required
              value={formData.raisedByHubManagerId}
              onChange={(e) => setFormData({ ...formData, raisedByHubManagerId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Hub Manager</option>
              {hubManagers.map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.name} - {manager.hubLocation}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service Center Name *</label>
            <input
              type="text"
              required
              value={formData.serviceCenterName}
              onChange={(e) => setFormData({ ...formData, serviceCenterName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Description *</label>
            <textarea
              required
              rows={4}
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Total Cost (₹) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Estimation Details</label>
              <Button type="button" size="sm" variant="secondary" onClick={addEstimationItem}>
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {formData.estimationDetails.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 bg-gray-50 rounded">
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.itemName}
                      onChange={(e) => updateEstimationItem(index, 'itemName', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateEstimationItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Unit Price"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateEstimationItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Total"
                      value={item.totalPrice}
                      readOnly
                      className="block w-full rounded-md border-gray-300 bg-gray-100 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => removeEstimationItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Raise Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}


