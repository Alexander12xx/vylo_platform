'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  Compass,
  Video,
  Users,
  MessageSquare,
  CreditCard,
  BarChart3,
  Upload,
  Settings,
  Shield,
  Zap,
  Globe,
  Trophy,
  History,
  Bell,
  Wallet,
  Camera,
  Mic,
  DollarSign,
  UserCheck,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface SidebarProps {
  user: any
}

const fanNavigation = [
  { name: 'Feed', href: '/fan/feed', icon: Home },
  { name: 'Discover', href: '/fan/discover', icon: Compass },
  { name: 'Live Streams', href: '/fan/live', icon: Video },
  { name: 'Subscriptions', href: '/fan/subscriptions', icon: Users },
  { name: 'Messages', href: '/fan/messages', icon: MessageSquare },
  { name: 'Wallet', href: '/fan/wallet', icon: CreditCard },
  { name: 'Notifications', href: '/fan/notifications', icon: Bell },
]

const creatorNavigation = [
  { name: 'Dashboard', href: '/creator', icon: Home },
  { name: 'Upload Content', href: '/creator/upload', icon: Upload },
  { name: 'Go Live', href: '/creator/live', icon: Video },
  { name: 'My Content', href: '/creator/content', icon: FileText },
  { name: 'Subscribers', href: '/creator/subscribers', icon: UserCheck },
  { name: 'Earnings', href: '/creator/earnings', icon: DollarSign },
  { name: 'Analytics', href: '/creator/analytics', icon: BarChart3 },
  { name: 'Withdraw', href: '/creator/withdrawal', icon: CreditCard },
  { name: 'Messages', href: '/creator/messages', icon: MessageSquare },
]

const adminNavigation = [
  { name: 'Overview', href: '/admin', icon: Home },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Content Moderation', href: '/admin/content', icon: Shield },
  { name: 'Live Monitoring', href: '/admin/live', icon: Video },
  { name: 'Withdrawals', href: '/admin/withdrawals', icon: CreditCard },
  { name: 'Recharge Requests', href: '/admin/recharge', icon: Wallet },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Platform Stats', href: '/admin/stats', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Security Logs', href: '/admin/security', icon: AlertTriangle },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const getNavigation = () => {
    switch (user.role) {
      case 'admin': return adminNavigation
      case 'creator': return creatorNavigation
      default: return fanNavigation
    }
  }

  const navigation = getNavigation()

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col ${
        collapsed ? 'lg:w-20' : ''
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            {!collapsed ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                  VYLO
                </h1>
              </>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">V</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="ml-auto p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border"
            >
              <svg
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                  collapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* User Info */}
          {!collapsed && (
            <div className="mt-6 px-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.username || user.email}
                  </p>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user.status === 'active' ? 'bg-green-500' :
                      user.status === 'frozen' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role} • {user.status}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* ALT Balance */}
              <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">ALT Balance</div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.alt_balance?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                    ALT
                  </span>
                </div>
                {user.role === 'creator' && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Earned: {user.total_earned?.toLocaleString() || 0} ALT
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    } ${collapsed ? 'mr-0' : ''}`}
                  />
                  {!collapsed && item.name}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto w-2 h-2 rounded-full bg-primary-500"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Creator Verification Status */}
          {user.role === 'creator' && !collapsed && (
            <div className="px-4 py-3">
              <div className={`p-3 rounded-lg ${
                user.verification_status === 'verified'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : user.verification_status === 'pending'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center">
                  {user.verification_status === 'verified' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  ) : user.verification_status === 'pending' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  )}
                  <div>
                    <div className="text-sm font-medium">
                      {user.verification_status === 'verified' ? 'Verified Creator' :
                       user.verification_status === 'pending' ? 'Verification Pending' : 'Not Verified'}
                    </div>
                    <div className="text-xs opacity-75">
                      {user.verification_status === 'pending' ? 'Under review' : 
                       user.verification_status === 'rejected' ? 'Verification rejected' :
                       'Trusted creator badge'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strikes Warning */}
          {user.strikes > 0 && !collapsed && (
            <div className="px-4 py-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium">Warning: {user.strikes} Strike(s)</div>
                    <div className="text-xs opacity-75">
                      {3 - user.strikes} strikes left before freeze
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}