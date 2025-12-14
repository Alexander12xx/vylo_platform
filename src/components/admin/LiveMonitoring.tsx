'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  PauseCircle,
  PlayCircle,
  SkipForward,
  Maximize2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LiveStreamSystem } from '@/lib/live-stream'

interface LiveMonitoringProps {
  sessions: any[]
}

export default function LiveMonitoring({ sessions }: LiveMonitoringProps) {
  const [activeSessions, setActiveSessions] = useState(sessions)

  const joinAsAdmin = async (sessionId: string) => {
    try {
      const user = await getCurrentUser()
      if (!user || user.role !== 'admin') {
        alert('Admin access required')
        return
      }

      const result = await LiveStreamSystem.adminJoinStream(sessionId, user.id)
      
      // Open live stream in new tab
      window.open(`/live/${sessionId}?admin=true`, '_blank')
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const terminateStream = async (sessionId: string, creatorId: string) => {
    if (!confirm('Are you sure you want to terminate this stream?')) return

    try {
      const user = await getCurrentUser()
      if (!user || user.role !== 'admin') {
        alert('Admin access required')
        return
      }

      const reason = prompt('Enter termination reason:')
      if (!reason) return

      await LiveStreamSystem.freezeLiveStream(sessionId, user.id, reason)
      
      // Remove from list
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId))
      
      alert('Stream terminated successfully')
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const pauseStream = async (sessionId: string) => {
    try {
      await supabase
        .from('live_sessions')
        .update({ status: 'paused' })
        .eq('id', sessionId)

      setActiveSessions(prev => 
        prev.map(s => 
          s.id === sessionId ? { ...s, status: 'paused' } : s
        )
      )
    } catch (error) {
      console.error('Error pausing stream:', error)
    }
  }

  const resumeStream = async (sessionId: string) => {
    try {
      await supabase
        .from('live_sessions')
        .update({ status: 'live' })
        .eq('id', sessionId)

      setActiveSessions(prev => 
        prev.map(s => 
          s.id === sessionId ? { ...s, status: 'live' } : s
        )
      )
    } catch (error) {
      console.error('Error resuming stream:', error)
    }
  }

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return userData
  }

  if (activeSessions.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 border border-gray-200 dark:border-dark-border">
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Active Live Sessions
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are currently no live streams to monitor
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow border border-gray-200 dark:border-dark-border">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Live Stream Monitoring
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitor and manage active live sessions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {activeSessions.length} Active
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-dark-border">
        {activeSessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  {session.status === 'live' && (
                    <div className="absolute -top-1 -right-1">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {session.title}
                  </h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-1" />
                      {session.current_viewers} viewers
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {session.total_earnings} ALT
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      by {session.users?.username || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Join as Admin Button */}
                <button
                  onClick={() => joinAsAdmin(session.id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                  title="Join as Admin (Free Access)"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Monitor
                </button>

                {/* Pause/Resume */}
                {session.status === 'live' ? (
                  <button
                    onClick={() => pauseStream(session.id)}
                    className="inline-flex items-center px-3 py-2 border border-yellow-300 dark:border-yellow-700 rounded-lg text-sm font-medium text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors"
                  >
                    <PauseCircle className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={() => resumeStream(session.id)}
                    className="inline-flex items-center px-3 py-2 border border-green-300 dark:border-green-700 rounded-lg text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Resume
                  </button>
                )}

                {/* Terminate Stream */}
                <button
                  onClick={() => terminateStream(session.id, session.creator_id)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Terminate
                </button>

                {/* Maximize View */}
                <button
                  onClick={() => window.open(`/live/${session.id}?admin=true&fullscreen=true`, '_blank')}
                  className="p-2 border border-gray-300 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                  title="Fullscreen Monitor"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-dark-border/30 rounded-lg">
                <div className="text-gray-600 dark:text-gray-400">Stream Key</div>
                <div className="font-mono text-xs mt-1 truncate">{session.stream_key}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-border/30 rounded-lg">
                <div className="text-gray-600 dark:text-gray-400">Price</div>
                <div className="font-medium mt-1">
                  {session.alt_price > 0 ? `${session.alt_price} ALT` : 'Free'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-border/30 rounded-lg">
                <div className="text-gray-600 dark:text-gray-400">Started</div>
                <div className="font-medium mt-1">
                  {new Date(session.start_time).toLocaleTimeString()}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-border/30 rounded-lg">
                <div className="text-gray-600 dark:text-gray-400">Viewer Limit</div>
                <div className="font-medium mt-1">
                  {session.current_viewers}/{session.max_viewers}
                  {session.current_viewers >= session.max_viewers && (
                    <span className="ml-2 text-xs text-red-600 dark:text-red-400">Full</span>
                  )}
                </div>
              </div>
            </div>

            {/* Alert if suspicious */}
            {session.current_viewers > session.max_viewers * 0.8 && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  High viewer count ({session.current_viewers}/{session.max_viewers}). 
                  Consider increasing viewer limit or monitoring for suspicious activity.
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}