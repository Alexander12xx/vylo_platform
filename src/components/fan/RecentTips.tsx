'use client';

import { Heart, TrendingUp, Star, Award } from 'lucide-react';

export default function RecentTips() {
  const recentTips = [
    { id: 1, creator: 'GamerPro', amount: 100, message: 'Amazing gameplay!', time: '2 hours ago' },
    { id: 2, creator: 'MusicLive', amount: 50, message: 'Love this song!', time: '1 day ago' },
    { id: 3, creator: 'ArtStream', amount: 25, message: 'Beautiful art!', time: '2 days ago' },
    { id: 4, creator: 'TechTalk', amount: 75, message: 'Great tutorial!', time: '3 days ago' },
  ];

  const tipStats = {
    totalTips: 1250,
    thisMonth: 450,
    topCreator: 'GamerPro',
    topAmount: 500,
    streak: 7
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Recent Tips
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your support makes creators happy!
        </p>
      </div>

      <div className="p-6">
        {/* Tip Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tips</p>
                <p className="text-xl font-bold">{tipStats.totalTips} ALT</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-xl font-bold">{tipStats.thisMonth} ALT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tips List */}
        <div className="space-y-4 mb-6">
          {recentTips.map((tip) => (
            <div key={tip.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{tip.creator}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="font-bold text-red-600 dark:text-red-400">{tip.amount} ALT</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    "{tip.message}"
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {tip.time}
              </div>
            </div>
          ))}
        </div>

        {/* Top Creator */}
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-3" />
            <div>
              <p className="font-medium">Your Top Creator</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You've tipped {tipStats.topCreator} {tipStats.topAmount} ALT in total
              </p>
            </div>
          </div>
        </div>

        {/* Tipping Streak */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Tipping Streak</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {tipStats.streak} days in a row
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {tipStats.streak}
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < tipStats.streak
                    ? 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Quick Tip</p>
          <div className="flex space-x-2">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                className="flex-1 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {amount} ALT
              </button>
            ))}
          </div>
          <button className="w-full mt-3 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90">
            Send Custom Tip
          </button>
        </div>
      </div>
    </div>
  );
}
