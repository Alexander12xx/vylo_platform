// SIMPLIFIED LIVE SESSION PAGE - TEMPORARY BUILD FIX
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Will now work
import { getLiveSession } from '@/lib/live-stream'; // Will now work
import { getBalance } from '@/lib/alt-coins'; // Will now work
import JitsiEmbed from '@/components/live/JitsiEmbed'; // Will now work
import WebRTCStream from '@/components/live/WebRTCStream'; // Will now work
import { Users, MessageSquare, Gift, Share2, Volume2 } from 'lucide-react';

export default function LiveSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [session, setSession] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Load session data
        const sessionData = await getLiveSession(sessionId);
        setSession(sessionData);
        
        // Load user balance (placeholder)
        const balanceData = await getBalance('user123');
        setBalance(balanceData.balance);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading live session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Stream */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stream Header */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {session?.title || 'Live Session'}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  42 viewers
                </span>
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">LIVE</span>
              </div>
            </div>

            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video">
                <JitsiEmbed roomName={sessionId} />
              </div>
              <div className="p-4 bg-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <Volume2 className="w-4 h-4" />
                    Audio
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
                <WebRTCStream streamId={sessionId} />
              </div>
            </div>
          </div>

          {/* Right Column - Chat & Controls */}
          <div className="space-y-4">
            {/* ALT Balance Card */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Your ALT Balance</p>
                  <p className="text-3xl font-bold mt-2">{balance.toLocaleString()} ALT</p>
                </div>
                <Gift className="w-8 h-8 opacity-80" />
              </div>
              <button className="w-full mt-4 bg-white text-yellow-600 font-semibold py-2 rounded-lg hover:bg-gray-100">
                Add ALT Coins
              </button>
            </div>

            {/* Chat Box */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow h-96 flex flex-col">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Live Chat
                </h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold text-blue-500">User{i}:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Great stream! Sending {i * 10} ALT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800"
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
