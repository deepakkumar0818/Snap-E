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
  const [loading, setLoading] = useState(false);

  // Use dummy data immediately - no API calls needed for demo
  // If you want to use real API data, uncomment the useEffect below
  useEffect(() => {
    // Set dummy data immediately
    setStats(dummyStats);
    setLoading(false);
    
    // Optional: Fetch real data in the background (commented out for performance)
    // const fetchStats = async () => {
    //   try {
    //     const [assetsRes, rentalsRes, maintenanceRes, purchasesRes, driversRes, hubManagersRes] = await Promise.all([
    //       fetch('/api/assets'),
    //       fetch('/api/rentals?status=ACTIVE'),
    //       fetch('/api/maintenance?status=PENDING'),
    //       fetch('/api/purchases?status=PENDING'),
    //       fetch('/api/drivers'),
    //       fetch('/api/hub-managers'),
    //     ]);
    //     // Process API responses if needed
    //   } catch (error) {
    //     console.error('Error fetching stats:', error);
    //   }
    // };
    // fetchStats();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-lg text-gray-400">
          Welcome to Snap-e Cabs Rental Management System
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Assets Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-snap-teal-500/20 hover:border-snap-teal-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Total Assets</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.totalAssets}
                </p>
                <p className="text-xs text-gray-400">Vehicles in fleet</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-snap-teal-500 to-snap-teal-600 flex items-center justify-center shadow-lg shadow-snap-teal-500/50">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Rentals Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Active Rentals</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.activeRentals}
                </p>
                <p className="text-xs text-gray-400">Currently rented</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Maintenance Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-amber-500/20 hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Pending Maintenance</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.pendingMaintenance}
                </p>
                <p className="text-xs text-gray-400">Awaiting service</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Requests Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Purchase Requests</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.purchaseRequests}
                </p>
                <p className="text-xs text-gray-400">Pending approval</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Total Drivers</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.totalDrivers}
                </p>
                <p className="text-xs text-gray-400">Registered drivers</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hub Managers Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-snap-coral-500/20 hover:border-snap-coral-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Hub Managers</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.totalHubManagers}
                </p>
                <p className="text-xs text-gray-400">Active managers</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-snap-coral-500 to-snap-coral-600 flex items-center justify-center shadow-lg shadow-snap-coral-500/50">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <p className="text-sm text-gray-400 mt-1">Access frequently used features</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/assets/new"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-snap-teal-500 hover:bg-gradient-to-br hover:from-snap-teal-500/10 hover:to-transparent transition-all duration-200 group transform hover:scale-105"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-snap-teal-500 to-snap-teal-600 group-hover:shadow-lg shadow-snap-teal-500/50 flex items-center justify-center mb-3 transition-all">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-snap-teal-400">New Asset</span>
              </a>
              <a
                href="/rentals"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-transparent transition-all duration-200 group transform hover:scale-105"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-lg shadow-blue-500/50 flex items-center justify-center mb-3 transition-all">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-blue-400">New Rental</span>
              </a>
              <a
                href="/maintenance"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-transparent transition-all duration-200 group transform hover:scale-105"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 group-hover:shadow-lg shadow-amber-500/50 flex items-center justify-center mb-3 transition-all">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-amber-400">Maintenance</span>
              </a>
              <a
                href="/purchases"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-transparent transition-all duration-200 group transform hover:scale-105"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:shadow-lg shadow-purple-500/50 flex items-center justify-center mb-3 transition-all">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-purple-400">Purchases</span>
              </a>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">System Status</h2>
            <p className="text-sm text-gray-400 mt-1">Monitor system health</p>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-4 animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-sm font-semibold text-gray-300">Database Connection</span>
                </div>
                <span className="text-sm font-bold text-green-400">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-4 animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-sm font-semibold text-gray-300">API Services</span>
                </div>
                <span className="text-sm font-bold text-green-400">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-snap-teal-500/10 rounded-lg border border-snap-teal-500/30">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-snap-teal-500 mr-4 shadow-lg shadow-snap-teal-500/50"></div>
                  <span className="text-sm font-semibold text-gray-300">System Health</span>
                </div>
                <span className="text-sm font-bold text-snap-teal-400">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


