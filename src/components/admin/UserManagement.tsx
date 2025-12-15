'use client';

import { useState } from 'react';
import { Search, Filter, User, Shield, Video, Gift, MoreVertical, Check, X } from 'lucide-react';

export default function UserManagement() {
  const [users] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'creator', status: 'active', streams: 42, earnings: 12500 },
    { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', role: 'fan', status: 'active', streams: 0, earnings: 0 },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'creator', status: 'pending', streams: 15, earnings: 4200 },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'admin', status: 'active', streams: 0, earnings: 0 },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'fan', status: 'suspended', streams: 0, earnings: 0 },
    { id: 6, name: 'Lisa Taylor', email: 'lisa@example.com', role: 'creator', status: 'active', streams: 28, earnings: 8900 },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'creator': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'fan': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <User className="w-5 h-5 mr-2" />
            User Management
          </h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <User className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-lg hover:bg-green-200 dark:hover:bg-green-800 flex items-center">
                <Check className="w-3 h-3 mr-1" />
                Approve
              </button>
              <button className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-800 flex items-center">
                <X className="w-3 h-3 mr-1" />
                Suspend
              </button>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-6">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map(u => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Streams</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Earnings</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-3 px-6">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' && <Shield className="w-3 h-3 inline mr-1" />}
                    {user.role === 'creator' && <Video className="w-3 h-3 inline mr-1" />}
                    {user.role === 'fan' && <Gift className="w-3 h-3 inline mr-1" />}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center">
                    <Video className="w-4 h-4 text-gray-400 mr-2" />
                    {user.streams}
                  </div>
                </td>
                <td className="py-3 px-6 font-medium">
                  {user.earnings > 0 ? `${user.earnings.toLocaleString()} ALT` : '-'}
                </td>
                <td className="py-3 px-6">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
