'use client';

import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ALTTransaction } from '@/lib/alt-coins';

interface ALTTransactionsProps {
  transactions: ALTTransaction[];
}

export default function ALTTransactions({ transactions }: ALTTransactionsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'tip': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'purchase': return <DollarSign className="w-4 h-4 text-blue-500" />;
      case 'reward': return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case 'transfer': return <ArrowDownRight className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
            Recent ALT Transactions
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last 24 hours
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-3">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'tip' ? 'text-red-600' : 'text-green-600'}`}>
                    {transaction.type === 'tip' ? '-' : '+'}{transaction.amount} ALT
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.session_id ? 'During stream' : 'Direct transfer'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium mb-2">No Recent Transactions</h4>
              <p className="text-gray-500 dark:text-gray-400">ALT transactions will appear here.</p>
            </div>
          )}
        </div>
        
        {/* Transaction Stats */}
        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Inflow</p>
                  <p className="text-xl font-bold">12,450 ALT</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Outflow</p>
                  <p className="text-xl font-bold">8,920 ALT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
