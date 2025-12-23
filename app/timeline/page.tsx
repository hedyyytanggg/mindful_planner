'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFormattedDate } from '@/lib/dateUtils';

interface DaySummary {
    date: string;
    deepWorkCount: number;
    deepWorkCompleted: number;
    quickWinsCount: number;
    quickWinsCompleted: number;
    makeItHappenCompleted: boolean;
    rechargeCount: number;
    littleJoysCount: number;
    hasReflection: boolean;
    hasFocusTomorrow: boolean;
    coreMemoriesCount: number;
    projectUpdatesCount: number;
}

export default function TimelinePage() {
    const router = useRouter();
    const sessionData = useSession();
    const userId = (sessionData?.data?.user as any)?.id;
    const authStatus = sessionData?.status || 'loading';

    const [entries, setEntries] = useState<DaySummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'thisWeek' | 'thisMonth' | 'last30'>('all');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [authStatus, router]);

    // Load timeline data
    useEffect(() => {
        if (userId) {
            loadTimeline();
        }
    }, [userId, filter]);

    const loadTimeline = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/timeline?userId=${userId}&filter=${filter}`);
            if (response.ok) {
                const data = await response.json();
                setEntries(data.entries || []);
            }
        } catch (error) {
            console.error('Error loading timeline:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const groupEntriesByPeriod = (entries: DaySummary[]) => {
        const now = new Date();
        const groups: { [key: string]: DaySummary[] } = {
            'This Week': [],
            'Last Week': [],
            'This Month': [],
            'Earlier': []
        };

        entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff < 7) {
                groups['This Week'].push(entry);
            } else if (daysDiff < 14) {
                groups['Last Week'].push(entry);
            } else if (daysDiff < 30) {
                groups['This Month'].push(entry);
            } else {
                groups['Earlier'].push(entry);
            }
        });

        return groups;
    };

    if (authStatus === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your timeline...</p>
                </div>
            </div>
        );
    }

    const groupedEntries = groupEntriesByPeriod(entries);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-14 sm:top-16 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📜 Timeline</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">Browse your daily planning history</p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === 'all'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => setFilter('last30')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === 'last30'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Last 30 Days
                            </button>
                            <button
                                onClick={() => setFilter('thisMonth')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === 'thisMonth'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setFilter('thisWeek')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === 'thisWeek'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                This Week
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {entries.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No entries yet</h2>
                        <p className="text-gray-600 mb-6">Start planning your days to build your timeline!</p>
                        <Link
                            href="/planner"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                        >
                            Go to Planner
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedEntries).map(([period, periodEntries]) => {
                            if (periodEntries.length === 0) return null;

                            return (
                                <div key={period}>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                        {period}
                                    </h2>

                                    <div className="space-y-3">
                                        {periodEntries.map((entry) => {
                                            return (
                                                <Link
                                                    key={entry.date}
                                                    href={`/planner?date=${entry.date}`}
                                                    className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all p-4 sm:p-5"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                        {/* Left: Date and Stats */}
                                                        <div className="flex-1">
                                                            <div className="mb-3">
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    {getFormattedDate(entry.date)}
                                                                </h3>
                                                            </div>

                                                            {/* Task Summary */}
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                                    <span>💼</span>
                                                                    <span>{entry.deepWorkCompleted}/{entry.deepWorkCount}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                                    <span>⚡</span>
                                                                    <span>{entry.quickWinsCompleted}/{entry.quickWinsCount}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                                    <span>🎯</span>
                                                                    <span>{entry.makeItHappenCompleted ? '✓' : '○'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                                    <span>😊</span>
                                                                    <span>{entry.littleJoysCount}/3</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Right: Badges */}
                                                        <div className="flex flex-wrap gap-1.5 sm:flex-col sm:items-end">
                                                            {entry.hasReflection && (
                                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                                    ✍️ Reflected
                                                                </span>
                                                            )}
                                                            {entry.coreMemoriesCount > 0 && (
                                                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                                                                    ❤️ {entry.coreMemoriesCount} {entry.coreMemoriesCount === 1 ? 'Memory' : 'Memories'}
                                                                </span>
                                                            )}
                                                            {entry.projectUpdatesCount > 0 && (
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                    📊 {entry.projectUpdatesCount} {entry.projectUpdatesCount === 1 ? 'Update' : 'Updates'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
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
