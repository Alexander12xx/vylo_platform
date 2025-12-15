'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, Users, Clock, Calendar, Edit, 
  Trash2, BarChart, Share2, Copy, MoreVertical 
} from 'lucide-react';
import { LiveStreamSystem } from '@/lib/live-stream';

interface Stream {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduled_start: string;
  viewer_count: number;
  earnings: number;
  thumbnail_url?: string;
}

export default function StreamManagementPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      // In a real app, fetch creator's streams from API
      const mockStreams: Stream[] = [
        {
          id: '1',
          title: 'Late Night Gaming Session',
          description: 'Playing the latest RPG with viewers',
          status: 'live',
          scheduled_start: new Date().toISOString(),
          viewer_count: 1245,
          earnings: 1250,
          thumbnail_url: '/api/placeholder/400/225'
        },
        {
          id: '2',
          title: 'Music Production Tutorial',
          description: 'Learn how to produce EDM from scratch',
          status: 'scheduled',
          scheduled_start: new Date(Date.now() + 86400000).toISOString(),
          viewer_count: 0,
          earnings: 0,
          thumbnail_url: '/api/placeholder/400/225'
        },
        {
          id: '3',
          title: 'Q&A About Content Creation',
          description: 'Answering questions about growing on Vylo',
          status: 'ended',
          scheduled_start: new Date(Date.now() - 172800000).toISOString(),
          viewer_count: 856,
          earnings: 420,
          thumbnail_url: '/api/placeholder/400/225'
        },
        {
          id: '4',
          title: 'Fitness Workout Live',
          description: 'Morning workout session with community',
          status: 'ended',
          scheduled_start: new Date(Date.now() - 259200000).toISOString(),
          viewer_count: 623,
          earnings: 310,
          thumbnail_url: '/api/placeholder/400/225'
        },
      ];
      
      setStreams(mockStreams);
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStreamSelection = (streamId: string) => {
    setSelectedStreams(prev =>
      prev.includes(streamId)
        ? prev.filter(id => id !== streamId)
        : [...prev, streamId]
    );
  };

  const deleteStream = async (streamId: string) => {
    if (confirm('Are you sure you want to delete this stream?')) {
      // Implement actual deletion
      setStreams(prev => prev.filter(s => s.id !== streamId));
    }
  };

  const duplicateStream = (streamId: string) => {
    const streamToDuplicate = streams.find(s => s.id === streamId);
    if (streamToDuplicate) {
      const duplicated = {
        ...streamToDuplicate,
        id: Math.random().toString(36).substr(2, 9),
        title: `${streamToDuplicate.title} (Copy)`,
        status: 'scheduled' as const,
        scheduled_start: new Date(Date.now() + 604800000).toISOString(),
        viewer_count: 0,
        earnings: 0
      };
      setStreams(prev => [duplicated, ...prev]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium rounded-full flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            LIVE
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
            Scheduled
          </span>
        );
      case 'ended':
        return (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full">
            Ended
          </span>
        );
      default:
        return null;
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stream Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your live streams, schedule new ones, and view analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/creator/stream/new"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Go Live Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStreams.length > 0 && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {selectedStreams.length} stream{selectedStreams.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-900">
                  Export Data
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div key={stream.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-500">
                {stream.thumbnail_url ? (
                  <img 
                    src={stream.thumbnail_url} 
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/50" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(stream.status)}
                </div>
                <div className="absolute top-4 left-4">
                  <input
                    type="checkbox"
                    checked={selectedStreams.includes(stream.id)}
                    onChange={() => toggleStreamSelection(stream.id)}
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{stream.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {stream.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
                      <Users className="w-4 h-4 mr-1" />
                    </div>
                    <p className="font-bold">{stream.viewer_count.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Viewers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                    </div>
                    <p className="font-bold">
                      {new Date(stream.scheduled_start).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                    </div>
                    <p className="font-bold">{stream.earnings} ALT</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Earnings</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {stream.status === 'live' && (
                      <Link
                        href={`/live/${stream.id}`}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Join Stream
                      </Link>
                    )}
                    {stream.status === 'scheduled' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Edit Schedule
                      </button>
                    )}
                    {stream.status === 'ended' && (
                      <Link
                        href={`/creator/stream/${stream.id}/analytics`}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 flex items-center"
                      >
                        <BarChart className="w-3 h-3 mr-1" />
                        Analytics
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => duplicateStream(stream.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/creator/stream/${stream.id}/edit`}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteStream(stream.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Stream Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-dashed dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
            <Link href="/creator/stream/new" className="block h-full">
              <div className="h-full p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Create New Stream</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Schedule a new live stream or go live immediately
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90">
                  Create Stream
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* Stream Stats Summary */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Stream Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">7</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Streams</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">124.5</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Avg. Viewers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">4,250</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total ALT Earned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">68%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Retention Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
