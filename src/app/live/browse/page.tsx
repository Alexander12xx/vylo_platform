'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, TrendingUp, Users, 
  Clock, Star, Crown, Heart, 
  Video, Music, GamepadIcon as Gamepad, 
  Palette, Code, Dumbbell, Mic
} from 'lucide-react';
import { LiveStreamSystem } from '@/lib/live-stream';

interface Stream {
  id: string;
  title: string;
  creator: string;
  category: string;
  viewerCount: number;
  thumbnailUrl?: string;
  isLive: boolean;
  tags: string[];
  duration?: string;
  earnings: number;
}

export default function BrowseStreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('viewers');

  const categories = [
    { id: 'all', name: 'All', icon: TrendingUp, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad, color: 'bg-gradient-to-r from-red-500 to-orange-500' },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'art', name: 'Art', icon: Palette, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'tech', name: 'Tech', icon: Code, color: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 'talk', name: 'Talk', icon: Mic, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  ];

  useEffect(() => {
    loadStreams();
  }, []);

  useEffect(() => {
    filterAndSortStreams();
  }, [searchQuery, selectedCategory, sortBy, streams]);

  const loadStreams = async () => {
    try {
      const activeSessions = await LiveStreamSystem.getActiveSessions();
      
      const mockStreams: Stream[] = [
        {
          id: '1',
          title: 'Epic Gaming Marathon - 24 Hour Stream!',
          creator: 'GamerPro',
          category: 'gaming',
          viewerCount: 2450,
          isLive: true,
          tags: ['FPS', 'Competitive', 'English'],
          earnings: 1250
        },
        {
          id: '2',
          title: 'Live Music Production Session',
          creator: 'MusicLive',
          category: 'music',
          viewerCount: 1820,
          isLive: true,
          tags: ['EDM', 'Production', 'Ableton'],
          earnings: 890
        },
        {
          id: '3',
          title: 'Digital Art Creation - Commission Work',
          creator: 'ArtStream',
          category: 'art',
          viewerCount: 856,
          isLive: true,
          tags: ['Digital', 'Photoshop', 'Tutorial'],
          earnings: 420
        },
        {
          id: '4',
          title: 'Coding Live - Building a Next.js App',
          creator: 'TechTalk',
          category: 'tech',
          viewerCount: 1240,
          isLive: true,
          tags: ['Programming', 'Web Dev', 'React'],
          earnings: 750
        },
        {
          id: '5',
          title: 'Morning Workout Session',
          creator: 'FitnessFlow',
          category: 'fitness',
          viewerCount: 623,
          isLive: true,
          tags: ['Workout', 'Yoga', 'Health'],
          earnings: 310
        },
        {
          id: '6',
          title: 'Podcast Recording Live',
          creator: 'TalkShow',
          category: 'talk',
          viewerCount: 452,
          isLive: true,
          tags: ['Discussion', 'News', 'Community'],
          earnings: 220
        },
        {
          id: '7',
          title: 'Speedrun Challenge - Any%',
          creator: 'SpeedRunner',
          category: 'gaming',
          viewerCount: 789,
          isLive: true,
          tags: ['Speedrun', 'Challenge', 'Retro'],
          earnings: 450
        },
        {
          id: '8',
          title: 'DJ Set - Friday Night Mix',
          creator: 'DJVibes',
          category: 'music',
          viewerCount: 1340,
          isLive: true,
          tags: ['DJ', 'Mix', 'Party'],
          earnings: 680
        },
      ];

      setStreams(mockStreams);
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStreams = () => {
    let filtered = [...streams];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(stream =>
        stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(stream => stream.category === selectedCategory);
    }

    // Sort streams
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'viewers':
          return b.viewerCount - a.viewerCount;
        case 'earnings':
          return b.earnings - a.earnings;
        case 'newest':
          // Implement date-based sorting if available
          return 0;
        default:
          return b.viewerCount - a.viewerCount;
      }
    });

    setFilteredStreams(filtered);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || TrendingUp;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'bg-gradient-to-r from-purple-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Live Streams</h1>
            <p className="text-xl text-purple-200 mb-8">
              Watch, engage, and support creators from around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search streams, creators, or categories..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button className="p-2 hover:bg-white/10 rounded-lg">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                    selectedCategory === category.id
                      ? 'bg-white dark:bg-gray-800 shadow-lg transform scale-105'
                      : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${category.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort & Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory === 'all' ? 'All Streams' : 
             categories.find(c => c.id === selectedCategory)?.name + ' Streams'}
            <span className="text-gray-500 dark:text-gray-400 text-lg ml-2">
              ({filteredStreams.length} live)
            </span>
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none"
            >
              <option value="viewers">Most Viewers</option>
              <option value="earnings">Top Earnings</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Streams Grid */}
        {filteredStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStreams.map((stream) => {
              const CategoryIcon = getCategoryIcon(stream.category);
              const categoryColor = getCategoryColor(stream.category);
              
              return (
                <Link key={stream.id} href={`/live/${stream.id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                    {/* Thumbnail */}
                    <div className="relative h-48">
                      <div className={`absolute inset-0 ${categoryColor} flex items-center justify-center`}>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-white font-semibold">LIVE NOW</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Viewer Count */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                          <Users className="w-3 h-3 mr-2" />
                          {stream.viewerCount.toLocaleString()}
                        </div>
                      </div>
                      
                      {/* Category */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                          <CategoryIcon className="w-3 h-3 mr-2" />
                          {stream.category}
                        </div>
                      </div>
                      
                      {/* Earnings */}
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                          <Star className="w-3 h-3 mr-1" />
                          {stream.earnings} ALT
                        </div>
                      </div>
                    </div>

                    {/* Stream Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {stream.title}
                      </h3>
                      
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {stream.creator[0]}
                        </div>
                        <div>
                          <p className="font-medium">{stream.creator}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            <span className="capitalize">{stream.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {stream.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {stream.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-500 text-xs rounded">
                            +{stream.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{stream.viewerCount.toLocaleString()} viewers</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          <span className="font-semibold">{stream.earnings} ALT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No streams found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : `No ${selectedCategory !== 'all' ? selectedCategory : ''} streams are currently live.`
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Recommended Section */}
        {filteredStreams.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Crown className="w-6 h-6 text-yellow-500 mr-2" />
              Recommended For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      R{i}
                    </div>
                    <div>
                      <h4 className="font-bold">Trending Creator</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Based on your viewing history
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Check out these creators similar to what you've been watching.
                  </p>
                  <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                    Discover More
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
