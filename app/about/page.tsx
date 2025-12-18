import { Metadata } from 'next'
import { Card } from '@/components/Common';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
    title: 'About Us — The Story Behind Mindful Planner',
    description: 'Discover why we built Mindful Planner differently. A daily planning app that balances productivity with well-being, created for real people living real lives.',
    openGraph: {
        title: 'About Us — The Story Behind Mindful Planner',
        description: 'Learn about our philosophy: Focus over frenzy, progress over perfection, and wellbeing without guilt.',
        url: `${baseUrl}/about`,
        type: 'website',
    },
    alternates: {
        canonical: `${baseUrl}/about`,
    },
}

export default function AboutPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🧘 About Mindful Planner</h1>
                    <p className="text-gray-600">The story behind a different kind of planner</p>
                </div>

                <div className="space-y-6">
                    {/* Origin Story */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why I Built This</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>
                                I tried all the popular planning apps. The endless to-do lists made me anxious. The rigid time-blocking apps felt suffocating. None of them worked for how I actually live.
                            </p>
                            <p>
                                So I built something different. Mindful Planner helps you focus on what matters—whether that's crushing a work project, finally learning guitar, or remembering to actually enjoy your coffee break instead of scheduling through it.
                            </p>
                            <p>
                                It's a planner that gets it. Work is important. But so is taking a walk, calling a friend, and remembering that awesome sunset from last Tuesday. 🌅
                            </p>
                        </div>
                    </Card>

                    {/* Philosophy */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Philosophy</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="text-2xl">🎯</span>
                                    Focus Over Frenzy
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    Instead of managing 47 tasks (who has time for that?), we help you focus on 1-2 big priorities, knock out a few quick wins, and tackle that one thing you keep avoiding. Quality over quantity, friends.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="text-2xl">📈</span>
                                    Progress Over Perfection
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    Learning guitar? Growing succulents? Building that side project? Your personal stuff deserves just as much love as your work tasks. Track it all in one place without feeling guilty.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="text-2xl">💫</span>
                                    Meaning Over Motion
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    You're a whole person with needs beyond just getting things done. We built in space for recharge breaks, capturing little joys, saving memories, and actually reflecting. Success = tasks done + a life you enjoyed living.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* What Makes Us Different */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex gap-3">
                                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Zone-based structure that guides without constraining</p>
                                    <p className="text-sm">Deep Work, Quick Wins, Recharge—each zone serves a purpose</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Track projects, hobbies, and events alongside work</p>
                                    <p className="text-sm">Activity Log keeps you consistent on what you care about</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Capture joys and meaningful moments</p>
                                    <p className="text-sm">Little Joys and Core Memories help you remember what counts</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Built for balance, not burnout</p>
                                    <p className="text-sm">Productivity AND wellbeing in one system</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Core Values */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">🔒 Privacy-First</h3>
                                <p className="text-gray-700 text-sm">Your data is protected with secure authentication. No tracking, no ads, no selling your information.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">🌱 Human-Centered</h3>
                                <p className="text-gray-700 text-sm">Built for humans, not productivity machines. We honor your energy, your life, your whole self.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">💡 Purpose-Driven</h3>
                                <p className="text-gray-700 text-sm">Every feature asks: does this help you focus on what matters? If not, we don't build it.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">⚖️ Balance by Design</h3>
                                <p className="text-gray-700 text-sm">Work and wellness go hand in hand. Sustainable productivity, not hustle culture.</p>
                            </div>
                        </div>
                    </Card>

                    {/* Who It's For */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Is This For You?</h2>
                        <p className="text-gray-700 mb-4">
                            If any of these sound familiar, welcome home:
                        </p>
                        <div className="space-y-3 text-gray-700 text-sm">
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>You're busy AF but can't remember what you accomplished yesterday</p>
                            </div>
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>To-do lists stress you out, but you still need <em>some</em> structure</p>
                            </div>
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>Your hobbies keep getting abandoned because "work stuff"</p>
                            </div>
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>You want to remember the good stuff, not just check off tasks</p>
                            </div>
                        </div>
                    </Card>

                    {/* Version Info */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Version Information</h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Version:</span>
                                <span className="font-mono font-semibold">0.2.0 (Beta)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Release Date:</span>
                                <span>December 16, 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="text-blue-600 font-semibold">Active Development</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Latest Features:</span>
                                <span className="text-purple-600 font-semibold">Activity Log, Core Memories</span>
                            </div>
                        </div>
                    </Card>

                    {/* Contact */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's Chat!</h2>
                        <p className="text-gray-700 mb-4">
                            Questions? Ideas? Just want to say hi? I'm all ears! 👂
                        </p>
                        <div className="space-y-2 text-sm">
                            <p>
                                📧 Email: <a href="mailto:mindfulplanner8@gmail.com" className="text-blue-600 hover:underline">mindfulplanner8@gmail.com</a>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
