'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Format date for compact display
function formatCompactDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString + 'T00:00:00') : new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Yesterday';
    }

    // Format as "Mon, Dec 23" or "Mon, Dec 23, 2024" if not current year
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };

    if (date.getFullYear() !== today.getFullYear()) {
        options.year = 'numeric';
    }

    return date.toLocaleDateString('en-US', options);
}

interface Reflection {
    id: string;
    content: string;
    createdAt: string;
    planDate: string;
}

interface ReflectionsData {
    reflections: Reflection[];
    byDate: { [key: string]: Reflection[] };
    stats: {
        total: number;
    };
    isPro?: boolean;
    limitApplied?: boolean;
}

export default function ReflectionsTodayPage() {
    const router = useRouter();
    const sessionData = useSession();
    const userId = (sessionData?.data?.user as any)?.id;
    const authStatus = sessionData?.status || 'loading';

    const [data, setData] = useState<ReflectionsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'thisWeek' | 'thisMonth' | 'last30'>('last30');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [authStatus, router]);

    // Load reflections data
    useEffect(() => {
        if (userId) {
            loadReflections();
        }
    }, [userId, filter]);

    const loadReflections = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/reflections-today?userId=${userId}&filter=${filter}`);
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
            }
        } catch (error) {
            console.error('Error loading reflections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (authStatus === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your reflections...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-14 sm:top-16 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">💭 Reflections for Today</h1>
                            </div>

                            <Link
                                href="/timeline"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                ← Back to Timeline
                            </Link>
                        </div>

                        {/* Filter Tabs & Stats */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-1.5 overflow-x-auto">
                                <button
                                    onClick={() => setFilter('thisWeek')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'thisWeek'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => setFilter('last30')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'last30'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Last 30 Days
                                </button>
                                <button
                                    onClick={() => setFilter('thisMonth')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'thisMonth'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    This Month
                                </button>
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'all'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    All Time
                                </button>
                            </div>

                            {/* Inline Stats */}
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded">
                                <span className="text-lg">💭</span>
                                <span className="text-xl font-bold text-indigo-600">{data?.stats.total || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Free Tier Upgrade Banner */}
            {data.limitApplied && !data.isPro && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">🔒</div>
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base">Viewing last 7 days only</h3>
                                <p className="text-xs sm:text-sm opacity-90">Upgrade to Pro to access your complete history</p>
                            </div>
                        </div>
                        <Link
                            href="/upgrade"
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition text-sm whitespace-nowrap"
                        >
                            Upgrade Now
                        </Link>
                    </div>
                </div>
            )}

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                {data.reflections.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="text-5xl mb-3">💭</div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No reflections yet</h2>
                        <p className="text-sm text-gray-600 mb-4">Start adding reflections to your daily plans!</p>
                        <Link
                            href="/planner"
                            className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition"
                        >
                            Go to Planner
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Object.keys(data.byDate).sort((a, b) => b.localeCompare(a)).map(date => {
                            const reflectionsForDate = data.byDate[date];

                            return (
                                <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Date Header */}
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 px-3 py-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {formatCompactDate(date)}
                                            </h3>
                                            <Link
                                                href={`/planner?date=${date}`}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                View Day →
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Reflections Content */}
                                    <div className="p-4">
                                        {reflectionsForDate.map((reflection) => (
                                            <div
                                                key={reflection.id}
                                                className="prose prose-sm max-w-none text-gray-700"
                                            >
                                                <p className="whitespace-pre-wrap">{reflection.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
