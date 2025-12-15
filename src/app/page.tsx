'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Play, Users, TrendingUp, Award, 
  Shield, Zap, Star, Globe,
  ArrowRight, Check, Video, Gift,
  Crown, Heart, Sparkles
} from 'lucide-react';
import { LiveStreamSystem } from '@/lib/live-stream';

interface FeaturedStream {
  id: string;
  title: string;
  creator: string;
  viewerCount: number;
  category: string;
  thumbnailColor: string;
}

export default function HomePage() {
  const [featuredStreams, setFeaturedStreams] = useState<FeaturedStream[]>([]);
  const [stats, setStats] = useState({
    totalStreams: 0,
    activeViewers: 0,
    creatorsEarned: 0,
    countries: 0
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const streams = await LiveStreamSystem.getActiveSessions();
      
      const featured: FeaturedStream[] = [
        {
          id: '1',
          title: '24-Hour Charity Stream',
          creator: 'GamingForGood',
          viewerCount: 12450,
          category: 'Gaming',
          thumbnailColor: 'from-red-500 to-orange-500'
        },
        {
          id: '2',
          title: 'Live Music Festival',
          creator: 'GlobalBeats',
          viewerCount: 8560,
          category: 'Music',
          thumbnailColor: 'from-blue-500 to-cyan-500'
        },
        {
          id: '3',
          title: 'Art Marathon - Digital Painting',
          creator: 'CreativeFlow',
          viewerCount: 3240,
          category: 'Art',
          thumbnailColor: 'from-green-500 to-emerald-500'
        },
      ];

      setFeaturedStreams(featured);
      setStats({
        totalStreams: 12456,
        activeViewers: 45289,
        creatorsEarned: 1250000,
        countries: 156
      });
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl mr-4 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl"></div>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                Vylo
              </h1>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Where Creators <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Earn</span> and Fans <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Engage</span>
            </h2>
            
            <p className="text-xl text-purple-200 mb-10 max-w-3xl mx-auto">
              The next-generation live streaming platform powered by ALT coins. 
              Support creators directly, join interactive communities, and experience entertainment like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/live/browse"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:opacity-90 flex items-center group"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Watching
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Join Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stats.totalStreams.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Live Streams</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.activeViewers.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Viewers</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                ${stats.creatorsEarned.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Earned by Creators</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {stats.countries}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Streams */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Live Streams</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Watch what's trending right now
              </p>
            </div>
            <Link
              href="/live/browse"
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center"
            >
              View all streams
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStreams.map((stream, index) => (
              <Link key={stream.id} href={`/live/${stream.id}`}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow group cursor-pointer">
                  <div className={`h-48 bg-gradient-to-r ${stream.thumbnailColor} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                          <span className="text-white font-semibold text-lg">LIVE NOW</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="font-bold">{stream.viewerCount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                        #{stream.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {stream.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {stream.creator[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{stream.creator}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{stream.category}</p>
                        </div>
                      </div>
                      
                      <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold">
                        Watch
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Vylo Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A simple, powerful platform for both creators and fans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">For Creators</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Go live in one click</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Earn 85% of all tips</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Build your community</span>
                </li>
              </ul>
              <Link
                href="/creator"
                className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
                Start Creating
              </Link>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">For Fans</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Watch free live streams</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Tip with ALT coins</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Interactive chat</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Earn rewards</span>
                </li>
              </ul>
              <Link
                href="/fan"
                className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
              >
                Start Watching
              </Link>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">ALT Coins</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Instant transactions</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Low fees (2.5%)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Withdraw anytime</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Secure & transparent</span>
                </li>
              </ul>
              <Link
                href="/fan/wallet"
                className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Get ALT Coins
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Vylo?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Built for the future of live streaming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Bank-level security and 2FA protection',
                color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
              },
              {
                icon: TrendingUp,
                title: 'High Earnings',
                description: 'Creators keep 85% of all revenue',
                color: 'text-green-500 bg-green-100 dark:bg-green-900/20'
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Stream to viewers in 150+ countries',
                color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20'
              },
              {
                icon: Zap,
                title: 'Low Latency',
                description: '< 1 second delay for live streams',
                color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
              },
              {
                icon: Award,
                title: 'Quality First',
                description: '4K streaming and professional tools',
                color: 'text-red-500 bg-red-100 dark:bg-red-900/20'
              },
              {
                icon: Heart,
                title: 'Community Focus',
                description: 'Built-in engagement features',
                color: 'text-pink-500 bg-pink-100 dark:bg-pink-900/20'
              },
              {
                icon: Sparkles,
                title: 'Innovative Features',
                description: 'ALT coins, NFTs, and more',
                color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/20'
              },
              {
                icon: Crown,
                title: 'Creator Support',
                description: '24/7 support and resources',
                color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20'
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to join the future of live streaming?
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Sign up today and get 100 ALT coins free!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 flex items-center"
            >
              <Star className="w-5 h-5 mr-2" />
              Join Free - Get 100 ALT
            </Link>
            <Link
              href="/live/browse"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10"
            >
              Browse Streams
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
