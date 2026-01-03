import Link from "next/link";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Mindful Daily Planner — Balance Productivity & Wellness',
  description: 'Plan your day with purpose, not pressure. A daily planner that balances productivity with wellbeing. Track deep work, quick wins, recharge, and joy.',
  alternates: {
    canonical: baseUrl,
  },
}

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  // JSON-LD for Homepage
  const homepageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mindful Daily Planner',
    url: baseUrl,
    description: 'A daily planner that balances productivity with wellbeing',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Plan Your Day with Purpose,<br />Not Pressure
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A daily planner that balances productivity with wellbeing. Plan, document, and reflect on your life—work, hobbies, memories, and growth.
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

            <p className="text-sm text-gray-500">Free to start • Your data stays private</p>
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">Plan Your Day</h3>
                <p className="text-gray-600">
                  Organize your day into purposeful zones: Deep Work, Quick Wins, Recharge, and more. Plan with intention, not just to-dos.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Document Your Life</h3>
                <p className="text-gray-600">
                  Capture progress on projects, hobbies, and goals. Preserve joys and memories. Build a record of your journey.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reflect & Grow</h3>
                <p className="text-gray-600">
                  Learn from daily insights. Track patterns over time. Celebrate wins and learn from challenges.
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
              {/* Quick Wins */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-400 transition-colors">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Wins</h3>
                <p className="text-sm text-gray-600">Plan and complete small daily victories that build momentum.</p>
              </div>

              {/* Deep Work */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 transition-colors">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Deep Work</h3>
                <p className="text-sm text-gray-600">Schedule and document focused work sessions on meaningful projects.</p>
              </div>

              {/* Little Joys */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-pink-400 transition-colors">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Little Joys</h3>
                <p className="text-sm text-gray-600">Capture life's simple pleasures and build a gratitude practice.</p>
              </div>

              {/* Recharge Zones */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-cyan-400 transition-colors">
                <div className="text-4xl mb-3">🌊</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Recharge Zones</h3>
                <p className="text-sm text-gray-600">Plan self-care and wellness activities to maintain your energy.</p>
              </div>

              {/* Core Memories */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-400 transition-colors">
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Core Memories</h3>
                <p className="text-sm text-gray-600">Preserve meaningful moments and milestones in your life journey.</p>
              </div>

              {/* Reflections */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 transition-colors">
                <div className="text-4xl mb-3">💭</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Reflections</h3>
                <p className="text-sm text-gray-600">Journal your insights, lessons learned, and personal growth.</p>
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
                  Document guitar practice, art projects, or garden progress. See your journey unfold and stay consistent.
                </p>
                <div className="text-sm text-gray-500">
                  ✓ Project documentation<br />
                  ✓ Progress tracking<br />
                  ✓ Memory preservation
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Parents & Caregivers</h3>
                <p className="text-gray-600 mb-4">
                  Plan around responsibilities while making time for yourself. Capture joy in the chaos and document what matters.
                </p>
                <div className="text-sm text-gray-500">
                  ✓ Flexible planning<br />
                  ✓ Self-care scheduling<br />
                  ✓ Memory capture
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
                <p className="text-lg text-gray-700">Plan each day with clarity and intention</p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                <p className="text-lg text-gray-700">Document your journey as it unfolds</p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                <p className="text-lg text-gray-700">Make real progress on projects and hobbies</p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                <p className="text-lg text-gray-700">Build habits of reflection and gratitude</p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                <p className="text-lg text-gray-700">Track patterns and celebrate growth over time</p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                <p className="text-lg text-gray-700">Preserve memories and moments that matter</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Join thousands finding balance between productivity and wellbeing
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex gap-1 mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Finally, a planner that doesn't make me feel guilty for taking breaks. The recharge zones feature is a game-changer for my mental health."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-600">Software Engineer</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex gap-1 mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I've tried every productivity app out there. This is the first one that actually helps me track my personal projects alongside work tasks."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Michael R.</p>
                    <p className="text-sm text-gray-600">Freelance Designer</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex gap-1 mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The daily reflection feature has transformed how I approach my goals. I actually pause and think about what went well, not just what's next."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                    J
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jessica L.</p>
                    <p className="text-sm text-gray-600">Marketing Manager</p>
                  </div>
                </div>
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

            <p className="text-sm mt-6 opacity-75">Free to start</p>
          </div>
        </section>
      </div>
    </>
  );
}

