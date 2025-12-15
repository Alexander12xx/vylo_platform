'use client';

import { useState } from 'react';
import { Gift, CreditCard, ArrowUpRight, History, Plus, TrendingUp } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
}

export default function WalletBalance({ balance }: WalletBalanceProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('1000');

  const purchaseOptions = [
    { amount: 100, price: 10, bonus: 0 },
    { amount: 500, price: 45, bonus: 25 },
    { amount: 1000, price: 85, bonus: 100 },
    { amount: 5000, price: 400, bonus: 1000 },
  ];

  const recentTransactions = [
    { id: 1, type: 'tip', to: 'GamerPro', amount: 100, time: '2 hours ago' },
    { id: 2, type: 'purchase', amount: 1000, time: '1 day ago' },
    { id: 3, type: 'tip', to: 'MusicLive', amount: 50, time: '2 days ago' },
    { id: 4, type: 'reward', amount: 25, time: '3 days ago' },
  ];

  const handlePurchase = (amount: number) => {
    // Implement purchase logic
    console.log('Purchasing', amount, 'ALT');
    setShowPurchaseModal(false);
    alert(`Successfully purchased ${amount} ALT!`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Gift className="w-5 h-5 mr-2 text-yellow-500" />
            ALT Wallet
          </h3>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add ALT
          </button>
        </div>
      </div>

      {/* Balance Display */}
      <div className="p-6">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Available Balance</p>
          <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
            {balance.toLocaleString()} <span className="text-2xl">ALT</span>
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            ≈ ${(balance * 0.1).toFixed(2)} USD
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 flex flex-col items-center">
            <ArrowUpRight className="w-5 h-5 text-purple-500 mb-2" />
            <span className="text-sm font-medium">Send ALT</span>
          </button>
          <button className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 flex flex-col items-center">
            <CreditCard className="w-5 h-5 text-blue-500 mb-2" />
            <span className="text-sm font-medium">Withdraw</span>
          </button>
        </div>

        {/* Recent Transactions */}
        <div>
          <h4 className="font-medium mb-4 flex items-center">
            <History className="w-4 h-4 mr-2" />
            Recent Transactions
          </h4>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${
                    tx.type === 'tip' ? 'bg-red-100 dark:bg-red-900' :
                    tx.type === 'purchase' ? 'bg-green-100 dark:bg-green-900' :
                    'bg-yellow-100 dark:bg-yellow-900'
                  }`}>
                    {tx.type === 'tip' && <ArrowUpRight className="w-4 h-4 text-red-500" />}
                    {tx.type === 'purchase' && <CreditCard className="w-4 h-4 text-green-500" />}
                    {tx.type === 'reward' && <Gift className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{tx.type}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tx.to ? `to ${tx.to}` : tx.time}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'tip' ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.type === 'tip' ? '-' : '+'}{tx.amount} ALT
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALT Value */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium">ALT Value Increasing</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                1 ALT = $0.12 USD (+8% this month)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Purchase ALT Coins</h3>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Select Amount</label>
                <div className="grid grid-cols-2 gap-3">
                  {purchaseOptions.map((option) => (
                    <button
                      key={option.amount}
                      onClick={() => setPurchaseAmount(option.amount.toString())}
                      className={`p-4 border rounded-lg text-center ${
                        purchaseAmount === option.amount.toString()
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                    >
                      <div className="font-bold text-lg">{option.amount.toLocaleString()} ALT</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ${option.price}
                        {option.bonus > 0 && (
                          <span className="text-green-600 ml-1">+{option.bonus} bonus</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Custom Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter ALT amount"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ALT
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <input type="radio" name="payment" className="mr-3" defaultChecked />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, Amex</p>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <input type="radio" name="payment" className="mr-3" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fast and secure</p>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <input type="radio" name="payment" className="mr-3" />
                    <div>
                      <p className="font-medium">Crypto</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Bitcoin, Ethereum</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">ALT Amount</span>
                  <span className="font-semibold">{parseInt(purchaseAmount).toLocaleString()} ALT</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Price</span>
                  <span className="font-semibold">
                    ${(parseInt(purchaseAmount) * 0.1).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">
                    ${(parseInt(purchaseAmount) * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handlePurchase(parseInt(purchaseAmount))}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:opacity-90"
                >
                  Purchase Now
                </button>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-6 py-3 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
