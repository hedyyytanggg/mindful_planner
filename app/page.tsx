import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Plan Your Day with Purpose,<br />Not Pressure
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A daily planner that balances productivity with wellbeing. Track what matters—work, hobbies, events, and joy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/signup"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
            >
              Start Planning Today
            </Link>
            <Link
              href="/features"
              className="inline-block bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-lg border-2 border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg"
            >
              See How It Works
            </Link>
          </div>

          <p className="text-sm text-gray-500">Free • No credit card required • Your data stays private</p>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="bg-gray-50 py-8 px-6 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-sm font-semibold text-gray-700">Privacy-First</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚫</span>
              <span className="text-sm font-semibold text-gray-700">No Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-sm font-semibold text-gray-700">Secure Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-sm font-semibold text-gray-700">Built for Balance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Tired of Planning Tools That Feel Like Work?
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Most productivity apps treat you like a machine. We built something different.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-4 items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-3xl flex-shrink-0">❌</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">To-do lists that ignore your energy</h3>
                <p className="text-sm text-gray-600">Tasks pile up without considering when you're most focused or need rest.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-3xl flex-shrink-0">❌</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Apps that neglect your wellbeing</h3>
                <p className="text-sm text-gray-600">Productivity at the cost of burnout. No space for recharge or joy.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-3xl flex-shrink-0">❌</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Planners that lose track of hobbies</h3>
                <p className="text-sm text-gray-600">Your guitar sits untouched. Projects abandoned. No progress tracking.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-3xl flex-shrink-0">❌</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Complex tools that add stress</h3>
                <p className="text-sm text-gray-600">Too many features, too much setup. Planning becomes another chore.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-gradient-to-b from-blue-50 to-purple-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            A Better Way to Plan Your Day
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Zone-based planning that honors both your productivity and your humanity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zone-Based Planning</h3>
              <p className="text-gray-600">
                Organize your day into purposeful zones: Deep Work, Quick Wins, Recharge, and more. Each zone serves a specific purpose.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track What Matters</h3>
              <p className="text-gray-600">
                Log progress on projects, hobbies, events. Capture joys and memories. Learn from daily reflections.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Built for Balance</h3>
              <p className="text-gray-600">
                Productivity zones + wellness zones = sustainable planning. Work hard, rest well, find joy daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Everything You Need in One Place
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Deep Work Zone */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Deep Work Zone</h3>
              <p className="text-sm text-gray-600">Focus on high-impact work with time blocking and detailed notes.</p>
            </div>

            {/* Activity Log */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 transition-colors">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Activity Log</h3>
              <p className="text-sm text-gray-600">Track ongoing projects, hobbies, and events with daily updates.</p>
            </div>

            {/* Recharge Zone */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 transition-colors">
              <div className="text-4xl mb-3">🔋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recharge Zone</h3>
              <p className="text-sm text-gray-600">Plan breaks and wellness activities to maintain your energy.</p>
            </div>

            {/* Little Joys */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-400 transition-colors">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Little Joys</h3>
              <p className="text-sm text-gray-600">Capture positive moments from your day to build gratitude.</p>
            </div>

            {/* Core Memories */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-pink-400 transition-colors">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Core Memories</h3>
              <p className="text-sm text-gray-600">Save meaningful moments tied to specific dates for reflection.</p>
            </div>

            {/* Reflection */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-400 transition-colors">
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Reflection</h3>
              <p className="text-sm text-gray-600">Learn and grow from daily insights and accomplishments.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/features"
              className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
            >
              Explore All Features →
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Who It's For
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Whether you're crushing deadlines, building projects, or juggling life—this is for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Professionals</h3>
              <p className="text-gray-600 mb-4">
                Balance deep work with energy management. Structure your day for maximum impact without burning out.
              </p>
              <div className="text-sm text-gray-500">
                ✓ Time-blocked tasks<br />
                ✓ Energy tracking<br />
                ✓ Daily reflections
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Creators & Hobbyists</h3>
              <p className="text-gray-600 mb-4">
                Track guitar practice, art projects, or garden progress. See your journey and stay consistent.
              </p>
              <div className="text-sm text-gray-500">
                ✓ Activity tracking<br />
                ✓ Progress logging<br />
                ✓ Memory capture
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Parents & Caregivers</h3>
              <p className="text-gray-600 mb-4">
                Juggle responsibilities while making time for yourself. Find joy in the chaos and track what matters.
              </p>
              <div className="text-sm text-gray-500">
                ✓ Flexible planning<br />
                ✓ Self-care zones<br />
                ✓ Gratitude practice
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            What You'll Gain
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3 items-start">
              <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
              <p className="text-lg text-gray-700">Start each day with clarity, not chaos</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
              <p className="text-lg text-gray-700">Finish tasks without sacrificing your wellbeing</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
              <p className="text-lg text-gray-700">Make real progress on personal projects and hobbies</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
              <p className="text-lg text-gray-700">Build habits of reflection and gratitude</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
              <p className="text-lg text-gray-700">See patterns and growth over time</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
              <p className="text-lg text-gray-700">Never lose track of what brings you joy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Trust */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy-First & Secure
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            We believe your plans and memories belong to you. Period.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex gap-4 items-start">
              <span className="text-3xl flex-shrink-0">🔒</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Securely stored with authentication</h3>
                <p className="text-sm text-gray-600">Your data is protected with secure authentication and encryption.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="text-3xl flex-shrink-0">🚫</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">No tracking or ads</h3>
                <p className="text-sm text-gray-600">We don't sell your data or show you ads. Built for you, not advertisers.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="text-3xl flex-shrink-0">🎯</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Built for you</h3>
                <p className="text-sm text-gray-600">Not advertisers, not data brokers. Just you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Plan with Purpose?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start finding balance between productivity and wellbeing today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-lg"
            >
              Start Your First Day
            </Link>
            <Link
              href="/features"
              className="inline-block bg-transparent hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-lg"
            >
              Learn More
            </Link>
          </div>

          <p className="text-sm mt-6 opacity-75">No credit card required • Free forever</p>
        </div>
      </section>
    </div>
  );
}

