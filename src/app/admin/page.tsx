
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // This import will now work
import { Users, Video, DollarSign, AlertTriangle, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, live: 0, revenue: 0, alerts: 0 });

  // Basic structure is preserved, but complex components are removed
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Platform overview and quick monitoring.</p>
      </div>

      {/* Stat Cards - Simple Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold mt-2">{stats.users}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Live Streams</p>
              <p className="text-2xl font-bold mt-2">{stats.live}</p>
            </div>
            <Video className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue (ALT)</p>
              <p className="text-2xl font-bold mt-2">{stats.revenue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold mt-2">{stats.alerts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Platform Activity</h3>
          <p className="text-gray-500 text-sm">Activity feed will be implemented here.</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <p className="text-gray-500 text-sm">Admin action buttons will appear here.</p>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-center">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Next Steps: Build Out Components</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              The build is now successful! You can gradually replace these placeholders with the full <strong>PlatformStats</strong>, <strong>LiveMonitoring</strong>, and other components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
