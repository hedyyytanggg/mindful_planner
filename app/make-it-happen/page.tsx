'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function formatCompactDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString + 'T00:00:00') : new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Yesterday';
    }

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

interface Task {
    id: string;
    task: string;
    completed: boolean;
    completedAt?: string;
    createdAt: string;
    planDate: string;
}

interface TaskData {
    tasks: Task[];
    byDate: { [key: string]: Task[] };
    stats: {
        total: number;
        completed: number;
        incomplete: number;
        completionRate: number;
    };
}

export default function MakeItHappenPage() {
    const router = useRouter();
    const sessionData = useSession();
    const userId = (sessionData?.data?.user as any)?.id;
    const authStatus = sessionData?.status || 'loading';

    const [data, setData] = useState<TaskData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'thisWeek' | 'thisMonth' | 'last30'>('last30');

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [authStatus, router]);

    useEffect(() => {
        if (userId) {
            loadTasks();
        }
    }, [userId, filter]);

    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/make-it-happen?userId=${userId}&filter=${filter}`);
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (authStatus === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const filteredByDate: { [key: string]: Task[] } = {};
    data.tasks.forEach(task => {
        if (task.completed) {
            if (!filteredByDate[task.planDate]) {
                filteredByDate[task.planDate] = [];
            }
            filteredByDate[task.planDate].push(task);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-14 sm:top-16 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">🎯 Make It Happen</h1>
                            <Link href="/timeline" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                ← Back to Timeline
                            </Link>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-1.5 overflow-x-auto">
                                <button
                                    onClick={() => setFilter('thisWeek')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'thisWeek' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => setFilter('last30')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'last30' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Last 30 Days
                                </button>
                                <button
                                    onClick={() => setFilter('thisMonth')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'thisMonth' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    This Month
                                </button>
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'all' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    All Time
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded">
                                <span className="text-lg">✅</span>
                                <span className="text-xl font-bold text-orange-600">{data?.stats.completed || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                {data.tasks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="text-5xl mb-3">🎯</div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h2>
                        <p className="text-sm text-gray-600 mb-4">Start adding your main objectives!</p>
                        <Link href="/planner" className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded transition">
                            Go to Planner
                        </Link>
                    </div>
                ) : (
                    <>
                        {Object.keys(filteredByDate).length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                <div className="text-3xl mb-2">🎯</div>
                                <p className="text-sm text-gray-600">No completed tasks yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {Object.keys(filteredByDate).sort((a, b) => b.localeCompare(a)).map(date => (
                                    <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-3 py-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-900">{formatCompactDate(date)}</h3>
                                                <Link href={`/planner?date=${date}`} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                                    View Day →
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="space-y-2">
                                                {filteredByDate[date].map((task) => (
                                                    <div key={task.id} className="flex items-start gap-2">
                                                        <span className="text-base flex-shrink-0 text-orange-600 mt-0.5">✓</span>
                                                        <p className="text-sm text-gray-900">{task.task}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
