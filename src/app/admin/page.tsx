'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Video, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  BarChart,
  Globe,
  CreditCard
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PlatformStats from '@/components/admin/PlatformStats'
import LiveMonitoring from '@/components/admin/LiveMonitoring'
import RecentActivities from '@/components/admin/RecentActivities'
import QuickActions from '@/components/admin/QuickActions'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalRevenue: 0,
    activeLive: 0,
    pendingWithdrawals: 0,
    pendingContent: 0,
    pendingRecharge: 0,
    flaggedContent: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [liveSessions, setLiveSessions] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
    subscribeToUpdates()
  }, [])

  const loadDashboardData = async () => {
    // Load all stats
    const [
      usersCount,
      creatorsCount,
      revenueData,
      liveData,
      withdrawalsData,
      contentData,
      rechargeData,
      flaggedData
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact' }).eq('role', 'creator'),
      supabase.from('alt_transactions').select('amount').eq('type', 'commission'),
      supabase.from('live_sessions').select('id').eq('status', 'live'),
      supabase.from('withdrawals').select('id').eq('status', 'pending'),
      supabase.from('content').select('id').eq('status', 'pending'),
      supabase.from('recharge_tokens').select('id').eq('status', 'pending'),
      supabase.from('content').select('id').eq('status', 'flagged')
    ])

    // Calculate total commission revenue
    const totalRevenue = revenueData.data?.reduce((sum, t) => sum + t.amount, 0) || 0

    setStats({
      totalUsers: usersCount.count || 0,
      totalCreators: creatorsCount.count || 0,
      totalRevenue,
      activeLive: liveData.data?.length || 0,
      pendingWithdrawals: withdrawalsData.data?.length || 0,
      pendingContent: contentData.data?.length || 0,
      pendingRecharge: rechargeData.data?.length || 0,
      flaggedContent: flaggedData.data?.length || 0
    })

    // Load recent activities
    const { data: activities } = await supabase
      .from('alt_transactions')
      .select(`
        *,
        users!alt_transactions_user_id_fkey (
          username,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (activities) setRecentActivities(activities)

    // Load live sessions
    const { data: live } = await supabase
      .from('live_sessions')
      .select(`
        *,
        users!live_sessions_creator_id_fkey (
          username,
          profile_image
        )
      `)
      .eq('status', 'live')
      .order('start_time', { ascending: false })

    if (live) setLiveSessions(live)
  }

  const subscribeToUpdates = () => {
    const channels = [
      supabase.channel('live-sessions')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'live_sessions' 
        }, () => loadDashboardData())
        .subscribe(),
      
      supabase.channel('transactions')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'alt_transactions' 
        }, () => loadDashboardData())
        .subscribe()
    ]

    return () => channels.forEach(ch => supabase.removeChannel(ch))
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      link: '/admin/users'
    },
    {
      title: 'Active Creators',
      value: stats.totalCreators,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      link: '/admin/users?role=creator'
    },
    {
      title: 'Platform Revenue',
      value: `${stats.totalRevenue} ALT`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+25%',
      link: '/admin/stats'
    },
    {
      title: 'Live Sessions',
      value: stats.activeLive,
      icon: Video,
      color: 'bg-purple-500',
      change: '+5',
      link: '/admin/live'
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals,
      icon: CreditCard,
      color: 'bg-orange-500',
      change: 'Requires attention',
      link: '/admin/withdrawals'
    },
    {
      title: 'Content to Moderate',
      value: stats.pendingContent + stats.flaggedContent,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: `${stats.flaggedContent} flagged`,
      link: '/admin/content'
    },
    {
      title: 'Recharge Requests',
      value: stats.pendingRecharge,
      icon: Clock,
      color: 'bg-indigo-500',
      change: 'Awaiting approval',
      link: '/admin/recharge'
    },
    {
      title: 'System Health',
      value: '100%',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: 'All systems normal',
      link: '/admin/settings'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage the VYLO platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow p-6 border border-gray-200 dark:border-dark-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Stats */}
        <div className="lg:col-span-2">
          <PlatformStats />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Live Monitoring */}
      <div>
        <LiveMonitoring sessions={liveSessions} />
      </div>

      {/* Recent Activities */}
      <div>
        <RecentActivities activities={recentActivities} />
      </div>

      {/* Security Overview */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Overview
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monitor platform security and user activities
            </p>
          </div>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
            View Security Logs
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-white dark:bg-dark-card rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Strikes</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-dark-card rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Frozen Accounts</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-dark-card rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">DevTools Detected</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-dark-card rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">89%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Security Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}