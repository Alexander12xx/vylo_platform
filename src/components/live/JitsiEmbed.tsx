// Simplified Jitsi component
export default function JitsiEmbed({ roomName }: { roomName: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg overflow-hidden">
      <div className="p-4 text-white">
        <h3 className="font-bold">Live Stream: {roomName}</h3>
        <p className="text-sm opacity-75 mt-1">Jitsi Meet integration will appear here</p>
      </div>
      <div className="aspect-video flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">▶️</span>
          </div>
          <p className="text-white font-medium">Video Conference Ready</p>
          <p className="text-gray-300 text-sm mt-1">Connect with up to 50 participants</p>
        </div>
      </div>
    </div>
  );
}
