import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const metadata: Metadata = {
    title: 'The Guilt-Free Guide to Taking Breaks - Mindful Planner Blog',
    description: 'Why do we feel terrible about resting? Here\'s how to take breaks without the anxiety spiral that usually comes with them.',
    openGraph: {
        title: 'The Guilt-Free Guide to Taking Breaks',
        description: 'Stop feeling bad about resting. Here\'s why breaks make you more productive, not less.',
    },
}

export default function BlogPost() {
    return (
        <article className="max-w-3xl mx-auto px-6 py-12">
            <Breadcrumbs items={[
                { label: 'Blog', href: '/blog' },
                { label: 'The Guilt-Free Guide to Taking Breaks', href: '/blog/productivity-guilt' }
            ]} />

            <Link href="/blog" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-2">
                ← Back to blog
            </Link>

            <header className="mb-8">
                <div className="flex items-center gap-3 mb-4 text-sm">
                    <span className="font-medium text-blue-600">Wellness</span>
                    <span className="text-gray-400">•</span>
                    <time className="text-gray-500">December 15, 2025</time>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">7 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    The Guilt-Free Guide to Taking Breaks
                </h1>
            </header>

            <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    You're tired. You've been working for 2 hours straight. Your brain feels like mush. You know you should take a break.
                </p>

                <p>
                    But instead, you keep going. Because taking a break feels lazy. Irresponsible. Like you're falling behind while everyone else keeps grinding.
                </p>

                <p>
                    And if you do take a break? You spend the whole time feeling guilty about it, which kind of defeats the purpose.
                </p>

                <p>
                    Yeah, I've been there. Many, many times.
                </p>

                <p>
                    Let's talk about why this is completely backwards and how to actually take breaks without spiraling into "I'm lazy and everyone else is more productive than me" thoughts.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    Where This Guilt Comes From
                </h2>

                <p>
                    First, let's acknowledge that this isn't just you being dramatic. (Though I've definitely told myself that.) There are real reasons we feel guilty about resting:
                </p>

                <p>
                    <strong>Hustle culture is everywhere.</strong> Every social media post shows someone waking up at 4 AM to work on their side hustle. Rest is treated like a dirty word. If you're not grinding, you're losing.
                </p>

                <p>
                    <strong>We confuse motion with progress.</strong> Sitting at your desk feels productive even when you're accomplishing nothing. Taking a walk feels unproductive even though it might help you solve that problem you've been stuck on for an hour.
                </p>

                <p>
                    <strong>Nobody taught us how to rest.</strong> Seriously. We learn time management, task management, energy management maybe. But rest management? That's not a thing, apparently.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    The Actually Scientific Reason You Need Breaks
                </h2>

                <p>
                    Here's what productivity bros conveniently forget to mention: <strong>your brain physically cannot maintain focus indefinitely.</strong> Like, it's actually impossible.
                </p>

                <p>
                    There's this thing called "directed attention fatigue." Fancy name, simple concept: the part of your brain responsible for focus gets tired. Just like your muscles get tired at the gym. Or how your eyes get tired staring at a screen. It's not a character flaw—it's biology.
                </p>

                <p>
                    When you're mentally exhausted but keep pushing, you're not being productive. You're being counterproductive. You make more mistakes. You miss important details. You take twice as long to do things that should be quick.
                </p>

                <p>
                    It's like trying to drive a car with an empty gas tank. Sure, you can push it forward, but wouldn't it be smarter to just refuel?
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What Actually Counts as a Break
                </h2>

                <p>
                    Here's where people mess this up. Scrolling Instagram is not a break. Checking email is not a break. Reading work-related articles is not a break.
                </p>

                <p>
                    A real break gives your brain a chance to actually rest. Here's what that looks like:
                </p>

                <p className="font-semibold mt-6">
                    Micro breaks (5-10 minutes)
                </p>
                <ul className="space-y-2 my-4">
                    <li>Stand up and stretch</li>
                    <li>Look out the window (seriously, this helps)</li>
                    <li>Make tea or coffee</li>
                    <li>Do literally nothing for 5 minutes</li>
                </ul>

                <p className="font-semibold mt-6">
                    Real breaks (15-30 minutes)
                </p>
                <ul className="space-y-2 my-4">
                    <li>Go for a walk outside</li>
                    <li>Actually eat lunch (not at your desk)</li>
                    <li>Call a friend</li>
                    <li>Take a power nap if that's your thing</li>
                </ul>

                <p className="font-semibold mt-6">
                    Extended breaks (1+ hours)
                </p>
                <ul className="space-y-2 my-4">
                    <li>Exercise</li>
                    <li>Hobby time</li>
                    <li>Social stuff</li>
                    <li>Whatever recharges you</li>
                </ul>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    How I Learned to Take Breaks Without Guilt
                </h2>

                <p>
                    This took me way too long to figure out, but here's what worked:
                </p>

                <p className="font-semibold mt-6">
                    1. I acknowledged them as part of my day
                </p>
                <p>
                    Instead of treating breaks as "stolen time," I started seeing them as legitimate parts of my day. When you plan your day and include "I'll need to recharge," it's not laziness—it's realistic planning.
                </p>

                <p className="font-semibold mt-6">
                    2. I tracked what happened after breaks
                </p>
                <p>
                    Turns out, after a 15-minute walk, I'd solve problems in 20 minutes that I'd been struggling with for an hour. After lunch away from my desk, my afternoon was way more productive. Data doesn't lie.
                </p>

                <p className="font-semibold mt-6">
                    3. I reframed what "productive" means
                </p>
                <p>
                    If taking a break means I do better work afterwards, then the break itself is productive. It's part of the work, not separate from it.
                </p>

                <p className="font-semibold mt-6">
                    4. I stopped comparing myself to highlight reels
                </p>
                <p>
                    That person posting about their 12-hour workday? You don't see them burning out three weeks later. You don't see the quality of their work. You're comparing your reality to someone else's carefully curated image.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    A Simple Break System That Works
                </h2>

                <p>
                    Here's what I actually do now:
                </p>

                <p>
                    <strong>Every 60-90 minutes:</strong> Stand up, stretch, look away from the screen. Maybe grab water. 5 minutes max.
                </p>

                <p>
                    <strong>Mid-morning and mid-afternoon:</strong> Leave my workspace entirely. Walk around outside if possible. 10-15 minutes.
                </p>

                <p>
                    <strong>Lunch:</strong> Actual lunch break. Away from my desk. Not working. 30 minutes minimum.
                </p>

                <p>
                    <strong>After work:</strong> Hard stop. No "just checking email." I'm done, and my brain needs to recover.
                </p>

                <p>
                    Does this mean I work less? Technically yes, in terms of hours. But I get more done in focused time than I used to in longer, exhausted time.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What If Your Job Doesn't Allow Breaks?
                </h2>

                <p>
                    Real talk: some jobs genuinely don't give you flexibility. If you're in retail, healthcare, teaching, or any role where you can't just step away—I get it.
                </p>

                <p>
                    But even then, there are micro-moments: Take your actual lunch break instead of powering through. Use your bathroom breaks to take three deep breaths. Focus on eyes-closed rest during your commute if you're not driving.
                </p>

                <p>
                    And honestly? If your job literally doesn't let you rest at all, that's not sustainable and you might need to think about whether it's worth the burnout.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    The Permission You Needed
                </h2>

                <p>
                    You don't need to earn rest. You don't need to be "productive enough" to deserve a break.
                </p>

                <p>
                    Rest is not a reward for working hard. It's a requirement for working well.
                </p>

                <p>
                    Your brain needs downtime to process information, make connections, and recover attention. This isn't optional biology—it's how humans work.
                </p>

                <p>
                    Here's something else: years from now, you won't remember that Tuesday you worked 10 hours straight. But you'll remember the afternoon you took a walk and had that random insight. You'll remember how you felt when you gave yourself permission to rest.
                </p>

                <p>
                    <strong>We remember the feelings more than the tasks.</strong> And breaks? They create good feelings. They're not wasted time—they're the moments that make your days worth remembering.
                </p>

                <p className="text-lg font-medium mt-8">
                    So take the break. Not "someday when you're less busy," but today. Right now, actually. You'll do better work afterwards anyway.
                </p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600">
                        <strong>Need help remembering to take breaks?</strong> Mindful Planner treats your recharge time, hobbies, and fun stuff as seriously as your work. Plan your whole day—work and life—then look back at your week to see all the moments you actually lived, not just the tasks you completed.{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Give it a try
                        </Link>
                    </p>
                </div>
            </div>
        </article>
    )
}
