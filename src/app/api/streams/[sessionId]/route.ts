import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

interface RouteParams {
  params: {
    sessionId: string;
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = params;

    // Get stream data
    const { data: stream, error } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    // Get stream stats
    const { data: stats } = await supabase
      .from('session_stats')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    // Get recent chat messages
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get top supporters
    const { data: supporters } = await supabase
      .from('alt_transactions')
      .select('from_user_id, sum(amount)')
      .eq('session_id', sessionId)
      .eq('type', 'tip')
      .group('from_user_id')
      .order('sum', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      stream,
      stats: stats || {},
      messages: messages || [],
      supporters: supporters || []
    });

  } catch (error) {
    console.error('Stream API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = params;
    const body = await request.json();
    const { action, userId, data } = body;

    switch (action) {
      case 'join':
        // Add user to viewers
        await supabase
          .from('session_viewers')
          .upsert({
            session_id: sessionId,
            user_id: userId,
            joined_at: new Date().toISOString()
          });

        // Increment viewer count
        await supabase.rpc('increment_viewer_count', { session_id: sessionId });
        break;

      case 'leave':
        // Remove user from viewers
        await supabase
          .from('session_viewers')
          .delete()
          .eq('session_id', sessionId)
          .eq('user_id', userId);

        // Decrement viewer count
        await supabase.rpc('decrement_viewer_count', { session_id: sessionId });
        break;

      case 'tip':
        // Process tip
        const { amount, message } = data;
        
        // Create transaction
        const { error: txError } = await supabase
          .from('alt_transactions')
          .insert({
            from_user_id: userId,
            to_user_id: body.creatorId,
            amount: amount,
            type: 'tip',
            session_id: sessionId,
            metadata: { message }
          });

        if (txError) throw txError;

        // Update balances
        await supabase.rpc('transfer_alt', {
          from_user_id: userId,
          to_user_id: body.creatorId,
          amount: amount
        });

        // Update stream earnings
        await supabase.rpc('update_session_earnings', {
          session_id: sessionId,
          amount: amount
        });
        break;

      case 'send_message':
        // Save chat message
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            user_id: userId,
            message: data.message,
            is_creator: data.isCreator || false,
            is_moderator: data.isModerator || false
          });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Action completed successfully'
    });

  } catch (error) {
    console.error('Stream action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
