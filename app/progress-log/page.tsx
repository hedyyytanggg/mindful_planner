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

interface ProjectUpdate {
    id: string;
    projectId: string;
    projectName: string;
    content: string;
    updateDate: string;
    createdAt: string;
}

interface ProgressLogData {
    updates: ProjectUpdate[];
    byProject: { [key: string]: ProjectUpdate[] };
    projectInfo: { [key: string]: { name: string; count: number } };
    stats: {
        total: number;
        projects: number;
    };
    isPro?: boolean;
    limitApplied?: boolean;
}

export default function ProgressLog() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [filter, setFilter] = useState('last30');
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
    const [data, setData] = useState<ProgressLogData>({
        updates: [],
        byProject: {},
        projectInfo: {},
        stats: {
            total: 0,
            projects: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session, filter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/progress-log?userId=${session?.user?.id}&filter=${filter}`);
            const result = await response.json();

            // Handle error responses
            if (result.error || !result.byProject) {
                console.error('Error in response:', result.error);
                setData({
                    updates: [],
                    byProject: {},
                    projectInfo: {},
                    stats: { total: 0, projects: 0 }
                });
                return;
            }

            setData(result);
            // Expand all projects by default
            setExpandedProjects(new Set(Object.keys(result.byProject || {})));
        } catch (error) {
            console.error('Error fetching progress log:', error);
            setData({
                updates: [],
                byProject: {},
                projectInfo: {},
                stats: { total: 0, projects: 0 }
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleProject = (projectId: string) => {
        const newExpanded = new Set(expandedProjects);
        if (newExpanded.has(projectId)) {
            newExpanded.delete(projectId);
        } else {
            newExpanded.add(projectId);
        }
        setExpandedProjects(newExpanded);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-3">🔖</div>
                    <p className="text-gray-600">Loading progress log...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Free User Limit Banner */}
            {data?.limitApplied && !data?.isPro && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold">Viewing last 7 days only</p>
                                    <p className="text-sm text-blue-100">Upgrade to Pro for unlimited history access</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/upgrade')}
                                className="flex-shrink-0 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition whitespace-nowrap"
                            >
                                ✨ Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Link href="/planner" className="text-sm text-gray-600 hover:text-gray-900 transition">
                                ← Back to Planner
                            </Link>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <h1 className="text-xl font-bold text-gray-900">Progress Log</h1>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                            <button
                                onClick={() => setFilter('thisWeek')}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'thisWeek' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => setFilter('last30')}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'last30' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Last 30 Days
                            </button>
                            <button
                                onClick={() => setFilter('thisMonth')}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'thisMonth' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${filter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                All Time
                            </button>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded">
                            <span className="text-lg">🔖</span>
                            <span className="text-xl font-bold text-purple-600">{data.stats.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                {data.stats.total === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="text-5xl mb-3">🔖</div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No progress updates yet</h2>
                        <p className="text-sm text-gray-600 mb-4">Start tracking your projects, hobbies, and events!</p>
                        <Link href="/planner" className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition">
                            Go to Planner
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Object.keys(data.byProject)
                            .sort((a, b) => {
                                // Sort by most recent update in each project
                                const aLatest = data.byProject[a][0]?.updateDate || '';
                                const bLatest = data.byProject[b][0]?.updateDate || '';
                                return bLatest.localeCompare(aLatest);
                            })
                            .map(projectId => {
                                const project = data.projectInfo[projectId];
                                const updates = data.byProject[projectId];
                                const isExpanded = expandedProjects.has(projectId);

                                return (
                                    <div key={projectId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <button
                                            onClick={() => toggleProject(projectId)}
                                            className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200 px-3 py-2.5 hover:from-purple-100 hover:to-indigo-100 transition"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🔖</span>
                                                    <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                                                    <span className="text-xs text-gray-500 bg-purple-100 px-2 py-0.5 rounded-full">
                                                        {project.count} {project.count === 1 ? 'update' : 'updates'}
                                                    </span>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-3">
                                                <div className="space-y-2">
                                                    {updates.map((update) => (
                                                        <div key={update.id} className="flex items-start justify-between gap-3 py-1.5 border-l-2 border-purple-200 pl-3">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-gray-900 break-words">{update.content}</p>
                                                            </div>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                {formatCompactDate(update.updateDate)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </main>
        </div>
    );
}
