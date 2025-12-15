import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'login':
        const { email, password } = body;
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;

        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        return NextResponse.json({
          success: true,
          user: {
            ...authData.user,
            profile
          },
          session: authData.session
        });

      case 'register':
        const { email: regEmail, password: regPassword, name, role } = body;
        
        const { data: regData, error: regError } = await supabase.auth.signUp({
          email: regEmail,
          password: regPassword,
        });

        if (regError) throw regError;

        // Create profile
        await supabase
          .from('profiles')
          .insert({
            id: regData.user?.id,
            email: regEmail,
            name,
            role: role || 'fan',
            created_at: new Date().toISOString()
          });

        return NextResponse.json({
          success: true,
          user: regData.user,
          message: 'Registration successful'
        });

      case 'logout':
        await supabase.auth.signOut();
        return NextResponse.json({
          success: true,
          message: 'Logged out successfully'
        });

      case 'reset-password':
        const { resetEmail } = body;
        await supabase.auth.resetPasswordForEmail(resetEmail);
        return NextResponse.json({
          success: true,
          message: 'Password reset email sent'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({
        authenticated: false
      });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      authenticated: true,
      user: {
        ...session.user,
        profile
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      authenticated: false
    });
  }
}
