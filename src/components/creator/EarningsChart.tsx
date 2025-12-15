'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Download } from 'lucide-react';

export default function EarningsChart() {
  const [timeRange, setTimeRange] = useState('month');
  
  const earningsData = {
    week: [450, 620, 380, 540, 720, 680, 890],
    month: [1250, 1420, 980, 1560, 1890, 2100, 2450, 1980, 2340, 2670, 2890, 3120],
    year: [12500, 14200, 15600, 18900, 23400, 26700, 28900, 31200, 35600, 38900, 41200, 45600]
  };

  const data = earningsData[timeRange as keyof typeof earningsData];
  const maxEarnings = Math.max(...data);
  
  const totalEarnings = data.reduce((sum, val) => sum + val, 0);
  const averageEarnings = Math.round(totalEarnings / data.length);
  const growthRate = 24.5; // Mock growth rate

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
              Earnings Overview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track your ALT earnings over time
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    timeRange === range
                      ? 'bg-white dark:bg-gray-800 shadow'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <button className="p-2 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold mt-2">{totalEarnings.toLocaleString()} ALT</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  ≈ ${(totalEarnings * 0.1).toFixed(2)} USD
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Per Period</p>
                <p className="text-2xl font-bold mt-2">{averageEarnings.toLocaleString()} ALT</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Per {timeRange === 'week' ? 'day' : timeRange}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                <p className="text-2xl font-bold mt-2">+{growthRate}%</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  vs previous period
                </p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="mb-6">
          <div className="flex items-end justify-between h-48">
            {data.map((value, index) => {
              const height = (value / maxEarnings) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1 mx-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-500">
                    {timeRange === 'week' 
                      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]
                      : timeRange === 'month'
                      ? index + 1
                      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="border-t dark:border-gray-700 pt-6">
          <h4 className="font-medium mb-4">Earnings Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Live Tips</p>
              <p className="text-xl font-bold mt-1">{Math.round(totalEarnings * 0.65).toLocaleString()} ALT</p>
              <p className="text-xs text-green-500">65%</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Subscriptions</p>
              <p className="text-xl font-bold mt-1">{Math.round(totalEarnings * 0.25).toLocaleString()} ALT</p>
              <p className="text-xs text-blue-500">25%</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Donations</p>
              <p className="text-xl font-bold mt-1">{Math.round(totalEarnings * 0.07).toLocaleString()} ALT</p>
              <p className="text-xs text-yellow-500">7%</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Other</p>
              <p className="text-xl font-bold mt-1">{Math.round(totalEarnings * 0.03).toLocaleString()} ALT</p>
              <p className="text-xs text-gray-500">3%</p>
            </div>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to withdraw?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You have {totalEarnings.toLocaleString()} ALT available for withdrawal
              </p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:opacity-90">
              Withdraw Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
