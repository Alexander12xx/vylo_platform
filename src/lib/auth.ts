import { supabase, supabaseAdmin } from './supabase'

export async function signUp(email: string, password: string, username: string, role: 'fan' | 'creator' = 'fan') {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role
        }
      }
    })

    if (authError) throw authError

    // Create user record in database
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user?.id,
          email,
          username,
          role,
          password_hash: 'hashed_by_auth', // Password is handled by Supabase Auth
          status: 'active'
        }
      ])

    if (dbError) throw dbError

    return { success: true, userId: authData.user?.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  // Update last login
  await supabaseAdmin
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.user.id)

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
  })
  
  if (error) throw error
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw error

  // Update last password change
  const user = await getCurrentUser()
  if (user) {
    await supabaseAdmin
      .from('users')
      .update({ last_password_change: new Date().toISOString() })
      .eq('id', user.id)
  }
}

export async function updateProfile(data: {
  username?: string
  whatsapp?: string
  profile_image?: string
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', user.id)

  if (error) throw error
}

export async function requestVerification(imageUrl: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'creator') throw new Error('Only creators can request verification')

  const { error } = await supabase
    .from('users')
    .update({
      verification_image: imageUrl,
      verification_status: 'pending'
    })
    .eq('id', user.id)

  if (error) throw error
}

// Password change cooldown check
export async function canChangePassword() {
  const user = await getCurrentUser()
  if (!user) return false

  if (!user.last_password_change) return true

  const lastChange = new Date(user.last_password_change)
  const now = new Date()
  const daysSinceChange = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)

  return daysSinceChange >= 14
}