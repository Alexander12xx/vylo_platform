'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Gift, Users, Heart, Clock, Star, 
  TrendingUp, Compass, Bell, Share2,
  Video, MessageSquare, Award, LogOut,
  Settings, Wallet, Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function FanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    balance: 0,
    totalTips: 0,
    followingCount: 0,
    watchedHours: 0,
    badges: 3
  });
  const [activeStreams, setActiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadFanData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Get user profile
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.role !== 'fan') {
      if (userData?.role === 'creator') {
        router.push('/creator');
      } else if (userData?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/auth/login');
      }
      return;
    }

    setUser(userData);
  };

  const loadFanData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get actual user data
      const { data: userData } = await supabase
        .from('users')
        .select('alt_balance, total_spent')
        .eq('id', session.user.id)
        .single();

      // Get following count
      const { count: followingCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('fan_id', session.user.id)
        .eq('status', 'active');

      // Get active streams
      const { data: streams } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('status', 'live')
        .limit(3);

      setStats({
        balance: userData?.alt_balance || 0,
        totalTips: userData?.total_spent || 0,
        followingCount: followingCount || 0,
        watchedHours: 156, // This would come from content_views table
        badges: 3
      });

      setActiveStreams(streams || []);

    } catch (error) {
      console.error('Error loading fan data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header with Auth */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">V</span>
              </div>
              <span className="text-xl font-bold">VYLO</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span>{user?.username || 'User'}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <a href="/fan/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                  <a href="/fan/wallet" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </a>
                  <a href="/fan/security" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </a>
                  <hr className="my-1" />
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your fan dashboard UI remains the same */}
      {/* ... existing dashboard content ... */}




      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ALT Balance</p>
                <p className="text-2xl font-bold mt-2">{stats.balance.toLocaleString()} ALT</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">≈ ${(stats.balance * 0.1).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Gift className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tips</p>
                <p className="text-2xl font-bold mt-2">{stats.totalTips.toLocaleString()} ALT</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">Support given</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Following</p>
                <p className="text-2xl font-bold mt-2">{stats.followingCount}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Creators</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Watched</p>
                <p className="text-2xl font-bold mt-2">{stats.watchedHours}h</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Total watch time</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Badges</p>
                <p className="text-2xl font-bold mt-2">{stats.badges}</p>
                <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">Earned</p>
              </div>
              <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Award className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Streams */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Video className="w-5 h-5 mr-2 text-red-500" />
                    Live Now from Creators You Follow
                  </h3>
                  <a href="/live/browse" className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
                    View All →
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                {activeStreams.length > 0 ? (
                  <div className="space-y-4">
                    {activeStreams.map((stream) => (
                      <div key={stream.id} className="border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="md:flex">
                          <div className="md:w-1/3 bg-gradient-to-br from-purple-500 to-blue-500 h-48 md:h-auto relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                                  <Video className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-white font-semibold">LIVE NOW</p>
                              </div>
                            </div>
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-lg mb-2">{stream.title}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                  by {stream.creator_name} • {stream.category}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {stream.viewer_count.toLocaleString()} watching
                                  </span>
                                  <span className="flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Chat active
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
                                  <Video className="w-4 h-4 mr-2" />
                                  Watch Now
                                </button>
                                <button className="p-2 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                                  <Heart className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                      <Compass className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">No Active Streams</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      None of your followed creators are live right now.
                    </p>
                    <a
                      href="/live/browse"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 inline-block"
                    >
                      Discover New Creators
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Creators */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Recommended Creators
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Based on your watching history
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                          C{i}
                        </div>
                        <div>
                          <h5 className="font-semibold">Creator Name {i}</h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {['Gaming', 'Music', 'Art'][i-1]} • {[1245, 856, 542][i-1]} followers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="block">Live every {['Mon, Wed, Fri', 'Tue, Thu', 'Weekends'][i-1]}</span>
                          <span className="block">Avg. viewers: {[2450, 1820, 1240][i-1]}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                          Follow
                        </button>
                        <button className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-900">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <WalletBalance balance={stats.balance} />
            <FollowingList />
            <RecentTips />
            
            {/* Fan Rewards */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Fan Rewards
                  </h3>
                  <p className="text-yellow-100 text-sm mt-1">Earn badges and exclusive content</p>
                </div>
                <div className="text-2xl font-bold">Level 3</div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Top Supporter</span>
                    <span className="text-sm">Unlocked</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Early Supporter</span>
                    <span className="text-sm">75%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Community Leader</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-white text-yellow-600 font-semibold py-3 rounded-lg hover:bg-gray-100">
                View All Rewards
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    </div>
  );
}
