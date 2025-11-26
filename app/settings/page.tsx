'use client';

import { useState } from 'react';
import { Card, Button, Input, Textarea } from '@/components/Common';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        timezone: 'UTC',
        theme: 'light',
        notifications: true,
        emailDigest: true,
        dailyReminder: true,
        reminderTime: '09:00',
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [field]: value,
        }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('app_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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

                <div className="space-y-6">
                    {/* Display Settings */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎨 Display</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Theme
                                </label>
                                <select
                                    value={settings.theme}
                                    onChange={(e) => handleChange('theme', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto (System)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timezone
                                </label>
                                <select
                                    value={settings.timezone}
                                    onChange={(e) => handleChange('timezone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="EST">EST (UTC-5)</option>
                                    <option value="CST">CST (UTC-6)</option>
                                    <option value="MST">MST (UTC-7)</option>
                                    <option value="PST">PST (UTC-8)</option>
                                    <option value="GMT">GMT (UTC+0)</option>
                                    <option value="CET">CET (UTC+1)</option>
                                    <option value="IST">IST (UTC+5:30)</option>
                                    <option value="JST">JST (UTC+9)</option>
                                    <option value="AEST">AEST (UTC+10)</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Notification Settings */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔔 Notifications</h2>

                        <div className="space-y-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => handleChange('notifications', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">Enable notifications</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.dailyReminder}
                                    onChange={(e) => handleChange('dailyReminder', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">Daily planning reminder</span>
                            </label>

                            {settings.dailyReminder && (
                                <div className="pl-7">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reminder time
                                    </label>
                                    <input
                                        type="time"
                                        value={settings.reminderTime}
                                        onChange={(e) => handleChange('reminderTime', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.emailDigest}
                                    onChange={(e) => handleChange('emailDigest', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">Weekly email digest</span>
                            </label>
                        </div>
                    </Card>

                    {/* Account Settings */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">👤 Account</h2>

                        <div className="space-y-4">
                            <div>
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="your@email.com"
                                    disabled
                                />
                            </div>

                            <div>
                                <Input
                                    label="Display Name"
                                    type="text"
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
                    </Card>

                    {/* Data Settings */}
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">💾 Data</h2>

                        <div className="space-y-4">
                            <p className="text-gray-600 text-sm">
                                Download or delete your personal data
                            </p>

                            <div className="flex gap-4">
                                <Button variant="secondary">
                                    📥 Export Data
                                </Button>
                                <Button variant="danger">
                                    🗑️ Delete All Data
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Save Button */}
                    <div className="flex gap-4 pt-4">
                        <Button onClick={handleSave} className="flex-1">
                            💾 Save Settings
                        </Button>
                        <Button variant="secondary" className="flex-1">
                            ↩️ Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
