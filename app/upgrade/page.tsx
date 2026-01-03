'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpgradePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState<'month' | 'year' | null>(null);

    const handleUpgrade = async (interval: 'month' | 'year') => {
        if (!session) {
            router.push('/login?redirect=/upgrade');
            return;
        }

        setLoadingPlan(interval);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceInterval: interval }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to start checkout. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoadingPlan(null);
        }
    };

    const monthlyPrice = 1.99;
    const yearlyPrice = 19.99;
    const yearlySavings = (monthlyPrice * 12 - yearlyPrice).toFixed(2);
    const monthlyPriceIfYearly = (yearlyPrice / 12).toFixed(2);
    const savingsPercent = Math.round((parseFloat(yearlySavings) / (monthlyPrice * 12)) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                        Mindful
                    </Link>
                    {session ? (
                        <Link
                            href="/planner"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            ← Back to Planner
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
                {/* Hero */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                        Upgrade to Pro
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Unlock unlimited history, project tracking, and insights to make every day count
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-16 md:mb-20">
                    {/* Free Tier */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-600 font-medium">/forever</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Perfect to get started</p>
                        </div>

                        <ul className="space-y-3.5 mb-8 min-h-[280px]">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">All 7 planning zones</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Daily planning & organization</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">7-day history access</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Mobile responsive design</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Auto-save functionality</span>
                            </li>
                        </ul>

                        <Link
                            href="/signup"
                            className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white relative shadow-2xl">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                            ⭐ Most Popular
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-4">Pro</h3>

                            {/* Monthly Option */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3 border border-white/20">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold">${monthlyPrice.toFixed(2)}</span>
                                            <span className="text-blue-100 font-medium">/month</span>
                                        </div>
                                        <p className="text-sm text-blue-100 mt-1">Billed monthly</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUpgrade('month')}
                                    disabled={loadingPlan !== null}
                                    className="w-full px-4 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-sm"
                                >
                                    {loadingPlan === 'month' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Get Monthly Plan →'
                                    )}
                                </button>
                            </div>

                            {/* Yearly Option - Highlighted */}
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-green-400/50 relative">
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                                    SAVE {savingsPercent}%
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold">${monthlyPriceIfYearly}</span>
                                            <span className="text-blue-100 font-medium">/month</span>
                                        </div>
                                        <p className="text-sm text-blue-100 mt-1">${yearlyPrice} billed annually</p>
                                        <p className="text-xs text-green-300 font-semibold mt-1">
                                            💰 Save ${yearlySavings} vs monthly
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUpgrade('year')}
                                    disabled={loadingPlan !== null}
                                    className="w-full px-4 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-sm shadow-lg"
                                >
                                    {loadingPlan === 'year' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Get Yearly Plan (Best Value) →'
                                    )}
                                </button>
                            </div>
                        </div>

                        <ul className="space-y-3.5 mb-6 min-h-[280px]">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="font-semibold">Everything in Free, plus:</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span><strong className="font-semibold">Unlimited history</strong> — Never lose access to past plans</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span><strong className="font-semibold">Cloud sync</strong> — Access from any device</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span><strong className="font-semibold">Project tracking</strong> — Monitor ongoing hobbies & goals</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span><strong className="font-semibold">Core memories</strong> — Capture special moments with photos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span><strong className="font-semibold">Weekly insights</strong> — Track completion rates & patterns</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span><strong className="font-semibold">Priority support</strong> — 24-hour email response</span>
                            </li>
                        </ul>

                        <p className="text-xs text-blue-100 text-center">
                            🔒 Secure payment via Stripe • Cancel anytime
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <details className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all group shadow-sm hover:shadow-md">
                            <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex justify-between items-center">
                                <span>Can I try Pro before paying?</span>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="text-gray-600 mt-3 leading-relaxed">
                                Start with the free plan to experience all 7 planning zones. When you need access to older plans or want project tracking, upgrade to Pro anytime.
                            </p>
                        </details>

                        <details className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all group shadow-sm hover:shadow-md">
                            <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex justify-between items-center">
                                <span>Can I cancel anytime?</span>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="text-gray-600 mt-3 leading-relaxed">
                                Yes! Cancel your subscription anytime from your settings. You'll keep Pro access until the end of your billing period, then revert to the free plan.
                            </p>
                        </details>

                        <details className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all group shadow-sm hover:shadow-md">
                            <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex justify-between items-center">
                                <span>What happens to my data if I downgrade?</span>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="text-gray-600 mt-3 leading-relaxed">
                                Your data is never deleted. If you downgrade to free, you'll only see the last 7 days of history. Upgrade again anytime to access your full history.
                            </p>
                        </details>

                        <details className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all group shadow-sm hover:shadow-md">
                            <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex justify-between items-center">
                                <span>Do you offer refunds?</span>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="text-gray-600 mt-3 leading-relaxed">
                                Yes! If you're not satisfied within the first 14 days, contact us for a full refund. No questions asked.
                            </p>
                        </details>

                        <details className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all group shadow-sm hover:shadow-md">
                            <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex justify-between items-center">
                                <span>Is my payment information secure?</span>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="text-gray-600 mt-3 leading-relaxed">
                                Absolutely. We use Stripe for payment processing, which is trusted by millions of businesses worldwide. We never see or store your credit card information.
                            </p>
                        </details>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="text-center mt-12 pt-12 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Trusted by thousands • Secure payments by <span className="font-semibold text-gray-700">Stripe</span> • GDPR compliant
                    </p>
                </div>
            </div>
        </div>
    );
}
