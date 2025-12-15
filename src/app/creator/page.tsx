'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth-utils'; // Import the helper

export default function FanDashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({ balance: 0 /* ... */ });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFanData();
  }, []);

  const loadFanData = async () => {
    try {
      // 1. GET THE AUTHENTICATED USER
      const { profile } = await getCurrentUser();
      setUserProfile(profile);
      
      // 2. USE THE REAL USER ID
      const userId = profile.id;
      
      const [balance, streams] = await Promise.all([
        ALTSystem.getBalance(userId), // Now using real ID
        LiveStreamSystem.getActiveSessions()
      ]);
      
      // ... rest of your loading logic
      
    } catch (error) {
      console.error('Error:', error);
      // getCurrentUser() will have already redirected on auth failure
    } finally {
      setLoading(false);
    }
  };
  

'use client';

import { useEffect, useState } from 'react';
import { 
  Video, DollarSign, Users, TrendingUp, 
  Calendar, Upload, BarChart, Settings,
  Bell, Share2, Eye, Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LiveStreamSystem } from '@/lib/live-stream';
import { ALTSystem } from '@/lib/alt-coins';
import StreamStats from '@/components/creator/StreamStats';
import EarningsChart from '@/components/creator/EarningsChart';
import ScheduleStream from '@/components/creator/ScheduleStream';
import UploadContent from '@/components/creator/UploadContent';

export default function CreatorDashboard() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    currentBalance: 0,
    totalFollowers: 0,
    avgViewers: 0,
    totalStreams: 0,
    upcomingStreams: 0
  });
  const [recentStreams, setRecentStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreatorData();
  }, []);

  const loadCreatorData = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const userId = user.data.user.id;

      // Load creator stats
      const [balance, streams] = await Promise.all([
        ALTSystem.getBalance(userId),
        LiveStreamSystem.getLiveSessions()
      ]);

      // Filter creator's streams
      const creatorStreams = streams.filter(s => s.creator_id === userId);
      const activeStreams = creatorStreams.filter(s => s.status === 'live');
      const upcomingStreams = creatorStreams.filter(s => s.status === 'scheduled');
      
      const totalEarnings = creatorStreams.reduce((sum, stream) => sum + (stream.earnings || 0), 0);
      const avgViewers = creatorStreams.length > 0 
        ? Math.round(creatorStreams.reduce((sum, stream) => sum + stream.viewer_count, 0) / creatorStreams.length)
        : 0;

      setStats({
        totalEarnings,
        currentBalance: balance,
        totalFollowers: Math.floor(Math.random() * 1000) + 500, // Mock data
        avgViewers,
        totalStreams: creatorStreams.length,
        upcomingStreams: upcomingStreams.length
      });

      setRecentStreams(creatorStreams.slice(0, 5));

    } catch (error) {
      console.error('Error loading creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading creator dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Creator Dashboard</h1>
              <p className="text-purple-200 mt-2">Manage your streams, earnings, and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </button>
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold mt-2">{stats.totalEarnings.toLocaleString()} ALT</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">≈ ${(stats.totalEarnings * 0.1).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold mt-2">{stats.currentBalance.toLocaleString()} ALT</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Available to withdraw</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Followers</p>
                <p className="text-2xl font-bold mt-2">{stats.totalFollowers.toLocaleString()}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">+42 this week</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Viewers</p>
                <p className="text-2xl font-bold mt-2">{stats.avgViewers.toLocaleString()}</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Per stream</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <EarningsChart />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Recent Streams
                  </h3>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    Go Live
                  </button>
                </div>
              </div>
              <div className="p-6">
                {recentStreams.length > 0 ? (
                  <div className="space-y-4">
                    {recentStreams.map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            stream.status === 'live' ? 'bg-red-500 animate-pulse' :
                            stream.status === 'ended' ? 'bg-gray-500' : 'bg-yellow-500'
                          }`}></div>
                          <div>
                            <h4 className="font-medium">{stream.title}</h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(stream.created_at).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              <Users className="w-3 h-3 mr-1" />
                              {stream.viewer_count} viewers
                              <span className="mx-2">•</span>
                              <DollarSign className="w-3 h-3 mr-1" />
                              {stream.earnings || 0} ALT
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-sm border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                            View
                          </button>
                          <button className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800">
                            Analytics
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">No Streams Yet</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Start your first live stream to engage with your audience.</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90">
                      Start Your First Stream
                    </button>
                  </div>
                )}
              </div>
            </div>

            <StreamStats />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <ScheduleStream />
            <UploadContent />
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="flex items-center">
                    <Share2 className="w-5 h-5 text-blue-500 mr-3" />
                    <span>Share Profile</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="flex items-center">
                    <BarChart className="w-5 h-5 text-green-500 mr-3" />
                    <span>View Analytics</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                    <span>Schedule Stream</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="flex items-center">
                    <Upload className="w-5 h-5 text-yellow-500 mr-3" />
                    <span>Upload Content</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Live Q&A Session</span>
                    <span className="text-sm text-gray-500">Tomorrow</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3:00 PM - 4:30 PM</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Gaming Tournament</span>
                    <span className="text-sm text-gray-500">Friday</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">7:00 PM - 10:00 PM</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Creator Workshop</span>
                    <span className="text-sm text-gray-500">Next Week</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn monetization strategies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
