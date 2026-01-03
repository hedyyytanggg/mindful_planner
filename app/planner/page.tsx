'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DeepWorkZone } from '@/components/Planner/DeepWorkZone';
import { QuickWins } from '@/components/Planner/QuickWins';
import { MakeItHappen } from '@/components/Planner/MakeItHappen';
import { RechargeZone } from '@/components/Planner/RechargeZone';
import { LittleJoys } from '@/components/Planner/LittleJoys';
import { ReflectionToday } from '@/components/Planner/ReflectionToday';
import { FocusTomorrow } from '@/components/Planner/FocusTomorrow';
import { CoreMemories } from '@/components/Planner/CoreMemories';
import { ProjectUpdates } from '@/components/Planner/ProjectUpdates';
import { Button } from '@/components/Common';
import { getTodayInLocalTimezone, getFormattedDate, getCurrentDateTimeInfo } from '@/lib/dateUtils';

interface DeepWorkItem {
    id: string;
    title: string;
    timeEstimate?: number;
    notes?: string;
    completed: boolean;
}

interface QuickWinItem {
    id: string;
    title: string;
    completed: boolean;
}

interface MakeItHappenItem {
    id: string;
    task: string;
    completed: boolean;
}

interface RechargeItem {
    id: string;
    activityId: string | null;
    customActivity: string | null;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface CoreMemory {
    id: string;
    title: string;
    description: string;
    memoryDate: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Project {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
}

interface ProjectUpdate {
    id: string;
    projectId: string;
    projectName?: string;
    content: string;
    updateDate: string;
}

export default function PlannerPage() {
    // Get user from session
    const router = useRouter();
    const sessionData = useSession();
    const userId = (sessionData?.data?.user as any)?.id;
    const authStatus = sessionData?.status || 'loading';

    // Subscription state
    const [isPro, setIsPro] = useState(false);
    const [loadingSubscription, setLoadingSubscription] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/login');
        } else if (authStatus === 'authenticated') {
            loadSubscriptionStatus();
        }
    }, [authStatus, router]);

    // Load subscription status
    const loadSubscriptionStatus = async () => {
        try {
            const response = await fetch('/api/user/subscription');
            if (response.ok) {
                const data = await response.json();
                setIsPro(data.tier === 'pro');
            }
        } catch (err) {
            console.error('Failed to load subscription:', err);
        } finally {
            setLoadingSubscription(false);
        }
    };

    // Date State
    const [currentDate, setCurrentDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isReadOnly, setIsReadOnly] = useState(false);

    // Deep Work State
    const [deepWork, setDeepWork] = useState<DeepWorkItem[]>([]);

    // Quick Wins State
    const [quickWins, setQuickWins] = useState<QuickWinItem[]>([]);

    // Make It Happen State
    const [makeItHappen, setMakeItHappen] = useState<MakeItHappenItem | null>(null);

    // Recharge State
    const [recharge, setRecharge] = useState<RechargeItem[]>([]);

    // Little Joys State
    const [littleJoys, setLittleJoys] = useState<string[]>([]);

    // Reflection State
    const [reflection, setReflection] = useState<string | null>(null);

    // Focus for Tomorrow State
    const [focusTomorrow, setFocusTomorrow] = useState<string | null>(null);

    // Core Memories State
    const [coreMemories, setCoreMemories] = useState<CoreMemory[]>([]);

    // Projects State
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);
    const [planId, setPlanId] = useState<string | null>(null);

    // Initialize date and load data from database or localStorage
    useEffect(() => {
        if (authStatus === 'loading') return;

        // Check if there's a date in the URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');

        const initialDate = dateParam || getTodayInLocalTimezone();
        setCurrentDate(initialDate);
        setIsReadOnly(isDateReadOnly(initialDate));
        loadPlanForDate(initialDate);
        loadProjects();
        setIsLoading(false);
    }, [authStatus, userId]);

    // Save plan to database (with localStorage fallback)
    const savePlanForDate = async (date: string) => {
        // Don't save if date is read-only (older than 1 month)
        if (isDateReadOnly(date)) {
            console.log('⚠️ Skipping save for read-only date:', date);
            return;
        }

        if (!userId) {
            // User not authenticated, save to localStorage only
            savePlanToLocalStorage(date);
            return;
        }

        const planData = {
            plan_date: date,
            deep_work: deepWork,
            quick_wins: quickWins,
            make_it_happen: makeItHappen,
            recharge_zone: recharge,
            little_joys: littleJoys,
            reflection,
            focus_tomorrow: focusTomorrow,
        };

        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await fetch(`/api/plans/${date}?userId=${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(planData),
            });

            if (!response.ok) {
                throw new Error('Failed to save plan to database');
            }

            // Also save to localStorage as backup
            savePlanToLocalStorage(date);
            console.log('✅ Plan saved to database');
        } catch (error: unknown) {
            console.error('Error saving to database:', error);
            setSaveError('Failed to save to database, but saved locally');
            // Fallback to localStorage
            savePlanToLocalStorage(date);
        } finally {
            setIsSaving(false);
        }
    };

    // Save to localStorage
    const savePlanToLocalStorage = (date: string) => {
        const plan = {
            deepWork,
            quickWins,
            makeItHappen,
            recharge,
            littleJoys,
            reflection,
            focusTomorrow,
        };
        localStorage.setItem(`plan_${date}`, JSON.stringify(plan));
    };

    // Load plan from database (with localStorage fallback)
    const loadPlanForDate = async (date: string) => {
        if (!userId) {
            // User not authenticated, load from localStorage only
            loadPlanFromLocalStorage(date);
            return;
        }

        try {
            const response = await fetch(`/api/plans/${date}?userId=${userId}`);

            if (!response.ok) {
                throw new Error('Failed to load plan from database');
            }

            const dbPlan = await response.json();

            // Store plan ID for project updates
            if (dbPlan.id) {
                setPlanId(dbPlan.id);
                loadProjectUpdates(dbPlan.id);
            }

            // Update state with database data
            setDeepWork(dbPlan.deep_work || []);
            setQuickWins(dbPlan.quick_wins || []);
            setMakeItHappen(dbPlan.make_it_happen || null);
            setRecharge(Array.isArray(dbPlan.recharge_zone) ? dbPlan.recharge_zone : []);
            setLittleJoys(dbPlan.little_joys || []);
            setReflection(dbPlan.reflection || null);
            setFocusTomorrow(dbPlan.focus_tomorrow || null);

            setSaveError(null);
        } catch (error: unknown) {
            console.error('Error loading from database:', error);
            // Fall back to localStorage if database fails
            loadPlanFromLocalStorage(date);
        }
    };

    // Load from localStorage (fallback)
    const loadPlanFromLocalStorage = (date: string) => {
        const saved = localStorage.getItem(`plan_${date}`);
        if (saved) {
            try {
                const plan = JSON.parse(saved);
                setDeepWork(plan.deepWork || []);
                setQuickWins(plan.quickWins || []);
                setMakeItHappen(plan.makeItHappen || null);
                setRecharge(Array.isArray(plan.recharge) ? plan.recharge : []);
                setLittleJoys(plan.littleJoys || []);
                setReflection(plan.reflection || null);
                setFocusTomorrow(plan.focusTomorrow || null);
            } catch (error: unknown) {
                console.error('Error parsing localStorage:', error);
            }
        } else {
            // Clear state for new date
            setDeepWork([]);
            setQuickWins([]);
            setMakeItHappen(null);
            setRecharge([]);
            setLittleJoys([]);
            setReflection(null);
            setFocusTomorrow(null);
        }
    };

    // Handle date change
    const handleDateChange = async (newDate: string) => {
        await savePlanForDate(currentDate);
        setCurrentDate(newDate);
        setIsReadOnly(isDateReadOnly(newDate));
        await loadPlanForDate(newDate);
    };

    // Check if a date is read-only (older than 1 month)
    const isDateReadOnly = (dateStr: string) => {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        const minEditDateStr = oneMonthAgo.toISOString().split('T')[0];
        return dateStr < minEditDateStr;
    };

    // Calculate minimum allowed date based on subscription
    const getMinDate = () => {
        const today = new Date();
        if (!isPro) {
            // Free users: 7 days back
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            return sevenDaysAgo.toISOString().split('T')[0];
        } else {
            // Pro users: 1 year back
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            return oneYearAgo.toISOString().split('T')[0];
        }
    };

    // Check if previous day button should be disabled
    const isPreviousDayDisabled = () => {
        const minDate = getMinDate();
        return currentDate <= minDate;
    };

    // Navigate to previous day
    const goToPreviousDay = () => {
        if (isPreviousDayDisabled()) return;
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        handleDateChange(date.toISOString().split('T')[0]);
    };

    // Navigate to next day
    const goToNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        handleDateChange(date.toISOString().split('T')[0]);
    };

    // Check if next day button should be disabled
    const isNextDayDisabled = () => {
        const todayStr = getTodayInLocalTimezone();
        return currentDate >= todayStr;
    };

    // Navigate to today
    const goToToday = () => {
        const today = getTodayInLocalTimezone();
        handleDateChange(today);
    };

    // Auto-save whenever any state changes (debounced to avoid too many API calls)
    useEffect(() => {
        if (isLoading || !currentDate || !userId) return;

        // Debounce: wait 2 seconds after last change before saving
        const timer = setTimeout(() => {
            savePlanForDate(currentDate);
        }, 2000);

        return () => clearTimeout(timer);
    }, [deepWork, quickWins, makeItHappen, recharge, littleJoys, reflection, focusTomorrow, currentDate, userId, isLoading]);

    // Load core memories whenever currentDate changes
    useEffect(() => {
        loadCoreMemories();
    }, [currentDate]);

    // Deep Work Handlers
    const handleAddDeepWork = (item: { title: string; timeEstimate?: number; notes?: string; completed: boolean }) => {
        const newItem: DeepWorkItem = {
            id: Math.random().toString(),
            ...item,
        };
        setDeepWork([...deepWork, newItem]);
    };

    const handleUpdateDeepWork = (id: string, updates: Partial<DeepWorkItem>) => {
        setDeepWork(deepWork.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleDeleteDeepWork = (id: string) => {
        setDeepWork(deepWork.filter(item => item.id !== id));
    };

    // Quick Wins Handlers
    const handleAddQuickWin = (item: { title: string; completed: boolean }) => {
        const newItem: QuickWinItem = {
            id: Math.random().toString(),
            ...item,
        };
        setQuickWins([...quickWins, newItem]);
    };

    const handleUpdateQuickWin = (id: string, updates: Partial<QuickWinItem>) => {
        setQuickWins(quickWins.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleDeleteQuickWin = (id: string) => {
        setQuickWins(quickWins.filter(item => item.id !== id));
    };

    // Make It Happen Handlers
    const handleAddMakeItHappen = (item: { task: string; completed: boolean }) => {
        const newItem: MakeItHappenItem = {
            id: Math.random().toString(),
            ...item,
        };
        setMakeItHappen(newItem);
    };

    const handleUpdateMakeItHappen = (id: string, updates: Partial<MakeItHappenItem>) => {
        if (makeItHappen?.id === id) {
            setMakeItHappen({ ...makeItHappen, ...updates });
        }
    };

    const handleDeleteMakeItHappen = () => {
        setMakeItHappen(null);
    };

    // Recharge Handlers
    const handleAddRecharge = (activity: { activityId?: string; customActivity?: string; completed: boolean }) => {
        const newItem: RechargeItem = {
            id: Math.random().toString(),
            ...activity,
            activityId: activity.activityId || null,
            customActivity: activity.customActivity || null,
        };
        console.log('🔵 Adding recharge activity:', newItem);
        setRecharge([...recharge, newItem]);
    };

    const handleUpdateRecharge = (id: string, updates: Partial<RechargeItem>) => {
        console.log('🔵 Updating recharge activity:', id, updates);
        setRecharge(recharge.map(item => (item.id === id ? { ...item, ...updates } : item)));
    };

    const handleDeleteRecharge = (id: string) => {
        console.log('🔵 Deleting recharge activity:', id);
        setRecharge(recharge.filter(item => item.id !== id));
    };

    // Little Joys Handlers
    const handleAddJoy = (joy: string) => {
        setLittleJoys([...littleJoys, joy]);
    };

    const handleDeleteJoy = (index: number) => {
        setLittleJoys(littleJoys.filter((_, i) => i !== index));
    };

    // Load Core Memories
    const loadCoreMemories = async () => {
        if (!userId || !currentDate) return;

        try {
            const response = await fetch(`/api/memories?userId=${userId}&memoryDate=${currentDate}`);
            if (!response.ok) {
                throw new Error('Failed to load memories');
            }
            const data = await response.json();
            setCoreMemories(data.memories || []);
        } catch (error: unknown) {
            console.error('Error loading core memories:', error);
        }
    };

    // Add Core Memory
    const handleAddMemory = async (memory: Omit<CoreMemory, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!userId) return;

        try {
            const response = await fetch('/api/memories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...memory,
                    userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save memory');
            }

            const data = await response.json();
            setCoreMemories([data.memory, ...coreMemories]);
            console.log('✅ Memory saved');
        } catch (error: unknown) {
            console.error('Error saving memory:', error);
            setSaveError('Failed to save memory');
        }
    };

    // Delete Core Memory
    const handleDeleteMemory = async (id: string) => {
        if (!userId) return;

        try {
            const response = await fetch(`/api/memories/${id}?userId=${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete memory');
            }

            setCoreMemories(coreMemories.filter(m => m.id !== id));
            console.log('✅ Memory deleted');
        } catch (error: unknown) {
            console.error('Error deleting memory:', error);
            setSaveError('Failed to delete memory');
        }
    };

    // Load Projects
    const loadProjects = async () => {
        if (!userId) return;

        try {
            const response = await fetch(`/api/projects?activeOnly=true`);
            if (!response.ok) {
                throw new Error('Failed to load projects');
            }
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error: unknown) {
            console.error('Error loading projects:', error);
        }
    };

    // Load Project Updates
    const loadProjectUpdates = async (currentPlanId: string) => {
        if (!currentPlanId) return;

        try {
            const response = await fetch(`/api/project-updates?planId=${currentPlanId}`);
            if (!response.ok) {
                throw new Error('Failed to load project updates');
            }
            const data = await response.json();
            setProjectUpdates(data.updates || []);
        } catch (error: unknown) {
            console.error('Error loading project updates:', error);
        }
    };

    // Add Project
    const handleAddProject = async (name: string, description: string) => {
        if (!userId) return;

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            const data = await response.json();
            setProjects([...projects, data.project]);
            console.log('✅ Project created');
        } catch (error: unknown) {
            console.error('Error creating project:', error);
            setSaveError('Failed to create project');
        }
    };

    // Add Project Update
    const handleAddProjectUpdate = async (projectId: string, content: string) => {
        if (!planId) return;

        try {
            const response = await fetch('/api/project-updates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    planId,
                    updateDate: currentDate,
                    content,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add project update');
            }

            const data = await response.json();
            setProjectUpdates([data.update, ...projectUpdates]);
            console.log('✅ Project update added');
        } catch (error: unknown) {
            console.error('Error adding project update:', error);
            setSaveError('Failed to add project update');
        }
    };

    // Delete Project Update
    const handleDeleteProjectUpdate = async (id: string) => {
        try {
            const response = await fetch(`/api/project-updates?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete project update');
            }

            setProjectUpdates(projectUpdates.filter(u => u.id !== id));
            console.log('✅ Project update deleted');
        } catch (error: unknown) {
            console.error('Error deleting project update:', error);
            setSaveError('Failed to delete project update');
        }
    };

    /* Export Plan - hidden for now
    const handleExport = () => {
        const plan = {
            date: new Date().toLocaleDateString(),
            deepWork: deepWork.map(d => ({ title: d.title, time: d.timeEstimate, notes: d.notes, done: d.completed })),
            quickWins: quickWins.map(q => ({ title: q.title, done: q.completed })),
            makeItHappen: makeItHappen?.task,
            recharge: recharge.map(r => ({
                activity: r.activityId || r.customActivity,
                done: r.completed
            })),
            littleJoys,
            reflection,
            focusTomorrow,
        };

        const dataStr = JSON.stringify(plan, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daily-plan-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };
    */

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
            {/* Free User 7-Day Limit Banner */}
            {!isPro && !loadingSubscription && currentDate && (
                (() => {
                    const today = new Date();
                    const planDate = new Date(currentDate);
                    const daysDiff = Math.floor((today.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24));
                    const isNearLimit = daysDiff >= 5 && daysDiff <= 7;

                    if (isNearLimit) {
                        return (
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm">
                                                <span className="font-semibold">Viewing day {daysDiff} of 7</span>
                                                <span className="hidden sm:inline"> — Upgrade to Pro for unlimited history</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => router.push('/upgrade')}
                                            className="flex-shrink-0 bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                                        >
                                            Upgrade
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()
            )}

            {/* Authentication and Status Check */}
            {authStatus === 'loading' && (
                <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 py-3">
                    <p className="text-center text-xs sm:text-sm text-blue-700">⏳ Loading your session...</p>
                </div>
            )}

            {authStatus === 'unauthenticated' && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 sm:px-6 py-3">
                    <p className="text-center text-xs sm:text-sm text-yellow-700">
                        📝 Not signed in. Data will be saved locally only.{' '}
                        <a href="/login" className="font-semibold text-yellow-900 hover:text-yellow-800 underline">
                            Sign in here
                        </a>
                    </p>
                </div>
            )}

            {saveError && (
                <div className="bg-red-50 border-b border-red-200 px-4 sm:px-6 py-3">
                    <p className="text-center text-xs sm:text-sm text-red-700">
                        ⚠️ {saveError}
                    </p>
                </div>
            )}

            {/* Planner Subheader */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-14 sm:top-16 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🧘 Your Daily Plan</h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {currentDate && getFormattedDate(currentDate)}
                                <span className="hidden sm:inline ml-2 text-gray-500">
                                    ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                                </span>
                                <span className="block sm:inline mt-1 sm:mt-0">
                                    {isSaving && <span className="sm:ml-2 text-blue-600">💾 Saving...</span>}
                                    {!isSaving && userId && <span className="sm:ml-2 text-green-600">✓ Synced</span>}
                                    {!userId && <span className="sm:ml-2 text-gray-500">📱 Local only</span>}
                                </span>
                            </p>
                        </div>
                        {/* Export button - hidden for now
                        <Button onClick={handleExport} variant="secondary">
                            📥 Export
                        </Button>
                        */}
                    </div>

                    {/* Date Navigation */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-4 border-t border-gray-200">
                        {/* Mobile: Date picker first, larger touch target */}
                        <input
                            type="date"
                            value={currentDate}
                            max={getTodayInLocalTimezone()}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="sm:order-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center sm:text-left"
                            aria-label="Select a date"
                        />

                        {/* Navigation buttons row */}
                        <div className="flex gap-2 sm:order-1">
                            <button
                                onClick={goToPreviousDay}
                                disabled={isPreviousDayDisabled()}
                                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                                aria-label="Go to previous day"
                            >
                                <span className="sm:hidden">←</span>
                                <span className="hidden sm:inline">← Prev</span>
                            </button>

                            <button
                                onClick={goToNextDay}
                                disabled={isNextDayDisabled()}
                                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 sm:order-3"
                                aria-label="Go to next day"
                            >
                                <span className="sm:hidden">→</span>
                                <span className="hidden sm:inline">Next →</span>
                            </button>
                        </div>

                        <div className="hidden sm:block sm:flex-1 sm:order-4" />

                        <button
                            onClick={goToToday}
                            className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 sm:order-5"
                            aria-label="Go to today"
                            title="Jump to today"
                        >
                            📅 Today
                        </button>
                    </div>

                    {/* Read-only notice */}
                    {isReadOnly && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 italic flex items-center gap-1">
                                <span>🔒</span>
                                <span>Read-only: This date is older than 1 month</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Free User - Beyond 7-Day Limit */}
            {!isPro && !loadingSubscription && currentDate && (() => {
                const today = new Date();
                const planDate = new Date(currentDate);
                const daysDiff = Math.floor((today.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysDiff > 7) {
                    return (
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">History Locked</h2>
                                    <p className="text-lg text-blue-100">This date is beyond your 7-day free access</p>
                                </div>

                                <div className="px-6 py-8">
                                    <div className="text-center mb-8">
                                        <p className="text-gray-700 text-lg mb-4">
                                            You're trying to view <span className="font-semibold">{getFormattedDate(currentDate)}</span>
                                        </p>
                                        <p className="text-gray-600">
                                            That's <span className="font-bold text-blue-600">{daysDiff} days ago</span>, but free users can only access the last 7 days.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Upgrade to Pro to unlock:</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">Unlimited history access (view any past date)</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">Cloud sync across all devices</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">Project tracking & insights</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">Priority support</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => router.push('/upgrade')}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                                        >
                                            ✨ Upgrade to Pro — $1.99/month
                                        </button>
                                        <button
                                            onClick={goToToday}
                                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-medium hover:bg-gray-200 transition"
                                        >
                                            ← Back to Today
                                        </button>
                                    </div>

                                    <p className="text-center text-sm text-gray-500 mt-6">
                                        No credit card required for free tier • Cancel anytime
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {/* Show planner content only if within allowed date range */}
            {(isPro || loadingSubscription || !currentDate || (() => {
                const today = new Date();
                const planDate = new Date(currentDate);
                const daysDiff = Math.floor((today.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24));
                return daysDiff <= 7;
            })()) && (
                    <>
                        {/* Main Grid */}
                        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                            {/* Progress Summary */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                                    <p className="text-gray-600 text-xs sm:text-sm">Deep Work</p>
                                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{deepWork.filter(d => d.completed).length}/{deepWork.length}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                                    <p className="text-gray-600 text-xs sm:text-sm">Quick Wins</p>
                                    <p className="text-xl sm:text-2xl font-bold text-yellow-600">{quickWins.filter(q => q.completed).length}/{quickWins.length}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                                    <p className="text-gray-600 text-xs sm:text-sm">Make It Happen</p>
                                    <p className="text-xl sm:text-2xl font-bold text-red-600">{makeItHappen?.completed ? '✓' : '○'}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                                    <p className="text-gray-600 text-xs sm:text-sm">Little Joys</p>
                                    <p className="text-xl sm:text-2xl font-bold text-purple-600">{littleJoys.length}/3</p>
                                </div>
                            </div>

                            {/* Planning Zones Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <DeepWorkZone
                                    items={deepWork}
                                    onAdd={handleAddDeepWork}
                                    onUpdate={handleUpdateDeepWork}
                                    onDelete={handleDeleteDeepWork}
                                    disabled={isReadOnly}
                                />
                                <QuickWins
                                    items={quickWins}
                                    onAdd={handleAddQuickWin}
                                    onUpdate={handleUpdateQuickWin}
                                    onDelete={handleDeleteQuickWin}
                                    disabled={isReadOnly}
                                />
                                <MakeItHappen
                                    item={makeItHappen}
                                    onAdd={handleAddMakeItHappen}
                                    onUpdate={handleUpdateMakeItHappen}
                                    onDelete={handleDeleteMakeItHappen}
                                    disabled={isReadOnly}
                                />
                                <RechargeZone
                                    items={recharge}
                                    onAdd={handleAddRecharge}
                                    onUpdate={handleUpdateRecharge}
                                    onDelete={handleDeleteRecharge}
                                    disabled={isReadOnly}
                                />
                            </div>

                            {/* Evening Reflection */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <LittleJoys
                                    joys={littleJoys}
                                    onAdd={handleAddJoy}
                                    onDelete={handleDeleteJoy}
                                    disabled={isReadOnly}
                                />
                                <CoreMemories
                                    memories={coreMemories}
                                    currentDate={currentDate}
                                    onAdd={handleAddMemory}
                                    onDelete={handleDeleteMemory}
                                    disabled={isReadOnly}
                                />
                            </div>

                            {/* Project Updates Section */}
                            <div className="mt-4 sm:mt-6">
                                <ProjectUpdates
                                    projects={projects}
                                    updates={projectUpdates}
                                    currentDate={currentDate}
                                    onAddProject={handleAddProject}
                                    onAddUpdate={handleAddProjectUpdate}
                                    onDeleteUpdate={handleDeleteProjectUpdate}
                                    disabled={isReadOnly}
                                />
                            </div>

                            {/* Reflection & Focus */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                                <ReflectionToday
                                    content={reflection}
                                    onSave={setReflection}
                                    disabled={isReadOnly}
                                />
                                <FocusTomorrow
                                    content={focusTomorrow}
                                    onSave={setFocusTomorrow}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </main>
                    </>
                )}
        </div>
    );
}
