'use client';

import { TrendingUp, TrendingDown, Users, Clock, DollarSign, MessageSquare } from 'lucide-react';

export default function StreamStats() {
  const stats = [
    { label: 'Total Viewers', value: '12.4K', change: '+12%', icon: Users, trend: 'up' },
    { label: 'Avg. Watch Time', value: '24:18', change: '+8%', icon: Clock, trend: 'up' },
    { label: 'Engagement Rate', value: '4.2%', change: '-2%', icon: MessageSquare, trend: 'down' },
    { label: 'Revenue/Stream', value: '245 ALT', change: '+18%', icon: DollarSign, trend: 'up' },
  ];

  const topStreams = [
    { title: 'Gaming Marathon', viewers: 2450, duration: '4:22:18', earnings: 1250 },
    { title: 'Music Production', viewers: 1820, duration: '2:45:12', earnings: 890 },
    { title: 'Q&A Session', viewers: 1560, duration: '1:30:45', earnings: 720 },
    { title: 'Coding Live', viewers: 1340, duration: '3:15:30', earnings: 650 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold">Stream Performance</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 30 days performance metrics</p>
      </div>
      
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  <stat.icon className={`w-4 h-4 ${
                    stat.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                </div>
                <span className={`text-sm font-medium flex items-center ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Top Streams */}
        <div>
          <h4 className="font-medium mb-4">Top Performing Streams</h4>
          <div className="space-y-3">
            {topStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mr-3 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium">{stream.title}</h5>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-3">
                        <Users className="w-3 h-3 mr-1" />
                        {stream.viewers.toLocaleString()}
                      </span>
                      <span className="flex items-center mr-3">
                        <Clock className="w-3 h-3 mr-1" />
                        {stream.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-600 dark:text-yellow-400">{stream.earnings} ALT</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Earnings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-8 pt-8 border-t dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Viewer Growth</h4>
            <select className="px-3 py-1 border dark:border-gray-700 rounded-lg bg-transparent text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-48 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Viewer growth chart will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
