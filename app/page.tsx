'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalAssets: number;
  activeRentals: number;
  pendingMaintenance: number;
  purchaseRequests: number;
  totalDrivers: number;
  totalHubManagers: number;
}

// Dummy data fallback
const dummyStats: DashboardStats = {
  totalAssets: 36, // Updated to match 36 cars
  activeRentals: 18,
  pendingMaintenance: 5,
  purchaseRequests: 8,
  totalDrivers: 32,
  totalHubManagers: 6,
};

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>(dummyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel
        const [assetsRes, rentalsRes, maintenanceRes, purchasesRes, driversRes, hubManagersRes] = await Promise.all([
          fetch('/api/assets'),
          fetch('/api/rentals?status=ACTIVE'),
          fetch('/api/maintenance?status=PENDING'),
          fetch('/api/purchases?status=PENDING'),
          fetch('/api/drivers'),
          fetch('/api/hub-managers'),
        ]);

        const assetsData = assetsRes.ok ? await assetsRes.json() : { data: [] };
        const rentalsData = rentalsRes.ok ? await rentalsRes.json() : { data: [] };
        const maintenanceData = maintenanceRes.ok ? await maintenanceRes.json() : { data: [] };
        const purchasesData = purchasesRes.ok ? await purchasesRes.json() : { data: [] };
        const driversData = driversRes.ok ? await driversRes.json() : { data: [] };
        const hubManagersData = hubManagersRes.ok ? await hubManagersRes.json() : { data: [] };

        // Always use dummy data for demo purposes
        // If you want to use real API data when available, uncomment the condition below
        // if (assetsData.data && assetsData.data.length >= 30) {
        //   setStats({
        //     totalAssets: assetsData.data.length,
        //     activeRentals: rentalsData.data?.length || dummyStats.activeRentals,
        //     pendingMaintenance: maintenanceData.data?.length || dummyStats.pendingMaintenance,
        //     purchaseRequests: purchasesData.data?.length || dummyStats.purchaseRequests,
        //     totalDrivers: driversData.data?.length || dummyStats.totalDrivers,
        //     totalHubManagers: hubManagersData.data?.length || dummyStats.totalHubManagers,
        //   });
        //   return;
        // }

        // Use dummy data
        setStats(dummyStats);
      } catch (error) {
        // Use dummy data on error
        console.error('Error fetching stats:', error);
        setStats(dummyStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-base text-gray-600">
          Welcome to Snap-e Cabs Rental Management System
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Assets Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalAssets}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-snap-teal-400 to-snap-teal-600 flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Rentals Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Active Rentals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.activeRentals}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-snap-coral-400 to-snap-coral-600 flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Maintenance Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.pendingMaintenance}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-snap-teal-400 to-snap-teal-600 flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Requests Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Purchase Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.purchaseRequests}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-snap-coral-400 to-snap-coral-600 flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Drivers Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalDrivers}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-snap-teal-400 to-snap-teal-600 flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hub Managers Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Hub Managers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalHubManagers}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-snap-coral-400 to-snap-coral-600 flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/assets/new"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-snap-teal-400 hover:bg-snap-teal-50 transition-colors duration-200 group"
              >
                <div className="h-10 w-10 rounded-lg bg-snap-teal-100 group-hover:bg-snap-teal-200 flex items-center justify-center mb-2 transition-colors">
                  <svg className="h-5 w-5 text-snap-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-snap-teal-700">New Asset</span>
              </a>
              <a
                href="/rentals"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-snap-coral-400 hover:bg-snap-coral-50 transition-colors duration-200 group"
              >
                <div className="h-10 w-10 rounded-lg bg-snap-coral-100 group-hover:bg-snap-coral-200 flex items-center justify-center mb-2 transition-colors">
                  <svg className="h-5 w-5 text-snap-coral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-snap-coral-700">New Rental</span>
              </a>
              <a
                href="/maintenance"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-snap-teal-400 hover:bg-snap-teal-50 transition-colors duration-200 group"
              >
                <div className="h-10 w-10 rounded-lg bg-snap-teal-100 group-hover:bg-snap-teal-200 flex items-center justify-center mb-2 transition-colors">
                  <svg className="h-5 w-5 text-snap-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-snap-teal-700">Maintenance</span>
              </a>
              <a
                href="/purchases"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-snap-coral-400 hover:bg-snap-coral-50 transition-colors duration-200 group"
              >
                <div className="h-10 w-10 rounded-lg bg-snap-coral-100 group-hover:bg-snap-coral-200 flex items-center justify-center mb-2 transition-colors">
                  <svg className="h-5 w-5 text-snap-coral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-snap-coral-700">Purchases</span>
              </a>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Database Connection</span>
                </div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">API Services</span>
                </div>
                <span className="text-sm text-gray-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-snap-teal-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">System Health</span>
                </div>
                <span className="text-sm text-gray-500">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


