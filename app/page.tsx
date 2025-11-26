import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Plan Your Day with Intention
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Structure your day into 7 purposeful zones and build sustainable, mindful productivity habits.
          </p>

          <Link
            href="/planner"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Planning →
          </Link>

          <p className="text-sm text-gray-500">
            Built with focus, balance, and mindfulness
          </p>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-1 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="sr-only">7 Planning Zones Feature</h2>
              <p className="text-sm text-gray-700"><span aria-hidden="true">🎯</span> <strong>7 Planning Zones</strong> - Deep work, quick wins, recharge & more</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="sr-only">Track Progress Feature</h2>
              <p className="text-sm text-gray-700"><span aria-hidden="true">📊</span> <strong>Track Progress</strong> - Visualize your completion in real-time</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="sr-only">Local Storage Feature</h2>
              <p className="text-sm text-gray-700"><span aria-hidden="true">💾</span> <strong>Local Storage</strong> - Your plans are saved securely</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

