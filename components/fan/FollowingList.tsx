import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function FollowingList() {
  const following = [
    { id: 1, name: 'GamerPro', category: 'Gaming', followers: 2450, status: 'live' },
    { id: 2, name: 'ArtistLife', category: 'Art', followers: 1820, status: 'offline' },
    { id: 3, name: 'MusicMaster', category: 'Music', followers: 3240, status: 'live' },
    { id: 4, name: 'TechCreator', category: 'Tech', followers: 1560, status: 'offline' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Users className="w-5 h-5 mr-2 text-purple-500" />
        Following
      </h3>
      
      <div className="space-y-3">
        {following.map((creator) => (
          <div key={creator.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                {creator.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-sm">{creator.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{creator.category}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {creator.status === 'live' ? (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1"></div>
                  <span className="text-xs text-red-500">LIVE</span>
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
              )}
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                <XCircle className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-center text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
        View All Following
      </button>
    </div>
  );
}