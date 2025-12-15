'use client';

import { Users, Video, Bell, BellOff, MoreVertical } from 'lucide-react';

export default function FollowingList() {
  const following = [
    { id: 1, name: 'GamerPro', category: 'Gaming', isLive: true, viewers: 2450, notifications: true },
    { id: 2, name: 'MusicLive', category: 'Music', isLive: false, viewers: 0, notifications: true },
    { id: 3, name: 'ArtStream', category: 'Art', isLive: true, viewers: 856, notifications: false },
    { id: 4, name: 'TechTalk', category: 'Technology', isLive: false, viewers: 0, notifications: true },
    { id: 5, name: 'FitnessFlow', category: 'Fitness', isLive: true, viewers: 1240, notifications: true },
  ];

  const toggleNotifications = (creatorId: number) => {
    // Implement notification toggle
    console.log('Toggle notifications for creator:', creatorId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Following ({following.length})
          </h3>
          <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
            Manage All
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {following.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
              <div className="flex items-center flex-1">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {creator.name[0]}
                  </div>
                  {creator.isLive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h4 className="font-semibold truncate">{creator.name}</h4>
                    {creator.isLive && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{creator.category}</span>
                    {creator.isLive && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {creator.viewers.toLocaleString()} watching
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {creator.isLive ? (
                  <a
                    href={`/live/stream-${creator.id}`}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <Video className="w-3 h-3 mr-1" />
                    Watch
                  </a>
                ) : (
                  <button className="px-3 py-1.5 border dark:border-gray-700 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                    View
                  </button>
                )}
                
                <button
                  onClick={() => toggleNotifications(creator.id)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title={creator.notifications ? 'Turn off notifications' : 'Turn on notifications'}
                >
                  {creator.notifications ? (
                    <Bell className="w-4 h-4 text-purple-500" />
                  ) : (
                    <BellOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <h4 className="font-medium mb-4">Suggestions for You</h4>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 flex items-center justify-center text-white text-sm">
                    S{i}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Suggested Creator {i}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {['Similar to GamerPro', 'Trending in Music'][i-1]}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Following Stats */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{following.filter(c => c.isLive).length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Live Now</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {following.reduce((sum, c) => sum + c.viewers, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Viewers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
