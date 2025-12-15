'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    activeStreams: number;
    totalRevenue: number;
    systemAlerts: number;
    altCirculation: number;
    dailyVolume: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const growthMetrics = [
    { label: 'User Growth', value: '+12.5%', trend: 'up' },
    { label: 'Revenue Growth', value: '+24.3%', trend: 'up' },
    { label: 'Stream Growth', value: '+8.2%', trend: 'up' },
    { label: 'ALT Volume', value: '+45.7%', trend: 'up' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Growth Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {growthMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.label}
              </span>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold mt-2">{metric.value}</p>
          </div>
        ))}
      </div>
      
      {/* Platform Health */}
      <div className="mt-6 pt-6 border-t dark:border-gray-700">
        <h4 className="font-medium mb-3">Platform Health</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Server Uptime</span>
              <span className="text-sm font-medium">99.8%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">API Response Time</span>
              <span className="text-sm font-medium">127ms</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Database Load</span>
              <span className="text-sm font-medium">42%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
