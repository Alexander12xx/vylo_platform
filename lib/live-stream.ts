import { supabase } from './supabase';

export const LiveStreamSystem = {
  async createSession(creatorId: string, sessionData: any) {
    const { data, error } = await supabase
      .from('live_sessions')
      .insert([{
        creator_id: creatorId,
        title: sessionData.title,
        description: sessionData.description,
        alt_price: sessionData.altPrice || 0,
        subscription_required: sessionData.subscriptionRequired || false,
        max_viewers: sessionData.maxViewers || 100,
        status: 'scheduled',
        stream_key: `live_${creatorId}_${Date.now()}`,
        jitsi_room_id: `room_${creatorId}_${Date.now()}`,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async startSession(sessionId: string) {
    const { data, error } = await supabase
      .from('live_sessions')
      .update({
        status: 'live',
        start_time: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getActiveSessions() {
    const { data, error } = await supabase
      .from('live_sessions')
      .select(`
        *,
        creator:users(username, profile_image)
      `)
      .eq('status', 'live')
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getLiveSession(sessionId: string) {
    const { data, error } = await supabase
      .from('live_sessions')
      .select(`
        *,
        creator:users(username, profile_image)
      `)
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data;
  },

  async getLiveSessions() {
    const { data, error } = await supabase
      .from('live_sessions')
      .select(`
        *,
        creator:users(username, profile_image)
      `)
      .in('status', ['live', 'scheduled'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async joinSession(sessionId: string, userId: string) {
    // Check if user has access
    const { data: session } = await supabase
      .from('live_sessions')
      .select('alt_price, subscription_required, creator_id')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    // Check subscription/balance
    if (session.alt_price > 0) {
      const { data: user } = await supabase
        .from('users')
        .select('alt_balance')
        .eq('id', userId)
        .single();

      if (!user || user.alt_balance < session.alt_price) {
        throw new Error('Insufficient ALT balance');
      }

      // Deduct ALT from user's balance
      const { error: balanceError } = await supabase
        .from('users')
        .update({ 
          alt_balance: user.alt_balance - session.alt_price 
        })
        .eq('id', userId);

      if (balanceError) throw balanceError;

      // Record transaction
      await supabase
        .from('alt_transactions')
        .insert([{
          user_id: userId,
          related_user_id: session.creator_id,
          type: 'spend',
          amount: session.alt_price,
          description: 'Live stream access fee',
          metadata: { session_id: sessionId }
        }]);
    }

    // Record viewer
    const { data, error } = await supabase
      .from('live_viewers')
      .insert([{
        live_session_id: sessionId,
        user_id: userId,
        alt_paid: session.alt_price,
        joined_at: new Date().toISOString(),
      }]);

    if (error) throw error;
    return data;
  },
};
