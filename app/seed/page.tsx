'use client';

import { useState } from 'react';
import Button from '@/components/Button';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!confirm('This will clear all existing data and seed the database with dummy data. Continue?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to seed database');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-2xl">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Seed Database</h1>
        <p className="text-sm text-gray-600 mb-6">
          This will populate your database with dummy data for testing. All existing data will be cleared.
        </p>

        <Button onClick={handleSeed} disabled={loading} variant="primary">
          {loading ? 'Seeding...' : 'Seed Database'}
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-2">Success!</h3>
            <p className="text-sm text-green-700 mb-3">{result.message}</p>
            <div className="text-sm text-green-700">
              <p><strong>Created:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{result.data.hubManagers} Hub Managers</li>
                <li>{result.data.drivers} Drivers</li>
                <li>{result.data.assets} Assets</li>
                <li>{result.data.rentals} Rentals</li>
                <li>{result.data.maintenanceRequests} Maintenance Requests</li>
                <li>{result.data.purchaseRequests} Purchase Requests</li>
              </ul>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-medium text-red-800 mb-2">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}


