'use client';

import { Server, Database, Cpu, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SystemHealth() {
  const services = [
    { name: 'API Server', status: 'healthy', uptime: '99.9%', icon: Server },
    { name: 'Database', status: 'healthy', uptime: '99.8%', icon: Database },
    { name: 'Live Streaming', status: 'warning', uptime: '97.2%', icon: Cpu },
    { name: 'Authentication', status: 'healthy', uptime: '99.9%', icon: Shield },
    { name: 'Payment Gateway', status: 'healthy', uptime: '99.7%', icon: Shield },
    { name: 'CDN', status: 'healthy', uptime: '99.9%', icon: Cpu },
  ];

  const alerts = [
    { id: 1, level: 'warning', message: 'Live streaming service experiencing higher than usual latency', time: '5 min ago' },
    { id: 2, level: 'info', message: 'Database maintenance scheduled for tonight', time: '2 hours ago' },
    { id: 3, level: 'success', message: 'Payment processing speed improved by 40%', time: '1 day ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'info': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'success': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          System Health & Alerts
        </h3>
      </div>
      
      <div className="p-6">
        {/* Services Status */}
        <div className="mb-6">
          <h4 className="font-medium mb-4">Services Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.name} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="font-medium text-sm">{service.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Uptime: {service.uptime}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Recent Alerts</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">Last 24 hours</span>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start p-3 border dark:border-gray-700 rounded-lg">
                <div className={`p-2 rounded-lg mr-3 ${getAlertColor(alert.level)}`}>
                  {alert.level === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <h4 className="font-medium mb-4">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-800">
              Clear Cache
            </button>
            <button className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800">
              Run Diagnostics
            </button>
            <button className="px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-800">
              Backup Database
            </button>
            <button className="px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800">
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
