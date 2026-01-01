import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'My Morning Routine (The Real Version) - Mindful Planner Blog',
    description: 'No cold plunges, no 5 AM wake-ups. Here\'s what a realistic morning routine looks like for people with actual lives.',
    openGraph: {
        title: 'My Morning Routine (The Real Version)',
        description: 'A morning routine that doesn\'t require being a superhuman',
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
                    <span className="font-medium text-blue-600">Habits</span>
                    <span className="text-gray-400">•</span>
                    <time className="text-gray-500">December 10, 2025</time>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">5 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    My Morning Routine (The Real Version)
                </h1>
            </header>

            <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    I'm not going to lie to you. I don't wake up at 5 AM. I don't meditate for an hour. I definitely don't take cold showers, journal for 30 minutes, and hit the gym before most people are awake.
                </p>

                <p>
                    If that's your thing, great. But that's not reality for most of us. And honestly? You don't need a Silicon Valley CEO morning routine to have a good day.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What Morning Routines Look Like on Instagram
                </h2>

                <p>
                    Let me paint you a picture you've probably seen before:
                </p>

                <p className="italic bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 my-6">
                    "Wake up at 4:30 AM. 20 minutes of meditation. Cold shower. Green smoothie. 60 minutes of reading. Gym session. Journaling. Plan my entire day. Check email. All before 8 AM. Rise and grind! 💪"
                </p>

                <p>
                    Cool story. But let me tell you what my morning actually looks like, and I'm betting it's closer to yours:
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    My Actual Morning Routine
                </h2>

                <p>
                    <strong>6:45 AM:</strong> My alarm goes off. I hit snooze once. Sometimes twice. Okay, usually twice. I'm human.
                </p>

                <p>
                    <strong>7:00 AM:</strong> Actually drag myself out of bed. Make coffee. This is non-negotiable—I'm not even attempting to be functional without caffeine. Not happening.
                </p>

                <p>
                    <strong>7:15 AM:</strong> While the coffee's brewing, I do maybe 5 minutes of stretching. Nothing fancy. Just touching my toes, rolling my shoulders, maybe some cat-cows if I'm feeling it. Whatever my body needs after sleeping in some weird position.
                </p>

                <p>
                    <strong>7:20 AM:</strong> Sit with my coffee and plan my day. This takes maybe 10 minutes. I think about what needs to happen, decide what my top priorities are, and that's it. Not rocket science.
                </p>

                <p>
                    And here's the thing—I'm not planning to be productive for 10 hours. I plan for maybe 5-6 hours of real work, plus breaks, plus time for stuff that's actually enjoyable. Because that's reality. Nobody's actually productive for their entire workday, no matter what they post on LinkedIn.
                </p>

                <p>
                    <strong>7:30 AM:</strong> Shower (regular temperature, thanks), get dressed.
                </p>

                <p>
                    <strong>8:00 AM:</strong> Breakfast. Sometimes it's eggs. Sometimes it's cereal. Sometimes it's leftover pizza. Sometimes it's just more coffee and calling it good. I'm not a food influencer, and I'm definitely not making elaborate smoothie bowls.
                </p>

                <p>
                    <strong>8:30 AM:</strong> Start work.
                </p>

                <p>
                    That's it. That's the whole routine.
                </p>

                <p>
                    Total time? About 90 minutes from alarm to actually working. And honestly, most of that is just... normal human stuff. Showering. Eating. Becoming conscious. Revolutionary, I know.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What Actually Matters
                </h2>

                <p>
                    Here's what I learned after trying a million different morning routines: the specific activities don't matter that much. What matters is having some structure and doing a few things that set you up for success.
                </p>

                <p>
                    For me, those things are:
                </p>

                <p className="font-semibold mt-6">
                    1. Not checking my phone immediately
                </p>
                <p>
                    I used to wake up and immediately scroll through emails and social media. That's a terrible idea. Starting your day reacting to other people's priorities is a recipe for anxiety.
                </p>

                <p>
                    Now my phone stays on my dresser until after I've had coffee and planned my day. This one change made a bigger difference than any productivity hack I've tried.
                </p>

                <p className="font-semibold mt-6">
                    2. Moving my body somehow
                </p>
                <p>
                    I'm not talking about an intense workout (though if that's your jam, cool). Just moving. Stretching. Maybe a quick walk if I have time. Getting blood flowing helps my brain wake up.
                </p>

                <p className="font-semibold mt-6">
                    3. Planning before reacting
                </p>
                <p>
                    Those 10 minutes planning my day are probably the most valuable 10 minutes of my entire morning. It's the difference between being intentional and just bouncing from one thing to another all day.
                </p>

                <p className="font-semibold mt-6">
                    4. Eating something
                </p>
                <p>
                    Look, I get that intermittent fasting is trendy. But my brain doesn't work well when I'm hungry, so I eat breakfast. Revolutionary, I know.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    What I Don't Do (And Why It's Fine)
                </h2>

                <p>
                    <strong>I don't wake up at 5 AM.</strong> I tried this. I was exhausted by 2 PM every day. Turns out, sleep is important. Who knew?
                </p>

                <p>
                    <strong>I don't meditate for 30 minutes.</strong> I've got nothing against meditation, but 30 minutes first thing in the morning? I can barely sit still for 5. And that's okay.
                </p>

                <p>
                    <strong>I don't work out every morning.</strong> Some people love morning workouts. I'm not one of them. I exercise after work. There's no law that says it has to be in the morning.
                </p>

                <p>
                    <strong>I don't journal extensively.</strong> My "journaling" is planning my day in Mindful Planner and occasionally jotting down thoughts. That's enough for me.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    How to Build Your Own Routine
                </h2>

                <p>
                    Stop trying to copy someone else's morning routine. Seriously. What works for a tech CEO with a personal chef and no kids is not going to work for you.
                </p>

                <p>
                    Instead, ask yourself:
                </p>

                <ul className="space-y-2 my-6">
                    <li><strong>What time do I naturally wake up?</strong> Work with your biology, not against it.</li>
                    <li><strong>What do I absolutely need to function?</strong> Coffee? Shower? 10 minutes of silence? Start there.</li>
                    <li><strong>What makes me feel good?</strong> Not what should make you feel good—what actually does.</li>
                    <li><strong>What's realistic given my life?</strong> Kids? Long commute? Early meetings? Design around reality.</li>
                </ul>

                <p>
                    Then just string those things together in an order that makes sense. That's your routine.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">
                    The Only Morning Routine "Rule"
                </h2>

                <p>
                    If I had to give you one rule, it would be this: <strong>control the first hour of your day before letting the world control the rest of it.</strong>
                </p>

                <p>
                    That doesn't mean you need an elaborate 2-hour routine. It just means starting your day intentionally rather than reactively.
                </p>

                <p>
                    Maybe that's 15 minutes with coffee and your thoughts. Maybe it's a walk around the block. Maybe it's planning your day. Whatever works for you.
                </p>

                <p>
                    The point is: you decide how your day starts. Not your email inbox. Not social media. You.
                </p>

                <p>
                    And here's something else: years from now, you won't remember the morning you crushed your perfect 90-minute routine. But you'll remember the morning you had that great conversation over coffee. You'll remember how you felt when you gave yourself permission to sleep in after a rough week. Those moments? They matter more than following someone else's checklist.
                </p>

                <p className="text-lg font-medium mt-8">
                    That's it. That's the secret to morning routines. Make it work for your life, not someone else's Instagram feed.
                </p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600">
                        <strong>Want to make morning planning easier?</strong> Mindful Planner makes it quick to plan your day—usually under 10 minutes. Then at the end of the week, you can look back and see what you actually did. Turns out, you're accomplishing more than you think, and those morning coffees? They count too.{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Try it free
                        </Link>
                    </p>
                </div>
            </div>
        </article>
    )
}
