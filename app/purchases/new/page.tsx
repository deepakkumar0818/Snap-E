'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { ItemCategory, PurchaseRequestStatus } from '@/types';

interface HubManager {
  _id: string;
  name: string;
  hubLocation: string;
}

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hubManagers, setHubManagers] = useState<HubManager[]>([]);
  const [formData, setFormData] = useState({
    requestedByHubManagerId: '',
    hubId: '',
    items: [
      {
        itemName: '',
        category: ItemCategory.OTHER,
        quantity: 1,
        estimatedUnitPrice: 0,
        justification: '',
      },
    ],
    status: PurchaseRequestStatus.DRAFT,
  });

  useEffect(() => {
    fetchHubManagers();
  }, []);

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

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, items: updated });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemName: '',
          category: ItemCategory.OTHER,
          quantity: 1,
          estimatedUnitPrice: 0,
          justification: '',
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  const handleHubManagerChange = (hubManagerId: string) => {
    const manager = hubManagers.find((m) => m._id === hubManagerId);
    setFormData({
      ...formData,
      requestedByHubManagerId: hubManagerId,
      hubId: manager?.hubLocation || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent, submitForApproval: boolean = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: submitForApproval
            ? PurchaseRequestStatus.PENDING_SUPERVISOR_APPROVAL
            : PurchaseRequestStatus.DRAFT,
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/purchases');
      } else {
        alert(result.error || 'Failed to create purchase request');
      }
    } catch (error) {
      console.error('Error creating purchase request:', error);
      alert('Failed to create purchase request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-5xl">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Create Purchase Request</h1>

      <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Requested By (Hub Manager) *</label>
            <select
              required
              value={formData.requestedByHubManagerId}
              onChange={(e) => handleHubManagerChange(e.target.value)}
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Items *</label>
              <Button type="button" size="sm" variant="secondary" onClick={addItem}>
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Item Name *</label>
                      <input
                        type="text"
                        required
                        value={item.itemName}
                        onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Category *</label>
                      <select
                        required
                        value={item.category}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {Object.values(ItemCategory).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Estimated Unit Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.estimatedUnitPrice}
                        onChange={(e) => updateItem(index, 'estimatedUnitPrice', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Justification *</label>
                    <textarea
                      required
                      rows={2}
                      value={item.justification}
                      onChange={(e) => updateItem(index, 'justification', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Why is this item needed?"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
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
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </div>
      </form>
    </div>
  );
}

