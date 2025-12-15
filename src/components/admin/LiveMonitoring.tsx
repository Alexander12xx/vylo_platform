'use client';

import { Play, Users, DollarSign, Eye, MoreVertical } from 'lucide-react';
import { LiveSession } from '@/lib/live-stream';

interface LiveMonitoringProps {
  sessions: LiveSession[];
}

export default function LiveMonitoring({ sessions }: LiveMonitoringProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Play className="w-5 h-5 mr-2 text-red-500" />
            Live Streams Monitoring
          </h3>
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium rounded-full">
            {sessions.length} Active
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                        {session.creator_name?.[0] || 'C'}
                      </div>
                      <div>
                        <h4 className="font-semibold">{session.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          by {session.creator_name || 'Creator'} • {session.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Viewers</p>
                          <p className="font-semibold">{session.viewer_count.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Peak</p>
                          <p className="font-semibold">{(session.viewer_count * 1.5).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Earnings</p>
                          <p className="font-semibold">{session.earnings || 0} ALT</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
                      View
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Stream health indicators */}
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">Video Quality: HD</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">Latency: 1.2s</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">Buffer Rate: 0.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium mb-2">No Active Streams</h4>
            <p className="text-gray-500 dark:text-gray-400">There are no live streams at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
