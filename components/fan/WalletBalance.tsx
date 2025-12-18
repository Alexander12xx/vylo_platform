import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
}

export default function WalletBalance({ balance }: WalletBalanceProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <DollarSign className="w-5 h-5 mr-2 text-green-500" />
        Wallet Balance
      </h3>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {balance.toLocaleString()} ALT
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          ≈ ${(balance * 0.1).toFixed(2)}
        </p>
      </div>
      
      <div className="space-y-3">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:opacity-90">
          Add Funds
        </button>
        <button className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900">
          Withdraw
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Last transaction</span>
          <span className="font-medium">+500 ALT</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-500 dark:text-gray-400">Date</span>
          <span>Dec 15, 2023</span>
        </div>
      </div>
    </div>
  );
}