'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  Video, Users, MessageSquare, Heart, Share2, 
  Volume2, VolumeX, Maximize, Settings, Gift,
  Flag, MoreVertical, Crown, Star, Award
} from 'lucide-react';
import { LiveStreamSystem } from '@/lib/live-stream';
import { ALTSystem } from '@/lib/alt-coins';
import VideoPlayer from '@/components/live/VideoPlayer';
import Chat from '@/components/live/Chat';
import TipButton from '@/components/live/TipButton';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isCreator: boolean;
  isModerator: boolean;
}

interface Viewer {
  id: string;
  name: string;
  isSubscriber: boolean;
  tipAmount: number;
}

export default function LiveStreamPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [stream, setStream] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [loading, setLoading] = useState(true);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStreamData();
    simulateLiveData();
  }, [sessionId]);

  const loadStreamData = async () => {
    try {
      // Load stream data
      const session = await LiveStreamSystem.getLiveSession(sessionId);
      setStream(session);

      // Load user balance
      const balanceData = await ALTSystem.getBalance('user123');
      setBalance(balanceData);

      // Mock chat messages
      const mockMessages: Message[] = [
        { id: '1', user: 'Streamer', text: 'Welcome everyone to the stream!', timestamp: '2:30 PM', isCreator: true, isModerator: true },
        { id: '2', user: 'Viewer123', text: 'Great content as always!', timestamp: '2:31 PM', isCreator: false, isModerator: false },
        { id: '3', user: 'Moderator', text: 'Please keep chat friendly everyone', timestamp: '2:32 PM', isCreator: false, isModerator: true },
        { id: '4', user: 'Supporter', text: 'Just sent 100 ALT!', timestamp: '2:33 PM', isCreator: false, isModerator: false },
        { id: '5', user: 'Streamer', text: 'Thank you for the support!', timestamp: '2:34 PM', isCreator: true, isModerator: true },
      ];
      setMessages(mockMessages);

      // Mock viewers
      const mockViewers: Viewer[] = [
        { id: '1', name: 'GamerFan', isSubscriber: true, tipAmount: 500 },
        { id: '2', name: 'MusicLover', isSubscriber: false, tipAmount: 100 },
        { id: '3', name: 'ArtEnthusiast', isSubscriber: true, tipAmount: 250 },
        { id: '4', name: 'TechGeek', isSubscriber: false, tipAmount: 50 },
        { id: '5', name: 'FitnessBuddy', isSubscriber: true, tipAmount: 750 },
      ];
      setViewers(mockViewers);

    } catch (error) {
      console.error('Error loading stream:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateLiveData = () => {
    // Simulate new messages
    const messageInterval = setInterval(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: ['Viewer' + Math.floor(Math.random() * 1000), 'Fan' + Math.floor(Math.random() * 500)][Math.floor(Math.random() * 2)],
        text: ['Great stream!', 'LOL', 'What game is this?', 'Can you explain that?', 'Awesome!'][Math.floor(Math.random() * 5)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCreator: false,
        isModerator: false
      };
      setMessages(prev => [...prev.slice(-50), newMessage]);
    }, 5000);

    // Simulate viewer count changes
    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const updated = [...prev];
        if (Math.random() > 0.7 && updated.length < 10) {
          updated.push({
            id: Date.now().toString(),
            name: 'NewViewer' + Math.floor(Math.random() * 1000),
            isSubscriber: Math.random() > 0.5,
            tipAmount: 0
          });
        }
        return updated.slice(-10);
      });
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(viewerInterval);
    };
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: 'You',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCreator: false,
      isModerator: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    messageInputRef.current?.focus();

    // Scroll to bottom
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleTip = async (amount: number) => {
    try {
      // In real app: await ALTSystem.tipCreator(userId, stream.creator_id, amount, sessionId);
      const tipMessage: Message = {
        id: Date.now().toString(),
        user: 'You',
        text: `💎 Tipped ${amount} ALT!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCreator: false,
        isModerator: false
      };
      
      setMessages(prev => [...prev, tipMessage]);
      setBalance(prev => prev - amount);
      
      // Show notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      notification.innerHTML = `🎉 You tipped ${amount} ALT to ${stream?.creator_name || 'the streamer'}!`;
      document.body.appendChild(notification);
      
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Error sending tip:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white">Loading live stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Stream Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="font-semibold">LIVE</span>
              </div>
              <h1 className="text-xl font-bold truncate">{stream?.title || 'Live Stream'}</h1>
              <div className="hidden md:flex items-center text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                <span>{(stream?.viewer_count || 0).toLocaleString()} watching</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 font-semibold">
                Follow
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player - Left Column */}
          <div className="lg:col-span-3">
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
              <VideoPlayer streamUrl={stream?.stream_url} />
              
              {/* Player Controls */}
              <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-white/10 rounded-full"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="text-sm">
                      <span className="text-gray-400">Quality: </span>
                      <span className="font-medium">Auto (1080p)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-white/10 rounded-full">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white/10 rounded-full"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {stream?.creator_name?.[0] || 'C'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{stream?.creator_name || 'Creator'}</h2>
                    <p className="text-gray-400">{stream?.category || 'Streaming'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Subscribe
                  </button>
                  <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Notify
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Stream Earnings</p>
                  <p className="text-2xl font-bold text-yellow-400">{stream?.earnings || 0} ALT</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Peak Viewers</p>
                  <p className="text-2xl font-bold">{(stream?.viewer_count * 1.5).toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-2xl font-bold">2:15:42</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Chat Messages</p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
              </div>

              {/* Stream Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About this stream</h3>
                <p className="text-gray-300">
                  {stream?.description || 'Join us for an exciting live stream with interactive chat and community engagement.'}
                </p>
              </div>

              {/* Quick Tips */}
              <div>
                <h3 className="font-semibold mb-3">Quick Tips</h3>
                <div className="flex flex-wrap gap-2">
                  {[10, 25, 50, 100, 250, 500].map((amount) => (
                    <TipButton
                      key={amount}
                      amount={amount}
                      onClick={() => handleTip(amount)}
                      disabled={balance < amount}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat & Info */}
          <div className="space-y-6">
            {/* Chat */}
            <Chat
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              chatContainerRef={chatContainerRef}
              messageInputRef={messageInputRef}
            />

            {/* Viewer List */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Viewers ({viewers.length})
                </h3>
                <span className="text-sm text-gray-400">Top Supporters</span>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        viewer.isSubscriber ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium">{viewer.name}</span>
                      {viewer.isSubscriber && (
                        <Crown className="w-3 h-3 text-yellow-500 ml-1" />
                      )}
                    </div>
                    {viewer.tipAmount > 0 && (
                      <div className="flex items-center text-yellow-400 text-sm">
                        <Star className="w-3 h-3 mr-1" />
                        {viewer.tipAmount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ALT Balance</span>
                  <span className="font-bold text-yellow-400">{balance} ALT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Time Watched</span>
                  <span className="font-bold">45 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Messages Sent</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tips Given</span>
                  <span className="font-bold text-green-400">150 ALT</span>
                </div>
              </div>
            </div>

            {/* Stream Actions */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Stream Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex flex-col items-center">
                  <Gift className="w-5 h-5 mb-1" />
                  <span className="text-sm">Send Gift</span>
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex flex-col items-center">
                  <Award className="w-5 h-5 mb-1" />
                  <span className="text-sm">Badges</span>
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex flex-col items-center">
                  <Share2 className="w-5 h-5 mb-1" />
                  <span className="text-sm">Share</span>
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex flex-col items-center">
                  <Flag className="w-5 h-5 mb-1" />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
