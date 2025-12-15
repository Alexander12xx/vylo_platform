import { Home, Compass, Video, Users, Heart, Clock, TrendingUp, Settings } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Compass, label: 'Explore', active: false },
  { icon: Video, label: 'Live Now', active: false, badge: 12 },
  { icon: Users, label: 'Following', active: false },
  { icon: Heart, label: 'Favorites', active: false },
  { icon: Clock, label: 'History', active: false },
  { icon: TrendingUp, label: 'Trending', active: false },
];

const followedStreams = [
  { name: 'GamerPro', viewers: '2.4K', category: 'Gaming' },
  { name: 'MusicLive', viewers: '1.8K', category: 'Music' },
  { name: 'CodeWithMe', viewers: '856', category: 'Programming' },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-full border-r dark:border-gray-800 bg-white dark:bg-dark-card overflow-y-auto">
      {/* Menu */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Menu
        </h3>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Followed Streams */}
      <div className="p-4 border-t dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Live Followed
        </h3>
        <div className="space-y-3">
          {followedStreams.map((stream) => (
            <div
              key={stream.name}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{stream.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stream.category}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-red-500 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  {stream.viewers}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t dark:border-gray-800">
        <button className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
          <Settings className="w-5 h-5 mr-3" />
          <span className="flex-1 text-left">Settings</span>
        </button>
      </div>
    </div>
  );
}
