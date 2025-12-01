'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
  kmDriven?: number;
  documents?: Array<{
    type: string;
    url?: string;
    expiryDate?: string;
    documentNumber?: string;
  }>;
}

// Dummy data mapping - matches assets from the main page
const getDummyAsset = (id: string): Asset | null => {
  // Map of all dummy assets with their details
  const assetMap: Record<string, Omit<Asset, 'documents'> & { documents?: Asset['documents'] }> = {
    '1': { _id: '1', registrationNumber: 'DL-01-AB-1234', model: 'Tata Nexon', variant: 'EV Prime', capacity: 4, purchaseDate: '2023-01-15', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 45230 },
    '2': { _id: '2', registrationNumber: 'HR-26-AB-5678', model: 'Mahindra eVerito', variant: 'D4', capacity: 4, purchaseDate: '2023-02-20', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 38950 },
    '3': { _id: '3', registrationNumber: 'DL-03-EF-9012', model: 'Tata Tigor', variant: 'EV XZ+', capacity: 4, purchaseDate: '2023-03-10', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 42180 },
    '4': { _id: '4', registrationNumber: 'HR-26-CD-3456', model: 'Mahindra e2o', variant: 'Plus', capacity: 4, purchaseDate: '2023-04-05', ownershipType: OwnershipType.LEASED, status: AssetStatus.UNDER_MAINTENANCE, kmDriven: 35670 },
    '5': { _id: '5', registrationNumber: 'DL-05-IJ-7890', model: 'Tata Nexon', variant: 'EV Max', capacity: 5, purchaseDate: '2023-05-12', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 39840 },
    '6': { _id: '6', registrationNumber: 'HR-26-EF-2345', model: 'Mahindra eVerito', variant: 'D6', capacity: 4, purchaseDate: '2023-06-18', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 36720 },
    '7': { _id: '7', registrationNumber: 'DL-07-MN-6789', model: 'Tata Tigor', variant: 'EV XZ', capacity: 4, purchaseDate: '2023-07-22', ownershipType: OwnershipType.OWNED, status: AssetStatus.RESERVED, kmDriven: 34150 },
    '8': { _id: '8', registrationNumber: 'HR-26-GH-0123', model: 'Mahindra e2o', variant: 'Plus', capacity: 4, purchaseDate: '2023-08-30', ownershipType: OwnershipType.LEASED, status: AssetStatus.AVAILABLE, kmDriven: 32580 },
    '9': { _id: '9', registrationNumber: 'DL-09-QR-4567', model: 'Tata Nexon', variant: 'EV Prime', capacity: 5, purchaseDate: '2023-09-14', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 31240 },
    '10': { _id: '10', registrationNumber: 'HR-26-IJ-8901', model: 'Mahindra eVerito', variant: 'D4', capacity: 4, purchaseDate: '2023-10-08', ownershipType: OwnershipType.OWNED, status: AssetStatus.UNDER_MAINTENANCE, kmDriven: 29860 },
    '11': { _id: '11', registrationNumber: 'DL-11-UV-2345', model: 'Tata Tigor', variant: 'EV XZ+', capacity: 4, purchaseDate: '2023-11-19', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 28430 },
    '12': { _id: '12', registrationNumber: 'HR-26-KL-6789', model: 'Tata Nexon', variant: 'EV Max', capacity: 5, purchaseDate: '2023-12-25', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 27150 },
    '13': { _id: '13', registrationNumber: 'DL-13-YZ-0123', model: 'Mahindra e2o', variant: 'Plus', capacity: 4, purchaseDate: '2024-01-10', ownershipType: OwnershipType.LEASED, status: AssetStatus.AVAILABLE, kmDriven: 18920 },
    '14': { _id: '14', registrationNumber: 'HR-26-MN-4567', model: 'Tata Tigor', variant: 'EV XZ', capacity: 4, purchaseDate: '2024-02-15', ownershipType: OwnershipType.OWNED, status: AssetStatus.RESERVED, kmDriven: 17650 },
    '15': { _id: '15', registrationNumber: 'DL-15-BB-8901', model: 'Mahindra eVerito', variant: 'D6', capacity: 4, purchaseDate: '2024-03-20', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 16380 },
    '16': { _id: '16', registrationNumber: 'HR-26-OP-2345', model: 'Tata Nexon', variant: 'EV Prime', capacity: 5, purchaseDate: '2024-04-05', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 15240 },
    '17': { _id: '17', registrationNumber: 'DL-17-DD-6789', model: 'Tata Tigor', variant: 'EV XZ+', capacity: 4, purchaseDate: '2024-05-12', ownershipType: OwnershipType.OWNED, status: AssetStatus.UNDER_MAINTENANCE, kmDriven: 14120 },
    '18': { _id: '18', registrationNumber: 'HR-26-QR-0123', model: 'Mahindra e2o', variant: 'Plus', capacity: 4, purchaseDate: '2024-06-18', ownershipType: OwnershipType.LEASED, status: AssetStatus.AVAILABLE, kmDriven: 13050 },
    '19': { _id: '19', registrationNumber: 'DL-19-FF-4567', model: 'Tata Nexon', variant: 'EV Max', capacity: 5, purchaseDate: '2024-07-22', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 11980 },
    '20': { _id: '20', registrationNumber: 'HR-26-ST-8901', model: 'Mahindra eVerito', variant: 'D4', capacity: 4, purchaseDate: '2024-08-30', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 10940 },
    '21': { _id: '21', registrationNumber: 'DL-21-HH-2345', model: 'Tata Tigor', variant: 'EV XZ', capacity: 4, purchaseDate: '2024-09-14', ownershipType: OwnershipType.OWNED, status: AssetStatus.RESERVED, kmDriven: 9920 },
    '22': { _id: '22', registrationNumber: 'HR-26-UV-6789', model: 'Tata Nexon', variant: 'EV Prime', capacity: 5, purchaseDate: '2024-10-08', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 8850 },
    '23': { _id: '23', registrationNumber: 'DL-23-JJ-0123', model: 'Mahindra e2o', variant: 'Plus', capacity: 4, purchaseDate: '2024-11-19', ownershipType: OwnershipType.LEASED, status: AssetStatus.UNDER_MAINTENANCE, kmDriven: 7820 },
    '24': { _id: '24', registrationNumber: 'HR-26-WX-4567', model: 'Tata Tigor', variant: 'EV XZ+', capacity: 4, purchaseDate: '2024-12-25', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 6840 },
    '25': { _id: '25', registrationNumber: 'DL-25-LL-7890', model: 'Tata Safari', variant: 'XE', capacity: 7, purchaseDate: '2023-03-15', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 41250 },
    '26': { _id: '26', registrationNumber: 'HR-26-YZ-1234', model: 'Mahindra XUV700', variant: 'AX5', capacity: 7, purchaseDate: '2023-04-20', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 38920 },
    '27': { _id: '27', registrationNumber: 'DL-27-NN-5678', model: 'Tata Safari', variant: 'XM', capacity: 7, purchaseDate: '2023-05-25', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 37180 },
    '28': { _id: '28', registrationNumber: 'HR-26-AA-9012', model: 'Mahindra XUV700', variant: 'AX7', capacity: 7, purchaseDate: '2023-06-10', ownershipType: OwnershipType.LEASED, status: AssetStatus.RENTED, kmDriven: 35460 },
    '29': { _id: '29', registrationNumber: 'DL-29-PP-3456', model: 'Tata Safari', variant: 'XZ', capacity: 7, purchaseDate: '2023-07-18', ownershipType: OwnershipType.OWNED, status: AssetStatus.UNDER_MAINTENANCE, kmDriven: 33840 },
    '30': { _id: '30', registrationNumber: 'HR-26-BB-7890', model: 'Mahindra XUV700', variant: 'AX3', capacity: 7, purchaseDate: '2023-08-22', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 32250 },
    '31': { _id: '31', registrationNumber: 'DL-31-RR-2345', model: 'Tata Safari', variant: 'XE Plus', capacity: 7, purchaseDate: '2023-09-30', ownershipType: OwnershipType.OWNED, status: AssetStatus.RESERVED, kmDriven: 30780 },
    '32': { _id: '32', registrationNumber: 'HR-26-CC-6789', model: 'Mahindra XUV700', variant: 'AX5', capacity: 7, purchaseDate: '2023-10-15', ownershipType: OwnershipType.LEASED, status: AssetStatus.RENTED, kmDriven: 29340 },
    '33': { _id: '33', registrationNumber: 'DL-33-TT-0123', model: 'Tata Safari', variant: 'XM Plus', capacity: 7, purchaseDate: '2023-11-20', ownershipType: OwnershipType.OWNED, status: AssetStatus.AVAILABLE, kmDriven: 27960 },
    '34': { _id: '34', registrationNumber: 'HR-26-DD-4567', model: 'Mahindra XUV700', variant: 'AX7', capacity: 7, purchaseDate: '2023-12-05', ownershipType: OwnershipType.OWNED, status: AssetStatus.UNDER_MAINTENANCE, kmDriven: 26620 },
    '35': { _id: '35', registrationNumber: 'DL-35-VV-8901', model: 'Tata Safari', variant: 'XZ Plus', capacity: 7, purchaseDate: '2024-01-12', ownershipType: OwnershipType.OWNED, status: AssetStatus.RENTED, kmDriven: 18450 },
    '36': { _id: '36', registrationNumber: 'HR-26-EE-2345', model: 'Mahindra XUV700', variant: 'AX3', capacity: 7, purchaseDate: '2024-02-28', ownershipType: OwnershipType.LEASED, status: AssetStatus.AVAILABLE, kmDriven: 17280 },
  };

  const assetData = assetMap[id];
  if (!assetData) return null;

  // Add default documents
  const documents: Asset['documents'] = [
    { type: 'Registration Certificate', documentNumber: `RC-${id.padStart(3, '0')}`, expiryDate: new Date(new Date(assetData.purchaseDate).setFullYear(new Date(assetData.purchaseDate).getFullYear() + 5)).toISOString().split('T')[0] },
    { type: 'Insurance', documentNumber: `INS-${id.padStart(3, '0')}`, expiryDate: new Date(new Date(assetData.purchaseDate).setFullYear(new Date(assetData.purchaseDate).getFullYear() + 1)).toISOString().split('T')[0] },
  ];

  return {
    ...assetData,
    documents,
  };
};

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAsset();
    }
  }, [params.id]);

  const fetchAsset = async () => {
    try {
      const response = await fetch(`/api/assets/${params.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        setAsset(result.data);
      } else {
        // Use dummy data if API doesn't return data
        const dummyAsset = getDummyAsset(params.id as string);
        if (dummyAsset) {
          setAsset(dummyAsset);
        }
      }
    } catch (error) {
      console.error('Error fetching asset:', error);
      // Use dummy data on error
      const dummyAsset = getDummyAsset(params.id as string);
      if (dummyAsset) {
        setAsset(dummyAsset);
      }
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!asset) {
    return <div className="text-center py-12">Asset not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/assets">
          <Button variant="secondary" size="sm">← Back to Assets</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{asset.registrationNumber}</h1>
            {getStatusBadge(asset.status)}
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Model</dt>
              <dd className="mt-1 text-sm text-gray-900">{asset.model}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Variant</dt>
              <dd className="mt-1 text-sm text-gray-900">{asset.variant}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Capacity</dt>
              <dd className="mt-1 text-sm text-gray-900">{asset.capacity}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(asset.purchaseDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">KM Driven</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {asset.kmDriven ? `${asset.kmDriven.toLocaleString()} km` : 'N/A'}
              </dd>
            </div>
          </dl>

          {asset.documents && asset.documents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              <div className="space-y-2">
                {asset.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                      {doc.documentNumber && (
                        <p className="text-xs text-gray-500">Number: {doc.documentNumber}</p>
                      )}
                      {doc.expiryDate && (
                        <p className="text-xs text-gray-500">
                          Expiry: {new Date(doc.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

