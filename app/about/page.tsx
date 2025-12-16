'use client';

import { Card } from '@/components/Common';

export default function AboutPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🧘 About Mindful Planner</h1>
                    <p className="text-gray-600">Learn more about our mission and vision</p>
                </div>

                <div className="space-y-6">
                    {/* Mission */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We believe that intentional planning leads to meaningful productivity. Mindful Planner is designed to help people structure their days with purpose, balance work with wellness, capture cherished moments, and build sustainable habits that lead to both achievement and well-being.
                        </p>
                    </Card>

                    {/* Vision */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-gray-700 leading-relaxed">
                            To create a world where people feel accomplished, focused, and balanced. We envision a planning tool that adapts to individual needs, respects your time, and helps you achieve your goals without sacrificing your well-being.
                        </p>
                    </Card>

                    {/* Values */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">🎯 Intentionality</h3>
                                <p className="text-gray-700 text-sm">Every feature is designed with purpose in mind.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">🧘 Mindfulness</h3>
                                <p className="text-gray-700 text-sm">We promote awareness and self-reflection.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">⚖️ Balance</h3>
                                <p className="text-gray-700 text-sm">Work and wellness go hand in hand.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">🔒 Privacy</h3>
                                <p className="text-gray-700 text-sm">Your data is yours. We respect your privacy.</p>
                            </div>
                        </div>
                    </Card>

                    {/* Team */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Mindful Planner was built by a passionate team of designers, developers, and productivity enthusiasts who believe that technology should serve people, not the other way around.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl">
                                    👨‍💼
                                </div>
                                <h3 className="font-semibold text-gray-900">Product Lead</h3>
                                <p className="text-sm text-gray-600">Strategy & Vision</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl">
                                    👨‍💻
                                </div>
                                <h3 className="font-semibold text-gray-900">Lead Engineer</h3>
                                <p className="text-sm text-gray-600">Architecture & Dev</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl">
                                    👨‍🎨
                                </div>
                                <h3 className="font-semibold text-gray-900">UX/UI Designer</h3>
                                <p className="text-sm text-gray-600">Design & UX</p>
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
                                <span>December 15, 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="text-blue-600 font-semibold">MVP - In Development</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Latest Features:</span>
                                <span className="text-purple-600 font-semibold">Core Memories, Date-based Planning</span>
                            </div>
                        </div>
                    </Card>

                    {/* Contact */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-gray-700 mb-4">
                            Have questions or feedback? We'd love to hear from you!
                        </p>
                        <div className="space-y-2 text-sm">
                            <p>
                                📧 Email: <a href="mailto:hello@mindfulplanner.com" className="text-blue-600 hover:underline">hello@mindfulplanner.com</a>
                            </p>
                            <p>
                                🐦 Twitter: <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@MindfulPlanner</a>
                            </p>
                            <p>
                                💬 Discord: <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Join our community</a>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
