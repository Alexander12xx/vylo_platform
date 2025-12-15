'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, Video, Calendar, MapPin, Link as LinkIcon,
  Heart, Share2, Bell, BellOff, MessageSquare,
  Award, TrendingUp, Star, Crown, Gift,
  Edit, MoreVertical, Instagram, Twitter, Youtube,
  Globe, Settings
} from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  bio: string;
  role: 'creator' | 'fan';
  followers: number;
  following: number;
  totalStreams: number;
  totalHours: number;
  earnings: number;
  badges: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  isLive: boolean;
  isFollowing: boolean;
  notificationsEnabled: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState('streams');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    try {
      // Mock profile data
      const mockProfile: ProfileData = {
        id: userId,
        name: 'GamerPro',
        bio: 'Professional gamer and content creator. Streaming daily gameplay, tutorials, and community events. Love engaging with my amazing community!',
        role: 'creator',
        followers: 12450,
        following: 245,
        totalStreams: 342,
        totalHours: 1256,
        earnings: 45250,
        badges: ['top-creator', 'early-supporter', 'community-leader', 'quality-streamer'],
        socialLinks: {
          twitter: 'https://twitter.com/gamerpro',
          instagram: 'https://instagram.com/gamerpro',
          youtube: 'https://youtube.com/gamerpro',
          website: 'https://gamerpro.com'
        },
        isLive: true,
        isFollowing: true,
        notificationsEnabled: true
      };

      setProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      isFollowing: !profile.isFollowing,
      followers: profile.isFollowing ? profile.followers - 1 : profile.followers + 1
    });
  };

  const toggleNotifications = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      notificationsEnabled: !profile.notificationsEnabled
    });
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'top-creator': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'early-supporter': return <Star className="w-4 h-4 text-purple-500" />;
      case 'community-leader': return <Users className="w-4 h-4 text-blue-500" />;
      case 'quality-streamer': return <Award className="w-4 h-4 text-green-500" />;
      default: return <Award className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-gray-600 dark:text-gray-400">This user doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-purple-600">
                  {profile.name[0]}
                </div>
                {profile.isLive && (
                  <div className="absolute -bottom-2 -right-2">
                    <div className="flex items-center px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                      LIVE
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                  {profile.role === 'creator' && (
                    <span className="ml-3 px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full">
                      Creator
                    </span>
                  )}
                </div>
                
                <p className="text-purple-200 mb-4">{profile.bio}</p>
                
                {/* Stats */}
                <div className="flex items-center space-x-6 text-white">
                  <div>
                    <div className="text-2xl font-bold">{profile.followers.toLocaleString()}</div>
                    <div className="text-sm text-purple-200">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile.following.toLocaleString()}</div>
                    <div className="text-sm text-purple-200">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile.totalStreams}</div>
                    <div className="text-sm text-purple-200">Streams</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile.totalHours}h</div>
                    <div className="text-sm text-purple-200">Stream Time</div>
                  </div>
                  {profile.role === 'creator' && (
                    <div>
                      <div className="text-2xl font-bold text-yellow-300">{profile.earnings.toLocaleString()} ALT</div>
                      <div className="text-sm text-purple-200">Earnings</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleNotifications}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
                title={profile.notificationsEnabled ? 'Turn off notifications' : 'Turn on notifications'}
              >
                {profile.notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-white" />
                ) : (
                  <BellOff className="w-5 h-5 text-white" />
                )}
              </button>
              
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
              
              {profile.isFollowing ? (
                <button
                  onClick={toggleFollow}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={toggleFollow}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:opacity-90"
                >
                  Follow
                </button>
              )}
              
              {profile.isLive && (
                <a
                  href={`/live/${profile.id}`}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 flex items-center"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Watch Live
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Connect
              </h3>
              <div className="space-y-3">
                {profile.socialLinks.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                    <span>Twitter</span>
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <Instagram className="w-5 h-5 text-pink-500 mr-3" />
                    <span>Instagram</span>
                  </a>
                )}
                {profile.socialLinks.youtube && (
                  <a
                    href={profile.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <Youtube className="w-5 h-5 text-red-500 mr-3" />
                    <span>YouTube</span>
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <LinkIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Badges & Achievements
              </h3>
              <div className="space-y-3">
                {profile.badges.map((badge) => (
                  <div key={badge} className="flex items-center p-3 border dark:border-gray-700 rounded-lg">
                    {getBadgeIcon(badge)}
                    <span className="ml-3 font-medium capitalize">
                      {badge.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tip */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Support {profile.name}
              </h3>
              <p className="text-yellow-100 mb-4">
                Send ALT coins to show your appreciation
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[10, 25, 50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
                  >
                    {amount} ALT
                  </button>
                ))}
              </div>
              <button className="w-full py-3 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-gray-100">
                Send Custom Tip
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6">
              <div className="border-b dark:border-gray-700">
                <nav className="flex">
                  {['streams', 'about', 'clips', 'community'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'streams' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Recent Streams</h3>
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm">
                        View All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="border dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="h-40 bg-gradient-to-br from-purple-500 to-blue-500"></div>
                          <div className="p-4">
                            <h4 className="font-semibold mb-2">Stream Title {i}</h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>2 days ago</span>
                              <span className="mx-2">•</span>
                              <Users className="w-3 h-3 mr-1" />
                              <span>{[1245, 856, 452, 789, 324, 567][i-1]}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-yellow-600">{[1250, 850, 420, 750, 320, 560][i-1]} ALT</span>
                              <button className="px-3 py-1 text-sm border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                                Watch
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">About Me</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.bio}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <h5 className="font-medium mb-2">Stream Schedule</h5>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li>Mon, Wed, Fri: 7 PM - 10 PM EST</li>
                          <li>Saturday: 2 PM - 6 PM EST</li>
                          <li>Special events announced on Twitter</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <h5 className="font-medium mb-2">Preferred Games</h5>
                        <div className="flex flex-wrap gap-2">
                          {['Valorant', 'CS2', 'Apex Legends', 'Fortnite'].map((game) => (
                            <span key={game} className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm">
                              {game}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'community' && (
                  <div>
                    <h4 className="font-semibold mb-6">Community Highlights</h4>
                    <div className="space-y-4">
                      <div className="p-4 border dark:border-gray-700 rounded-lg">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3"></div>
                          <div>
                            <p className="font-semibold">Top Supporter This Month</p>
                            <p className="text-sm text-gray-500">Sent 1,250 ALT</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border dark:border-gray-700 rounded-lg">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                          <div>
                            <p className="font-semibold">Most Engaged Viewer</p>
                            <p className="text-sm text-gray-500">Sent 342 messages this month</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-6">Performance Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">+24%</p>
                  <p className="text-sm text-gray-500">Viewer Growth</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-gray-500">Retention Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">1.2K</p>
                  <p className="text-sm text-gray-500">Avg. Messages</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-gray-500">Avg. Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
