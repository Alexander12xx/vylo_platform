'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  Shield, 
  Maximize2, 
  Minimize2,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  Heart,
  Gift,
  Flag,
  Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LiveStreamSystem } from '@/lib/live-stream'
import { AltCoinsSystem } from '@/lib/alt-coins'
import JitsiEmbed from '@/components/live/JitsiEmbed'
import WebRTCStream from '@/components/live/WebRTCStream'
import LiveChat from '@/components/live/LiveChat'
import LiveAdminPanel from '@/components/live/LiveAdminPanel'

export default function LiveStreamPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const sessionId = params.sessionId as string
  
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [viewers, setViewers] = useState<any[]>([])
  const [streamType, setStreamType] = useState<'jitsi' | 'webrtc'>('jitsi')
  const [isLoading, setIsLoading] = useState(true)

  const chatRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    checkAccess()
    loadSession()
    subscribeToUpdates()
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Fullscreen change listener
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      leaveStream()
    }
  }, [sessionId])

  const checkAccess = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      window.location.href = `/login?redirect=/live/${sessionId}`
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setUser(userData)
    setIsAdmin(userData?.role === 'admin')

    // Admin has free access
    if (userData?.role === 'admin') {
      setHasAccess(true)
      return
    }

    // Check if user already paid or has subscription
    const { data: viewer } = await supabase
      .from('live_viewers')
      .select('*')
      .eq('live_session_id', sessionId)
      .eq('user_id', authUser.id)
      .is('left_at', null)
      .single()

    if (viewer) {
      setHasAccess(true)
    } else {
      // Try to join
      try {
        await LiveStreamSystem.joinLiveStream(sessionId, authUser.id)
        setHasAccess(true)
      } catch (error: any) {
        alert(`Access denied: ${error.message}`)
        window.location.href = '/fan/live'
      }
    }
  }

  const loadSession = async () => {
    const { data } = await supabase
      .from('live_sessions')
      .select(`
        *,
        users!live_sessions_creator_id_fkey (
          username,
          profile_image,
          verification_status
        )
      `)
      .eq('id', sessionId)
      .single()

    setSession(data)
    
    // Determine stream type based on viewer count
    if (data?.current_viewers > 10) {
      setStreamType('jitsi')
    } else {
      setStreamType('webrtc')
    }

    // Load messages
    loadMessages()
    // Load viewers
    loadViewers()

    setIsLoading(false)
  }

  const subscribeToUpdates = () => {
    const channels = [
      // Session updates
      supabase.channel(`live-session-${sessionId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_sessions',
          filter: `id=eq.${sessionId}`
        }, (payload) => {
          setSession(payload.new)
        })
        .subscribe(),

      // New messages
      supabase.channel(`live-messages-${sessionId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `metadata->>live_session_id=eq.${sessionId}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new])
          scrollToBottom()
        })
        .subscribe(),

      // Viewer updates
      supabase.channel(`live-viewers-${sessionId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'live_viewers',
          filter: `live_session_id=eq.${sessionId}`
        }, () => {
          loadViewers()
        })
        .subscribe()
    ]

    return () => channels.forEach(ch => supabase.removeChannel(ch))
  }

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        users!messages_sender_id_fkey (
          username,
          profile_image,
          role
        )
      `)
      .eq('metadata->>live_session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(100)

    if (data) {
      setMessages(data)
      scrollToBottom()
    }
  }

  const loadViewers = async () => {
    const { data } = await supabase
      .from('live_viewers')
      .select(`
        *,
        users!live_viewers_user_id_fkey (
          username,
          profile_image,
          role
        )
      `)
      .eq('live_session_id', sessionId)
      .is('left_at', null)

    if (data) {
      setViewers(data)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    const message = {
      sender_id: user.id,
      receiver_id: session.creator_id,
      content: newMessage,
      metadata: {
        live_session_id: sessionId,
        is_live_chat: true
      }
    }

    const { error } = await supabase
      .from('messages')
      .insert([message])

    if (!error) {
      setNewMessage('')
    }
  }

  const sendTip = async (amount: number) => {
    if (!user || amount > user.alt_balance) {
      alert('Insufficient ALT balance')
      return
    }

    try {
      await AltCoinsSystem.payForContent(user.id, sessionId, session.creator_id)
      
      // Send tip message
      await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: session.creator_id,
          content: `Sent a tip of ${amount} ALT! 🎉`,
          alt_paid: amount,
          is_system_message: true,
          metadata: {
            live_session_id: sessionId,
            is_tip: true,
            amount
          }
        }])

      alert('Tip sent successfully!')
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const reportStream = async () => {
    const reason = prompt('Please describe the issue:')
    if (!reason) return

    await supabase
      .from('content')
      .insert([{
        creator_id: session.creator_id,
        content_type: 'video',
        caption: `Live stream report: ${session.title}`,
        visibility: 'free',
        status: 'flagged',
        metadata: {
          is_report: true,
          live_session_id: sessionId,
          reason,
          reported_by: user.id,
          reported_at: new Date().toISOString()
        }
      }])

    alert('Report submitted. Admin will review shortly.')
  }

  const leaveStream = async () => {
    if (user && session) {
      await LiveStreamSystem.leaveLiveStream(sessionId, user.id)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading live stream...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to view this live stream
          </p>
          <button
            onClick={() => window.location.href = '/fan/live'}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Browse Other Streams
          </button>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Stream Not Found</h1>
          <p className="text-gray-400">This live stream may have ended or been removed</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Admin Panel */}
      {isAdmin && (
        <LiveAdminPanel 
          session={session} 
          userId={user?.id}
          onTerminate={leaveStream}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Stream - 3/4 width */}
          <div className="lg:col-span-3">
            <div className="bg-dark-card rounded-xl overflow-hidden shadow-2xl">
              {/* Stream Header */}
              <div className="p-4 border-b border-dark-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    {session.users?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h1 className="font-bold text-lg">{session.title}</h1>
                      {session.users?.verification_status === 'verified' && (
                        <span className="ml-2 px-2 py-1 bg-blue-500 text-xs rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {session.users?.username} • Live now
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Viewer Count */}
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold">{session.current_viewers}</span>
                    <span className="text-gray-400 text-sm">viewers</span>
                  </div>

                  {/* Earnings */}
                  {session.alt_price > 0 && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">{session.total_earnings}</span>
                      <span className="text-gray-400 text-sm">ALT</span>
                    </div>
                  )}

                  {/* Stream Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-5 h-5" />
                      ) : (
                        <Maximize2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Stream */}
              <div className="relative bg-black aspect-video">
                {streamType === 'jitsi' ? (
                  <JitsiEmbed
                    roomId={session.jitsi_room_id}
                    user={user}
                    isAdmin={isAdmin}
                  />
                ) : (
                  <WebRTCStream
                    sessionId={sessionId}
                    user={user}
                    videoRef={videoRef}
                  />
                )}

                {/* Live Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="font-semibold">LIVE</span>
                  </div>
                </div>

                {/* Tip Button */}
                {!isAdmin && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => sendTip(100)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Gift className="w-4 h-4 inline mr-2" />
                      Tip 100 ALT
                    </button>
                  </div>
                )}

                {/* Report Button */}
                {!isAdmin && (
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={reportStream}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      title="Report Stream"
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Stream Info */}
              <div className="p-4">
                <p className="text-gray-300">{session.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
                      <Share className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Started {new Date(session.start_time).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[50, 100, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => sendTip(amount)}
                  className="p-4 bg-dark-card hover:bg-dark-border rounded-lg border border-dark-border transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{amount} ALT</span>
                    <Gift className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Send a tip!
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Sidebar - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-xl shadow-2xl h-[calc(100vh-8rem)] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-dark-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <h3 className="font-semibold">Live Chat</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>{viewers.length}</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                ref={chatRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.is_system_message
                        ? 'bg-blue-900/30 border border-blue-800'
                        : 'bg-dark-border'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xs">
                        {message.users?.username?.[0]?.toUpperCase()}
                      </div>
                      <span className={`font-medium ${
                        message.users?.role === 'admin' 
                          ? 'text-red-400' 
                          : message.users?.role === 'creator'
                          ? 'text-purple-400'
                          : 'text-white'
                      }`}>
                        {message.users?.username}
                        {message.users?.role === 'admin' && ' 👑'}
                        {message.users?.role === 'creator' && ' ⭐'}
                      </span>
                      {message.alt_paid > 0 && (
                        <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full">
                          +{message.alt_paid} ALT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300">{message.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-dark-border">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-dark-border border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Press Enter to send • Tips are displayed in chat
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}