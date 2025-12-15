// Simple Live Monitoring Component
export default function LiveMonitoring({ sessions = [] }: { sessions?: any[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Live Streams Monitoring</h3>
      <div className="space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{session.title || 'Stream'}</h4>
                  <p className="text-sm text-gray-500">Viewers: {session.viewers || 0}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  session.status === 'live' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {session.status || 'unknown'}
                </span>
              </
