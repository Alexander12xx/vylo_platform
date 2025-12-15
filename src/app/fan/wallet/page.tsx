'use client';

import { useState, useEffect } from 'react';
import { 
  Gift, CreditCard, ArrowUpRight, History, 
  TrendingUp, Download, Filter, Search,
  Shield, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { ALTSystem } from '@/lib/alt-coins';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'tip' | 'purchase' | 'reward' | 'withdrawal';
  amount: number;
  to?: string;
  from?: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  description: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      // Mock user ID
      const userId = 'fan_user_123';
      const balance = await ALTSystem.getBalance(userId);
      setBalance(balance);

      // Mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'tip',
          amount: 100,
          to: 'GamerPro',
          status: 'completed',
          timestamp: '2024-01-15T14:30:00Z',
          description: 'Tip during live stream'
        },
        {
          id: '2',
          type: 'purchase',
          amount: 1000,
          from: 'system',
          status: 'completed',
          timestamp: '2024-01-14T10:15:00Z',
          description: 'ALT purchase via credit card'
        },
        {
          id: '3',
          type: 'reward',
          amount: 50,
          from: 'system',
          status: 'completed',
          timestamp: '2024-01-13T16:45:00Z',
          description: 'Daily login reward'
        },
        {
          id: '4',
          type: 'tip',
          amount: 25,
          to: 'MusicLive',
          status: 'completed',
          timestamp: '2024-01-12T20:20:00Z',
          description: 'Tip for great music'
        },
        {
          id: '5',
          type: 'withdrawal',
          amount: -500,
          status: 'pending',
          timestamp: '2024-01-11T09:30:00Z',
          description: 'Withdrawal to bank account'
        },
        {
          id: '6',
          type: 'tip',
          amount: 75,
          to: 'ArtStream',
          status: 'completed',
          timestamp: '2024-01-10T15:10:00Z',
          description: 'Support for artwork'
        },
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'tip': return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'purchase': return <CreditCard className="w-5 h-5 text-green-500" />;
      case 'reward': return <Gift className="w-5 h-5 text-yellow-500" />;
      case 'withdrawal': return <Download className="w-5 h-5 text-blue-500" />;
      default: return <History className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ALT Wallet</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your ALT balance, transactions, and payments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:opacity-90 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Funds
              </button>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-yellow-100">Available Balance</p>
                <p className="text-5xl font-bold mt-2">
                  {balance.toLocaleString()} <span className="text-3xl">ALT</span>
                </p>
                <p className="text-xl text-yellow-100 mt-2">
                  ≈ ${(balance * 0.1).toFixed(2)} USD
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-4">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-lg">+8% this month</span>
                </div>
                <div className="flex items-center text-yellow-100">
                  <Shield className="w-5 h-5 mr-2" />
                  <span>Wallet protected by 2FA</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Link
                href="/fan/wallet/send"
                className="p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center">
                  <ArrowUpRight className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-semibold">Send ALT</p>
                    <p className="text-sm text-yellow-100">Tip creators</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/fan/wallet/withdraw"
                className="p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center">
                  <Download className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-semibold">Withdraw</p>
                    <p className="text-sm text-yellow-100">To bank or crypto</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/fan/wallet/history"
                className="p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center">
                  <History className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-semibold">History</p>
                    <p className="text-sm text-yellow-100">All transactions</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border-0 bg-transparent text-sm focus:outline-none"
                      >
                        <option value="all">All</option>
                        <option value="tip">Tips</option>
                        <option value="purchase">Purchases</option>
                        <option value="reward">Rewards</option>
                        <option value="withdrawal">Withdrawals</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {filteredTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-4">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium capitalize">{tx.type}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {tx.to ? `to ${tx.to}` : tx.from ? `from ${tx.from}` : ''}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {tx.description}
                            </p>
                            <div className="flex items-center mt-1">
                              {getStatusIcon(tx.status)}
                              <span className={`text-xs ml-1 ${
                                tx.status === 'completed' ? 'text-green-600' :
                                tx.status === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {tx.status}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{formatDate(tx.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`text-right font-bold ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} ALT
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">No Transactions</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {filter === 'all' 
                        ? 'You have no transactions yet.' 
                        : `No ${filter} transactions found.`}
                    </p>
                  </div>
                )}

                {/* Transaction Stats */}
                <div className="mt-8 pt-8 border-t dark:border-gray-700">
                  <h4 className="font-medium mb-4">Transaction Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Inflow</p>
                      <p className="text-xl font-bold mt-1 text-green-600">
                        {transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)} ALT
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Outflow</p>
                      <p className="text-xl font-bold mt-1 text-red-600">
                        {Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))} ALT
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tips Given</p>
                      <p className="text-xl font-bold mt-1">
                        {transactions.filter(t => t.type === 'tip').length}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Tip</p>
                      <p className="text-xl font-bold mt-1">
                        {Math.round(transactions.filter(t => t.type === 'tip').reduce((sum, t) => sum + t.amount, 0) / 
                         Math.max(transactions.filter(t => t.type === 'tip').length, 1))} ALT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Wallet Info */}
          <div className="space-y-8">
            {/* Security Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Security Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">2FA Enabled</span>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verification</span>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Login</span>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Sessions</span>
                  <span className="text-sm text-gray-500">1 device</span>
                </div>
              </div>
              <button className="w-full mt-6 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-sm">
                View Security Settings
              </button>
            </div>

            {/* ALT Value Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">ALT Value</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Value</span>
                  <span className="font-bold">1 ALT = $0.12 USD</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">24h Change</span>
                  <span className="text-green-600 font-medium">+2.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">7d Change</span>
                  <span className="text-green-600 font-medium">+8.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">30d Change</span>
                  <span className="text-green-600 font-medium">+15.3%</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="/fan/wallet/convert" className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <span>Convert ALT</span>
                  <span className="text-gray-400">→</span>
                </a>
                <a href="/fan/wallet/vault" className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <span>ALT Vault</span>
                  <span className="text-gray-400">→</span>
                </a>
                <a href="/fan/wallet/rewards" className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <span>Earn Rewards</span>
                  <span className="text-gray-400">→</span>
                </a>
                <a href="/fan/wallet/help" className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  <span>Help & Support</span>
                  <span className="text-gray-400">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
