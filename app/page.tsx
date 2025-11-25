import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-blue-600">🧘 Mindful Daily Planner</h1>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Day with Intention
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Structure your day into 7 purposeful zones and build sustainable, mindful productivity habits.
          </p>

          <Link
            href="/planner"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mb-4"
          >
            Start Planning →
          </Link>

          <p className="text-sm text-gray-500">
            Built with focus, balance, and mindfulness
          </p>
        </div>
      </div>
    </div>
  );
}
