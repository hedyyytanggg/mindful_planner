import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const metadata: Metadata = {
    title: 'How I\'m Planning 2026 (Without the New Year Pressure)',
    description: 'Forget massive resolutions. Here\'s a more sustainable way to approach the new year that actually works.',
    openGraph: {
        title: 'How I\'m Planning 2026 (Without the New Year Pressure)',
        description: 'A realistic approach to new year planning that won\'t burn you out by February',
    },
}

export default function BlogPost() {
    return (
        <article className="max-w-3xl mx-auto px-6 py-12">
            <Breadcrumbs items={[
                { label: 'Blog', href: '/blog' },
                { label: 'How I\'m Planning 2026', href: '/blog/planning-2026-without-pressure' }
            ]} />

            <Link href="/blog" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-2">
                ← Back to blog
            </Link>

            <header className="mb-8">
                <div className="flex items-center gap-3 mb-4 text-sm">
                    <span className="font-medium text-blue-600">Reflection</span>
                    <span className="text-gray-400">•</span>
                    <time className="text-gray-500">December 31, 2025</time>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">7 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    How I'm Planning 2026 (Without the New Year Pressure)
                </h1>
            </header>

            <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    It's New Year's Eve. Everyone's posting about their ambitious 2026 goals. "This year I'm going to wake up at 5 AM, read 100 books, launch a side hustle, get abs, learn Spanish, and finally become a morning person."
                </p>

                <p>
                    And you know what? That energy is beautiful. It really is. There's something hopeful about a fresh start.
                </p>

                <p>
                    But I've learned that massive January resolutions often lead to February burnout. Not because we're lazy or undisciplined—but because we're trying to change everything at once while still living our actual lives.
                </p>

                <p>
                    I've been that person. Multiple times. The excited January version of me who makes elaborate plans, followed by the overwhelmed March version wondering what went wrong.
                </p>

                <p>
                    So this year? I'm trying something different.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    The Problem With New Year Resolutions
                </h2>

                <p>
                    Here's what typically happens: December 31st, you look at your year and feel like you didn't accomplish enough. (Even though you probably accomplished a ton—you just don't remember because you didn't track it.)
                </p>

                <p>
                    So naturally, we compensate. We create this elaborate plan for transformation. We're going to be a completely different person by next December.
                </p>

                <p>
                    The plan looks amazing on paper. But it usually requires us to suddenly have 10 extra hours per day, unlimited willpower, and zero unexpected life events. And that's just not realistic.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
                    Reality Check: You Still Have The Same 24 Hours
                </h3>

                <p>
                    The calendar changed. You didn't suddenly gain more time or energy. You still have the same job, same responsibilities, same baseline energy levels.
                </p>

                <p>
                    And here's the uncomfortable truth: <strong>you can realistically be productive for maybe 5-6 hours a day.</strong> Not 12. Not 8. Around 5-6 hours of focused work, max.
                </p>

                <p>
                    The rest of your day? That's meals, breaks, exercise, socializing, chores, and—this is important—the fun stuff that makes life worth living.
                </p>

                <p>
                    So when you're planning 2026, plan for the person you actually are, not the optimized robot you wish you were.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What I'm Doing Instead
                </h2>

                <p>
                    Instead of massive resolutions, I'm asking different questions:
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
                    1. What Do I Actually Want to Remember About 2026?
                </h3>

                <p>
                    Not accomplish. <em>Remember.</em>
                </p>

                <p>
                    When I think back on 2025, I don't remember all the tasks I completed. I remember the Saturday I spontaneously drove to the beach. The dinner where my friend told that ridiculous story. The afternoon I finally figured out that coding problem I'd been stuck on.
                </p>

                <p>
                    We remember feelings and moments more than accomplishments. So for 2026, I'm planning for memories, not just milestones.
                </p>

                <p>
                    This doesn't mean I'm not setting goals. It means I'm being intentional about <em>why</em> I want those goals. "Get promoted" is different from "I want to feel challenged and proud of my work." The second one gives you better daily direction.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
                    2. What Small Thing Could I Do Every Day?
                </h3>

                <p>
                    Forget massive transformation. What's one small thing that compounds?
                </p>

                <p>
                    For me, it's planning my day each morning. Takes maybe 5 minutes. I look at what needs to happen today, what I'm energized about, and what needs to recharge. That's it.
                </p>

                <p>
                    It sounds simple, but it's the difference between living intentionally and just reacting to whatever hits my inbox. And over a year? Those 5-minute mornings add up to a life I actually remember living.
                </p>

                <p>
                    Maybe for you it's:
                </p>

                <ul className="space-y-2 my-6">
                    <li>10 minutes of stretching</li>
                    <li>Writing 200 words</li>
                    <li>One programming problem</li>
                    <li>Checking in with a friend</li>
                    <li>30 minutes on your side project</li>
                </ul>

                <p>
                    Small. Realistic. Daily. That's how you actually change things.
                </p>

                <p>
                    And here's something I've learned: organize your day by energy, not just by time. You have different types of energy throughout the day—deep focus energy, quick-wins energy, recharge energy. When you plan with that in mind, everything feels more natural.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
                    3. How Will I Track What I'm Actually Doing?
                </h3>

                <p>
                    This is the part most people skip, and it's honestly why January feels so different from December.
                </p>

                <p>
                    Time feels like it's flying by because we don't pay attention to it. Days blur together. Weeks disappear. And suddenly it's June and you can't remember what you did in March.
                </p>

                <p>
                    So I'm tracking my days. Not obsessively—just noting what I worked on, what I did for fun, how I felt. The work stuff <em>and</em> the life stuff. Because when December 2026 rolls around, I want to look back at my year and actually <em>see</em> my life, not wonder where it went.
                </p>

                <p>
                    This isn't about productivity guilt or proving you did enough. It's about presence. It's about making your days feel real. When you can look back at your timeline and see your whole week, your whole month, your whole year—it changes how you experience time.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    My Actual 2026 Plan
                </h2>

                <p>
                    Here's what I'm committing to. It's not sexy, but it's realistic:
                </p>

                <div className="bg-gray-50 p-6 rounded-lg my-8 border-l-4 border-blue-600">
                    <p className="font-semibold mb-4">Daily:</p>
                    <ul className="space-y-2 mb-6">
                        <li>✅ 5 minutes of morning planning (what needs to happen, what I'm excited about)</li>
                        <li>✅ 5-6 hours of focused work (not 12—let's be real)</li>
                        <li>✅ Plan the fun stuff too (walks, hobbies, time with people I care about)</li>
                        <li>✅ Track both work and life—because the fun stuff is what makes days worth remembering</li>
                    </ul>

                    <p className="font-semibold mb-4">Weekly:</p>
                    <ul className="space-y-2 mb-6">
                        <li>✅ Review what I actually did (not just what I planned)</li>
                        <li>✅ Adjust next week based on reality, not fantasy</li>
                        <li>✅ Celebrate at least one win, no matter how small</li>
                    </ul>

                    <p className="font-semibold mb-4">Monthly:</p>
                    <ul className="space-y-2">
                        <li>✅ Look back at the whole month—work and life</li>
                        <li>✅ Notice what made me feel good vs. what drained me</li>
                        <li>✅ Make one small adjustment for next month</li>
                    </ul>
                </div>

                <p>
                    That's it. No massive goals. No extreme makeover. Just consistent, intentional days that add up to a year I'll actually remember.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What This Looks Like in Practice
                </h2>

                <p>
                    Let's say my goal is "get better at coding." Cool. But what does that actually mean on a Tuesday?
                </p>

                <p>
                    <strong>Old approach:</strong> "I'm going to code for 4 hours every morning!" (Lasts 2 weeks.)
                </p>

                <p>
                    <strong>New approach:</strong> "I'll solve one coding problem every morning, 30-45 minutes. That's realistic alongside my actual job."
                </p>

                <p>
                    One problem per day = 365 problems per year. That's significant progress. And it's sustainable because it works with my life, not against it.
                </p>

                <p>
                    Same with "read more books." Forget "read 100 books this year." How about "read for 20 minutes before bed"? You'll end up reading 20-30 books naturally without the pressure.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    The Part Nobody Talks About
                </h2>

                <p>
                    Here's what I learned from 2025, and it kind of surprised me: <strong>the goals you hit aren't always the ones that matter most.</strong>
                </p>

                <p>
                    I had this whole plan to launch a side project. Didn't happen. But I did help a friend build theirs, and we had an amazing time doing it. I learned just as much, and I have a great memory attached to it.
                </p>

                <p>
                    The rigid plan would've counted that as a failure. But when I look back at 2025? That's one of my favorite parts of the year.
                </p>

                <p>
                    So yeah, have goals. Make plans. But leave room for the unexpected good stuff. The spontaneous Saturday adventure. The random deep conversation. The pivot that leads somewhere better than your original plan.
                </p>

                <p>
                    Those moments matter more than any to-do list.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    Your Permission Slip for 2026
                </h2>

                <p>
                    If you need to hear this: you don't need to overhaul your entire life on January 1st.
                </p>

                <p>
                    You don't need to wake up at 5 AM or implement a 7-step morning routine.
                </p>

                <p>
                    You don't need to be productive for 12 hours a day. (Nobody actually is—we all have around 5-6 hours of real focus in us.)
                </p>

                <p>
                    You <em>can</em> plan for 5-6 productive hours mixed with breaks, fun stuff, and actual life.
                </p>

                <p>
                    You <em>can</em> track what you're doing so you remember your year instead of watching it disappear.
                </p>

                <p>
                    You <em>can</em> adjust your plans when life happens (because it will).
                </p>

                <p>
                    And you <em>can</em> measure success by more than just tasks completed—by how you felt, what you learned, who you connected with, what you enjoyed.
                </p>

                <p className="text-lg font-medium mt-8">
                    2026 doesn't need to be perfect. It just needs to be real.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    One Last Thing
                </h2>

                <p>
                    If you're reading this on December 31st, feeling that familiar pressure to have it all figured out by midnight—you don't.
                </p>

                <p>
                    Take a breath. Think about what you actually want from the next year. Not what you <em>should</em> want. What you <em>actually</em> want.
                </p>

                <p>
                    Then pick one small, sustainable thing to start with. Just one. You can always add more later.
                </p>

                <p>
                    And if you want to look back at 2026 and actually see where your time went? Track it. Plan your days. Review your weeks. It makes time feel real instead of feeling like it's evaporating.
                </p>

                <p>
                    Here's to a year that's memorable, sustainable, and actually yours.
                </p>

                <p className="text-lg font-medium mt-8 mb-4">
                    Happy New Year. Let's make 2026 count—realistically.
                </p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600">
                        <strong>Want to make 2026 count without the pressure?</strong> Mindful Planner is built around these exact ideas—realistic daily planning organized by energy level (deep work, quick wins, recharge), tracking both work and the fun stuff that makes life memorable, and a timeline view that lets you look back at your days, weeks, months, and year so time doesn't just disappear. Plan your day in 5 minutes each morning, then actually see where your year went. No massive resolutions. No guilt. Just a year you'll remember living.{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Start planning your year
                        </Link>
                    </p>
                </div>
            </div>
        </article>
    )
}
