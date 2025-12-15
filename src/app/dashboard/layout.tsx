'use client'

import { redirect } from 'next/navigation'
import { useAuth } from '@/components/providers/SupabaseProvider'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      redirect('/auth/login')
    }

    if (user) {
      // Fetch user role from database
      const fetchUserRole = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('role, status')
          .eq('id', user.id)
          .single()

        if (error || !data) {
          console.error('Error fetching user data:', error)
          return
        }

        if (data.status === 'banned') {
          await supabase.auth.signOut()
          redirect('/auth/login?error=banned')
        }

        if (data.status === 'frozen') {
          // Show frozen message but allow viewing
          console.warn('Account is frozen')
        }

        setUserRole(data.role)
      }

      fetchUserRole()
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardSidebar userRole={userRole} />
      <main className="pl-64 pt-16"> {/* Adjust based on sidebar width */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
