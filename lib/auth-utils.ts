import { supabase } from './supabase';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    redirect('/auth/login');
  }
  
  // Fetch the full user profile from your public.users table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();
    
  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    redirect('/auth/login');
  }
  
  return { session, profile };
}
