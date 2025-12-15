export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-purple-600">Vylo Platform</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your live streaming platform is being prepared...
        </p>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <p className="text-green-600 font-semibold mb-4">✅ Build successful!</p>
          <p className="text-gray-700">
            Your Next.js application is now building correctly. You can gradually add back features.
          </p>
        </div>
      </div>
    </div>
  );
}
