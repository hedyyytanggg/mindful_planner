'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Textarea } from '@/components/Common';

interface Subscription {
    tier: 'free' | 'pro';
    status: string | null;
    endDate: string | null;
}

export default function SettingsPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loadingSubscription, setLoadingSubscription] = useState(true);
    const [managingBilling, setManagingBilling] = useState(false);

    // Load user profile on mount
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setDisplayName(session.user.name || '');
            loadSubscription();
        }
    }, [session, status]);

    const loadSubscription = async () => {
        try {
            const response = await fetch('/api/user/subscription');
            if (response.ok) {
                const data = await response.json();
                setSubscription(data);
            } else {
                // Default to free tier if unable to load subscription
                setSubscription({ tier: 'free', status: null, endDate: null });
            }
        } catch (err) {
            console.error('Failed to load subscription:', err);
            // Default to free tier on error
            setSubscription({ tier: 'free', status: null, endDate: null });
        } finally {
            setLoadingSubscription(false);
        }
    };

    const handleManageBilling = async () => {
        setManagingBilling(true);
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to open billing portal');
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (err: any) {
            setError(err.message || 'Failed to open billing portal');
            setManagingBilling(false);
        }
    };

    const handleSave = async () => {
        if (!displayName.trim()) {
            setError('Display name cannot be empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: displayName }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update profile');
            }

            // Update the session with new name
            await update({ name: displayName });

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-2xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">⚙️ Settings</h1>
                    <p className="text-gray-600">Customize your Mindful Planner experience</p>
                </div>

                {saved && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        ✓ Settings saved successfully!
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        ⚠️ {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Subscription Status */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Subscription</h2>

                        {loadingSubscription ? (
                            <div className="text-center py-8 text-gray-500">
                                Loading subscription...
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                                            <p className="text-3xl font-bold">
                                                {subscription?.tier === 'pro' ? (
                                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        ✨ Pro
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-700">Free</span>
                                                )}
                                            </p>
                                        </div>
                                        {subscription?.tier === 'pro' && subscription?.status && (
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : subscription.status === 'trialing'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : subscription.status === 'past_due'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                            </div>
                                        )}
                                    </div>

                                    {subscription?.tier === 'pro' ? (
                                        <>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-gray-700">
                                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Unlimited history
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Cloud sync across devices
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Project tracking
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Priority support
                                                </div>
                                            </div>

                                            {subscription.endDate && (
                                                <p className="text-sm text-gray-600">
                                                    {subscription.status === 'active' || subscription.status === 'trialing'
                                                        ? 'Renews on'
                                                        : 'Expires on'
                                                    } {new Date(subscription.endDate).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}

                                            <Button
                                                variant="secondary"
                                                className="w-full mt-4"
                                                onClick={handleManageBilling}
                                                disabled={managingBilling}
                                            >
                                                {managingBilling ? '⏳ Opening...' : '⚙️ Manage Billing'}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2 mb-4">
                                                <p className="text-gray-700 font-medium mb-3">Free Plan includes:</p>
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    7-day history access
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Basic planning features
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Daily reflections
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-900 font-medium mb-1">
                                                    ✨ Upgrade to unlock:
                                                </p>
                                                <p className="text-sm text-blue-700">
                                                    Unlimited history, cloud sync, project tracking, and more
                                                </p>
                                            </div>

                                            <Button
                                                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                onClick={() => router.push('/upgrade')}
                                            >
                                                ✨ Upgrade to Pro — Starting at $1.99/month
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Account Settings */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">👤 Account</h2>

                        {status === 'loading' ? (
                            <div className="text-center py-8 text-gray-500">
                                Loading...
                            </div>
                        ) : status === 'unauthenticated' ? (
                            <div className="text-center py-8 text-gray-500">
                                Please log in to view your settings.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={session?.user?.email || ''}
                                        placeholder="your@email.com"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Display Name"
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <Button variant="secondary" className="w-full">
                                        Change Password
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Save Button */}
                    {status === 'authenticated' && (
                        <div className="flex gap-4 pt-4">
                            <Button
                                onClick={handleSave}
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? '⏳ Saving...' : '💾 Save Settings'}
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setDisplayName(session?.user?.name || '')}
                                disabled={loading}
                            >
                                ↩️ Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
