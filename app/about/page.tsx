'use client';

import { Card } from '@/components/Common';

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
                                I tried them all. <strong>To-do lists</strong> that felt like endless obligation machines. <strong>Time-grid planners</strong> that turned my days into rigid prisons. Both promised productivity, but neither understood what I actually needed.
                            </p>
                            <p>
                                To-do lists reduced my life to checkboxes—no context, no meaning, just an ever-growing list that made me feel perpetually behind. Time-grid planners sliced my day into tiny blocks, as if I were a factory worker on an assembly line.
                            </p>
                            <p>
                                <strong>Neither helped me stay focused on what truly mattered. Neither tracked the progress I was actually proud of. Neither captured the moments worth remembering.</strong>
                            </p>
                            <p>
                                So I built Mindful Planner. Not another task manager. Not another calendar grid. A <strong>purpose-driven planning system</strong> for people who want to accomplish meaningful work <em>and</em> live a full life.
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
                                    We don't ask you to manage 47 tasks. We help you identify 1-2 deep work priorities, a handful of quick wins, and one thing you've been avoiding. This isn't about doing everything. It's about doing what matters.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="text-2xl">📈</span>
                                    Progress Over Perfection
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    Life happens beyond work. We give you space to track ongoing projects and hobbies—learning guitar, building a garden, whatever matters to you. Progress on your side project deserves as much attention as your work tasks.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="text-2xl">💫</span>
                                    Meaning Over Motion
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    Productivity tools forget you're human. We don't. Every day includes recharge activities, little joys, core memories, and reflection. We measure success not just in tasks completed, but in days well-lived.
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Who It's For</h2>
                        <p className="text-gray-700 mb-4">
                            Mindful Planner is for people who are tired of planning tools that overwhelm or constrain. If any of these sound like you, you're in the right place:
                        </p>
                        <div className="space-y-3 text-gray-700 text-sm">
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>"I'm always busy but never feel like I'm making progress on what matters"</p>
                            </div>
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>"To-do lists make me anxious, but I need some structure"</p>
                            </div>
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>"I keep abandoning my hobbies because I can't track them"</p>
                            </div>
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>"I wish I could remember the good moments, not just the tasks"</p>
                            </div>
                            <div className="flex gap-2">
                                <span>→</span>
                                <p>"I'm tired of planning tools that treat me like a productivity robot"</p>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-gray-700 mb-4">
                            Have questions, feedback, or just want to share your story? I'd love to hear from you.
                        </p>
                        <div className="space-y-2 text-sm">
                            <p>
                                📧 Email: <a href="mailto:hello@mindfulplanner.com" className="text-blue-600 hover:underline">hello@mindfulplanner.com</a>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
