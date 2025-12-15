// Simplified WebRTC component
export default function WebRTCStream({ streamId }: { streamId: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">WebRTC Stream</h3>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-red-500 text-xs rounded-full">LIVE</span>
            <span className="px-2 py-1 bg-blue-500 text-xs rounded-full">HD</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-1">Stream ID: {streamId}</p>
      </div>
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔴</span>
              </div>
            </div>
          </div>
          <p className="text-white font-medium mt-6">WebRTC Connection Active</p>
          <p className="text-gray-400 text-sm mt-2">Low-latency peer-to-peer streaming</p>
        </div>
      </div>
    </div>
  );
}
