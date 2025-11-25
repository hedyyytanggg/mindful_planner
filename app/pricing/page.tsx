'use client';

import { Card, Button } from '@/components/Common';

export default function PricingPage() {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for getting started',
            features: [
                '7 planning zones',
                'Local storage',
                'Export as JSON',
                'Date navigation',
                'Basic analytics',
            ],
            cta: 'Get Started',
            highlighted: false,
        },
        {
            name: 'Pro',
            price: '$9.99',
            period: 'per month',
            description: 'For serious planners',
            features: [
                'Everything in Free',
                'Export PDF & CSV',
                'Advanced analytics',
                'Email reminders',
                'Cloud backup',
                'Team collaboration (up to 3)',
                'Priority support',
            ],
            cta: 'Start Free Trial',
            highlighted: true,
        },
        {
            name: 'Team',
            price: '$29.99',
            period: 'per month',
            description: 'For teams & organizations',
            features: [
                'Everything in Pro',
                'Unlimited team members',
                'Team analytics',
                'Admin dashboard',
                'API access',
                'Custom branding',
                '24/7 dedicated support',
            ],
            cta: 'Contact Sales',
            highlighted: false,
        },
    ];

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 Simple, Transparent Pricing</h1>
                    <p className="text-gray-600">Choose the plan that works best for you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative ${plan.highlighted ? 'md:scale-105' : ''}`}
                        >
                            <Card
                                padding="md"
                                className={plan.highlighted ? 'ring-2 ring-blue-600 shadow-xl' : ''}
                            >
                                {plan.highlighted && (
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                                        POPULAR
                                    </div>
                                )}

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                                </div>

                                <Button className="w-full mb-6" variant={plan.highlighted ? 'primary' : 'secondary'}>
                                    {plan.cta}
                                </Button>

                                <div className="space-y-3">
                                    {plan.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-start gap-2">
                                            <span className="text-green-600 font-bold">✓</span>
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                <Card padding="md" className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                            <p className="text-gray-700 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Do you offer a free trial?</h3>
                            <p className="text-gray-700 text-sm">Yes! Pro plan comes with a 14-day free trial. No credit card required to get started.</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">What happens to my data if I cancel?</h3>
                            <p className="text-gray-700 text-sm">Your data stays with you. You can export all your plans and then your account will be downgraded to the Free plan.</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Is there a discount for annual billing?</h3>
                            <p className="text-gray-700 text-sm">Yes! Pay annually and save 20%. That's $95.88/year instead of $119.88.</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md" className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
                    <p className="text-gray-700 mb-6">Our team is here to help. Reach out anytime.</p>
                    <Button className="inline-block">📧 Contact Us</Button>
                </Card>
            </div>
        </div>
    );
}
