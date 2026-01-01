import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Why I Stopped Planning My Entire Week (And Started Getting More Done)',
    description: 'Weekly planning sounds great in theory, but here\'s why daily planning might be the better move for most people.',
    openGraph: {
        title: 'Why I Stopped Planning My Entire Week',
        description: 'Controversial take: weekly planning might be killing your productivity',
    },
}

export default function BlogPost() {
    return (
        <article className="max-w-3xl mx-auto px-6 py-12">
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-2">
                ← Back to blog
            </Link>

            <header className="mb-8">
                <div className="flex items-center gap-3 mb-4 text-sm">
                    <span className="font-medium text-blue-600">Planning</span>
                    <span className="text-gray-400">•</span>
                    <time className="text-gray-500">December 28, 2025</time>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">5 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    Why I Stopped Planning My Entire Week (And Started Getting More Done)
                </h1>
            </header>

            <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Sunday night. You've got your coffee, your favorite notebook, and you're feeling optimistic. This week is going to be different. You're going to plan everything out perfectly.
                </p>

                <p>
                    Fast forward to Wednesday afternoon. Your carefully crafted weekly plan? Completely useless. That "2-hour deep work block" got hijacked by an emergency meeting. The project you blocked Thursday morning for got pushed to next week. And don't even get me started on Friday's schedule.
                </p>

                <p>
                    Sound familiar?
                </p>

                <p>
                    Yeah. Me too.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    The Weekly Planning Trap
                </h2>

                <p>
                    Here's what nobody tells you about weekly planning: <strong>life doesn't work in neat seven-day increments.</strong>
                </p>

                <p>
                    I spent years—<em>years</em>—trying to make weekly planning work. Different systems, different apps, different notebooks. That fancy bullet journal everyone swore by. Those productivity apps with all the features. Even good old pen and paper.
                </p>

                <p>
                    The problem wasn't my execution. It was the entire concept.
                </p>

                <p>
                    Think about it. When you're planning on Sunday for what you'll do Friday, you're basically making decisions with zero actual information. You don't know:
                </p>

                <ul className="space-y-2 my-6">
                    <li>What fires you'll need to put out</li>
                    <li>How you'll actually feel Thursday morning (spoiler: probably tired)</li>
                    <li>What your boss will suddenly decide is urgent</li>
                    <li>Whether you'll sleep terribly Wednesday night and be useless Thursday</li>
                    <li>If that "important project" will even still be relevant by midweek</li>
                </ul>

                <p>
                    So you end up spending time planning things that will never happen, then feeling guilty when reality doesn't match your perfect plan.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What I Do Instead
                </h2>

                <p>
                    I switched to daily planning, and honestly? It's been a game-changer.
                </p>

                <p>
                    Every morning (or the night before, if I'm feeling organized), I spend 5-10 minutes planning just that day. Not the whole week. Not tomorrow. Just today.
                </p>

                <p>
                    Here's what this looks like for me:
                </p>

                <p className="font-semibold mt-6">
                    1. I look at what actually needs to happen
                </p>
                <p>
                    Not what I wish would happen. What actually has to get done today—meetings, deadlines, the non-negotiables.
                </p>

                <p className="font-semibold mt-6">
                    2. I pick 1-2 deep work priorities
                </p>
                <p>
                    Notice I said 1-2. Not five. Not "everything that's important." Just the things that would make today feel successful.
                </p>

                <p className="font-semibold mt-6">
                    3. I list out quick wins
                </p>
                <p>
                    These are the small tasks that take 15 minutes or less. Responding to that email. Calling the dentist. Actual achievable stuff.
                </p>

                <p className="font-semibold mt-6">
                    4. I acknowledge my recharge time
                </p>
                <p>
                    This is the part everyone skips and then wonders why they're burned out by 2 PM. I remind myself I need lunch, a walk, time to just stare out the window. My brain knows when to take these breaks—I just need to give myself permission.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    But Wait, What About Long-Term Goals?
                </h2>

                <p>
                    Good question. I'm not saying don't think about the future. I keep a running list of projects and priorities. But I only commit to what I'm doing <em>today</em>.
                </p>

                <p>
                    It's like the difference between planning your entire vacation itinerary minute-by-minute versus knowing generally what you want to see and deciding each morning what you're in the mood for. The second approach is way more enjoyable and you still see everything important.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    The Results
                </h2>

                <p>
                    Since switching to daily planning:
                </p>

                <ul className="space-y-2 my-6">
                    <li>I actually stick to my plans (because they're realistic)</li>
                    <li>I feel less guilty when things change (because I'm only replanning one day, not a whole week)</li>
                    <li>I'm more present in what I'm doing right now</li>
                    <li>I remember my days better—not just what I worked on, but the fun stuff and how I felt</li>
                    <li>When I look back at my week or month, I can actually see what I did instead of wondering where the time went</li>
                </ul>

                <p>
                    That last one surprised me. When you plan daily and track what actually happened, you realize time isn't flying away—you're just not paying attention to it. Looking back at what you did, especially the non-work stuff, makes time feel slower and more meaningful.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    Try This Tomorrow
                </h2>

                <p>
                    Here's my challenge to you: forget about next week for a minute. Just plan tomorrow.
                </p>

                <p>
                    Take 10 minutes tonight. Look at what you need to do. Pick your top 2 priorities. List a few quick wins. Acknowledge you'll need breaks. That's it.
                </p>

                <p>
                    See how it feels to wake up with a clear, achievable plan that's based on reality, not optimism.
                </p>

                <p>
                    Then do it again the next day. And the next.
                </p>

                <p className="text-lg font-medium mt-8">
                    You might find, like I did, that planning less actually helps you accomplish more.
                </p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600">
                        <strong>Want to try daily planning?</strong> Mindful Planner lets you plan your day in 5 minutes, then look back at your week, month, or year to see what you actually did. Not just work—the fun stuff, the recharge time, everything. It's kind of amazing to see your life instead of feeling like time just disappeared.{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Try it free
                        </Link>
                    </p>
                </div>
            </div>
        </article>
    )
}
