'use client';

import { Card } from '@/components/Common';

export default function FeaturesPage() {
    const features = [
        {
            icon: '🎯',
            title: 'Deep Work Zone',
            description: 'Focus on 1-2 high-impact tasks with time estimates and detailed notes for maximum productivity.',
        },
        {
            icon: '⚡',
            title: 'Quick Wins',
            description: 'Achieve momentum with 3-5 small, achievable tasks that build confidence throughout your day.',
        },
        {
            icon: '💪',
            title: 'Make It Happen',
            description: 'Break through procrastination with a dedicated space for that one thing you keep putting off.',
        },
        {
            icon: '🔋',
            title: 'Recharge Zone',
            description: 'Choose from 8+ mindful activities or add custom ones to maintain energy and well-being.',
        },
        {
            icon: '💝',
            title: 'Little Joys',
            description: 'Capture 1-3 positive moments from your day to build a gratitude practice.',
        },
        {
            icon: '🤔',
            title: 'Reflection for Today',
            description: 'End your day with intention by reflecting on what you learned and accomplished.',
        },
        {
            icon: '🎯',
            title: 'Focus for Tomorrow',
            description: 'Set 1-3 priorities for your next day to start with clarity and direction.',
        },
        {
            icon: '📥',
            title: 'Export Plans',
            description: 'Download your daily plans as JSON, PDF, or CSV for your records and review.',
        },
        {
            icon: '📅',
            title: 'Browse History',
            description: 'Navigate through your past plans to track patterns and see your progress over time.',
        },
        {
            icon: '💾',
            title: 'Local Storage',
            description: 'Your plans are securely saved locally on your device - always available, always private.',
        },
    ];

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">✨ Features</h1>
                    <p className="text-gray-600">Everything you need to plan your day with intention</p>
                </div>

                <Card padding="md" className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Capabilities</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Mindful Planner comes with 7 purposeful planning zones designed to help you structure your day with intention, balance productivity with wellness, and build sustainable habits. Each zone serves a specific purpose in your daily workflow.
                    </p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {features.map((feature, index) => (
                        <Card key={index} padding="md">
                            <div className="flex gap-4">
                                <div className="text-4xl">{feature.icon}</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card padding="md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p className="font-semibold text-gray-900">📊 Analytics Dashboard</p>
                            <p className="text-sm text-gray-600">Track your daily streaks, completion rates, and wellness metrics.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">🤝 Team Collaboration</p>
                            <p className="text-sm text-gray-600">Share plans and goals with team members for accountability.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">🔔 Smart Reminders</p>
                            <p className="text-sm text-gray-600">Get timely notifications to stay on track with your plan.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">📱 Mobile App</p>
                            <p className="text-sm text-gray-600">Plan on the go with native iOS and Android apps.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">🧠 AI Insights</p>
                            <p className="text-sm text-gray-600">Personalized recommendations based on your planning patterns.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">🔗 Integrations</p>
                            <p className="text-sm text-gray-600">Connect with Google Calendar, Slack, and other tools.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
