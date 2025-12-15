'use client';

import { MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-dark-card rounded-lg shadow-xl border dark:border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Live Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online • Typically replies in 5 min</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Hi! How can we help you today?</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">I need help with streaming setup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
