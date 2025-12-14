'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Wallet,
  Home
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AltCoinsSystem } from '@/lib/alt-coins'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  user: any
  children?: React.ReactNode
}

export default function Navbar({ user, children }: NavbarProps) {
  const router = useRouter()
  const [balance, setBalance] = useState<number>(user.alt_balance || 0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const getDashboardPath = () => {
    switch (user.role) {
      case 'admin': return '/admin'
      case 'creator': return '/creator'
      default: return '/fan'
    }
  }

  return (
    <nav className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href={getDashboardPath()} className="flex items-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center"
                >
                  <span className="text-white font-bold text-sm">V</span>
                </motion.div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white hidden md:inline">
                  VYLO
                </span>
              </Link>
            </div>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href={getDashboardPath()}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              {user.role === 'fan' && (
                <>
                  <Link
                    href="/fan/feed"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Feed
                  </Link>
                  <Link
                    href="/fan/live"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Live
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-md leading-5 bg-white dark:bg-dark-bg placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white sm:text-sm"
                  placeholder="Search creators..."
                />
              </div>
            </form>

            {/* Wallet Balance */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg">
              <Wallet className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Balance</div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-900 dark:text-white">{balance}</span>
                  <span className="ml-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
                    ALT
                  </span>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {children}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.username || user.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark-card ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-border"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}