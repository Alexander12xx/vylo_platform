import { supabase, supabaseAdmin } from './supabase'
import Peer from 'simple-peer'

export interface LiveSessionConfig {
  title: string
  description?: string
  altPrice: number
  subscriptionRequired: boolean
  maxViewers: number
  isPrivate: boolean
}

export class LiveStreamSystem {
  private peers: Map<string, Peer.Instance> = new Map()
  private stream: MediaStream | null = null

  // Create new live session
  static async createLiveSession(creatorId: string, config: LiveSessionConfig) {
    // Generate stream key
    const streamKey = `live_${creatorId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Generate Jitsi room ID
    const jitsiRoomId = `vylo-${creatorId}-${Date.now()}`

    const { data, error } = await supabase
      .from('live_sessions')
      .insert([
        {
          creator_id: creatorId,
          title: config.title,
          description: config.description,
          alt_price: config.altPrice,
          subscription_required: config.subscriptionRequired,
          max_viewers: config.maxViewers,
          is_private: config.isPrivate,
          stream_key: streamKey,
          jitsi_room_id: jitsiRoomId,
          status: 'scheduled'
        }
      ])
      .select()
      .single()

    if (error) throw error

    // Notify subscribers
    await this.notifySubscribers(creatorId, data.id, config.title)

    return data
  }

  // Start live stream
  static async startLiveStream(sessionId: string) {
    const { data, error } = await supabase
      .from('live_sessions')
      .update({
        status: 'live',
        start_time: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error

    // Broadcast live notification
    await this.broadcastLiveNotification(data.creator_id, data.id, data.title)

    return data
  }

  // End live stream
  static async endLiveStream(sessionId: string) {
    const { data, error } = await supabase
      .from('live_sessions')
      .update({
        status: 'ended',
        end_time: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error

    // Calculate and distribute earnings
    await this.calculateEarnings(sessionId)

    return data
  }

  // Join live stream as viewer
  static async joinLiveStream(sessionId: string, userId: string) {
    const session = await this.getLiveSession(sessionId)
    if (!session) throw new Error('Live session not found')

    // Check if user can join
    const canJoin = await this.canUserJoin(session, userId)
    if (!canJoin.allowed) {
      throw new Error(canJoin.reason)
    }

    // Check viewer count
    if (session.current_viewers >= session.max_viewers) {
      throw new Error('Live session is full')
    }

    // Process payment if required
    if (session.alt_price > 0) {
      const altSystem = new AltCoinsSystem()
      const balance = await altSystem.getBalance(userId)
      
      if (balance < session.alt_price) {
        throw new Error('Insufficient ALT balance')
      }

      // Charge user
      await altSystem.payForContent(userId, sessionId, session.creator_id)
    }

    // Add viewer to session
    const { error } = await supabase
      .from('live_viewers')
      .insert([
        {
          live_session_id: sessionId,
          user_id: userId,
          alt_paid: session.alt_price
        }
      ])

    if (error) throw error

    // Update viewer count
    await this.updateViewerCount(sessionId, 1)

    return { 
      success: true, 
      streamKey: session.stream_key,
      jitsiRoomId: session.jitsi_room_id,
      altPrice: session.alt_price 
    }
  }

  // Leave live stream
  static async leaveLiveStream(sessionId: string, userId: string) {
    const { error } = await supabase
      .from('live_viewers')
      .update({ left_at: new Date().toISOString() })
      .eq('live_session_id', sessionId)
      .eq('user_id', userId)

    if (error) throw error

    // Update viewer count
    await this.updateViewerCount(sessionId, -1)

    return { success: true }
  }

  // Admin: Freeze live stream
  static async freezeLiveStream(sessionId: string, adminId: string, reason: string) {
    const { error } = await supabaseAdmin
      .from('live_sessions')
      .update({
        status: 'terminated',
        metadata: {
          ...(await this.getLiveSession(sessionId))?.metadata,
          terminated_by: adminId,
          termination_reason: reason,
          terminated_at: new Date().toISOString()
        }
      })
      .eq('id', sessionId)

    if (error) throw error

    // Assign strike to creator
    await supabaseAdmin
      .rpc('assign_strike', {
        p_user_id: (await this.getLiveSession(sessionId))?.creator_id,
        p_reason: `Live stream terminated: ${reason}`,
        p_severity: 'high',
        p_admin_id: adminId
      })

    // Notify all viewers
    await this.notifyViewers(sessionId, 'Live stream terminated by admin', reason)

    return { success: true }
  }

  // Admin: Join any stream for free
  static async adminJoinStream(sessionId: string, adminId: string) {
    // Verify admin
    const { data: admin } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .single()

    if (admin?.role !== 'admin') {
      throw new Error('Admin access required')
    }

    const session = await this.getLiveSession(sessionId)
    if (!session) throw new Error('Live session not found')

    // Admin joins without payment
    const { error } = await supabase
      .from('live_viewers')
      .insert([
        {
          live_session_id: sessionId,
          user_id: adminId,
          alt_paid: 0,
          metadata: { is_admin: true }
        }
      ])

    if (error) throw error

    await this.updateViewerCount(sessionId, 1)

    return {
      success: true,
      streamKey: session.stream_key,
      jitsiRoomId: session.jitsi_room_id,
      isAdmin: true
    }
  }

  // WebRTC peer connection
  static async createPeerConnection(
    isInitiator: boolean,
    stream: MediaStream,
    onSignal: (signal: any) => void,
    onStream: (stream: MediaStream) => void
  ) {
    const peer = new Peer({
      initiator: isInitiator,
      trickle: true,
      stream: isInitiator ? stream : undefined,
      config: {
        iceServers: [
          { urls: process.env.NEXT_PUBLIC_STUN_SERVER || 'stun:stun.l.google.com:19302' },
          { urls: process.env.NEXT_PUBLIC_TURN_SERVER || '' }
        ]
      }
    })

    peer.on('signal', (signal) => {
      onSignal(signal)
    })

    peer.on('stream', (remoteStream) => {
      onStream(remoteStream)
    })

    peer.on('error', (err) => {
      console.error('Peer error:', err)
    })

    return peer
  }

  // Helper methods
  private static async getLiveSession(sessionId: string) {
    const { data, error } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) return null
    return data
  }

  private static async canUserJoin(session: any, userId: string) {
    // Admin can always join for free
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (user?.role === 'admin') {
      return { allowed: true, reason: 'Admin access' }
    }

    // Check subscription requirement
    if (session.subscription_required) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('fan_id', userId)
        .eq('creator_id', session.creator_id)
        .eq('status', 'active')
        .single()

      if (!subscription) {
        return { allowed: false, reason: 'Subscription required' }
      }
    }

    // Check if already joined
    const { data: existingViewer } = await supabase
      .from('live_viewers')
      .select('id')
      .eq('live_session_id', session.id)
      .eq('user_id', userId)
      .is('left_at', null)
      .single()

    if (existingViewer) {
      return { allowed: false, reason: 'Already joined' }
    }

    return { allowed: true, reason: '' }
  }

  private static async updateViewerCount(sessionId: string, change: number) {
    const session = await this.getLiveSession(sessionId)
    if (!session) return

    const newCount = Math.max(0, session.current_viewers + change)

    await supabase
      .from('live_sessions')
      .update({ current_viewers: newCount })
      .eq('id', sessionId)
  }

  private static async notifySubscribers(creatorId: string, sessionId: string, title: string) {
    const { data: subscribers } = await supabase
      .from('subscriptions')
      .select('fan_id')
      .eq('creator_id', creatorId)
      .eq('status', 'active')

    if (!subscribers) return

    for (const sub of subscribers) {
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: sub.fan_id,
            title: 'New Live Session',
            message: `${title} is starting soon!`,
            type: 'live'
          }
        ])
    }
  }

  private static async broadcastLiveNotification(creatorId: string, sessionId: string, title: string) {
    // Get all fans
    const { data: fans } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'fan')
      .eq('status', 'active')

    if (!fans) return

    for (const fan of fans) {
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: fan.id,
            title: 'Live Now!',
            message: `${title} is live now!`,
            type: 'live'
          }
        ])
    }
  }

  private static async calculateEarnings(sessionId: string) {
    const session = await this.getLiveSession(sessionId)
    if (!session) return

    // Get all paid viewers
    const { data: viewers } = await supabase
      .from('live_viewers')
      .select('alt_paid')
      .eq('live_session_id', sessionId)
      .gt('alt_paid', 0)

    if (!viewers) return

    const totalEarnings = viewers.reduce((sum, viewer) => sum + viewer.alt_paid, 0)

    // Update session earnings
    await supabase
      .from('live_sessions')
      .update({ total_earnings: totalEarnings })
      .eq('id', sessionId)
  }

  private static async notifyViewers(sessionId: string, title: string, message: string) {
    const { data: viewers } = await supabase
      .from('live_viewers')
      .select('user_id')
      .eq('live_session_id', sessionId)
      .is('left_at', null)

    if (!viewers) return

    for (const viewer of viewers) {
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: viewer.user_id,
            title,
            message,
            type: 'system'
          }
        ])
    }
  }
}