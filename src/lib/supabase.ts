import { createClient } from '@supabase/supabase-js'

// These environment variables are set in your Netlify dashboard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export the main client. This will be used across your app.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// A simple helper function to check for an admin user (placeholder logic)
export async function isAdmin(): Promise<boolean> {
  // For now, return false to build. You can implement real logic later.
  console.log('Admin check: placeholder logic - returning false');
  return false;
}
