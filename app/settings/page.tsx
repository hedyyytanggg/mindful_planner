'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Button, Input, Textarea } from '@/components/Common';

export default function SettingsPage() {
    const { data: session, status, update } = useSession();
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Load user profile on mount
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setDisplayName(session.user.name || '');
        }
    }, [session, status]);

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
