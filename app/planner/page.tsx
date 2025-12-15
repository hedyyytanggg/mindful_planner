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
import { Button } from '@/components/Common';

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

export default function PlannerPage() {
    // Get user from session
    const router = useRouter();
    const sessionData = useSession();
    const userId = (sessionData?.data?.user as any)?.id;
    const authStatus = sessionData?.status || 'loading';

    // Redirect to login if not authenticated
    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [authStatus, router]);

    // Date State
    const [currentDate, setCurrentDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

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

    // Initialize date and load data from database or localStorage
    useEffect(() => {
        if (authStatus === 'loading') return;

        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
        loadPlanForDate(today);
        setIsLoading(false);
    }, [authStatus, userId]);

    // Save plan to database (with localStorage fallback)
    const savePlanForDate = async (date: string) => {
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
        await loadPlanForDate(newDate);
    };

    // Navigate to previous day
    const goToPreviousDay = () => {
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

    // Navigate to today
    const goToToday = () => {
        const today = new Date().toISOString().split('T')[0];
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
        setRecharge([...recharge, newItem]);
    };

    const handleUpdateRecharge = (id: string, updates: Partial<RechargeItem>) => {
        setRecharge(recharge.map(item => (item.id === id ? { ...item, ...updates } : item)));
    };

    const handleDeleteRecharge = (id: string) => {
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

    // Export Plan
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

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
            {/* Authentication and Status Check */}
            {authStatus === 'loading' && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                    <p className="text-center text-sm text-blue-700">⏳ Loading your session...</p>
                </div>
            )}

            {authStatus === 'unauthenticated' && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
                    <p className="text-center text-sm text-yellow-700">
                        📝 Not signed in. Data will be saved locally only.{' '}
                        <a href="/login" className="font-semibold text-yellow-900 hover:text-yellow-800 underline">
                            Sign in here
                        </a>
                    </p>
                </div>
            )}

            {saveError && (
                <div className="bg-red-50 border-b border-red-200 px-6 py-3">
                    <p className="text-center text-sm text-red-700">
                        ⚠️ {saveError}
                    </p>
                </div>
            )}

            {/* Planner Subheader */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">🧘 Your Daily Plan</h1>
                            <p className="text-sm text-gray-600">
                                {currentDate && (() => {
                                    const [year, month, day] = currentDate.split('-').map(Number);
                                    const date = new Date(year, month - 1, day);
                                    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                })()}
                                {isSaving && <span className="ml-2 text-blue-600">💾 Saving...</span>}
                                {!isSaving && userId && <span className="ml-2 text-green-600">✓ Synced</span>}
                                {!userId && <span className="ml-2 text-gray-500">📱 Local only</span>}
                            </p>
                        </div>
                        <Button onClick={handleExport} variant="secondary">
                            📥 Export
                        </Button>
                    </div>

                    {/* Date Navigation */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                        <button
                            onClick={goToPreviousDay}
                            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Go to previous day"
                        >
                            ← Prev
                        </button>

                        <input
                            type="date"
                            value={currentDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Select a date"
                        />

                        <button
                            onClick={goToNextDay}
                            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Go to next day"
                        >
                            Next →
                        </button>

                        <div className="flex-1" />

                        <button
                            onClick={goToToday}
                            className="px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Go to today"
                            title="Jump to today"
                        >
                            📅 Today
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Progress Summary */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-sm">Deep Work</p>
                        <p className="text-2xl font-bold text-blue-600">{deepWork.filter(d => d.completed).length}/{deepWork.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-sm">Quick Wins</p>
                        <p className="text-2xl font-bold text-yellow-600">{quickWins.filter(q => q.completed).length}/{quickWins.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-sm">Make It Happen</p>
                        <p className="text-2xl font-bold text-red-600">{makeItHappen?.completed ? '✓' : '○'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-sm">Little Joys</p>
                        <p className="text-2xl font-bold text-purple-600">{littleJoys.length}/3</p>
                    </div>
                </div>

                {/* Planning Zones Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <DeepWorkZone
                        items={deepWork}
                        onAdd={handleAddDeepWork}
                        onUpdate={handleUpdateDeepWork}
                        onDelete={handleDeleteDeepWork}
                    />
                    <QuickWins
                        items={quickWins}
                        onAdd={handleAddQuickWin}
                        onUpdate={handleUpdateQuickWin}
                        onDelete={handleDeleteQuickWin}
                    />
                    <MakeItHappen
                        item={makeItHappen}
                        onAdd={handleAddMakeItHappen}
                        onUpdate={handleUpdateMakeItHappen}
                        onDelete={handleDeleteMakeItHappen}
                    />
                    <RechargeZone
                        items={recharge}
                        onAdd={handleAddRecharge}
                        onUpdate={handleUpdateRecharge}
                        onDelete={handleDeleteRecharge}
                    />
                </div>

                {/* Evening Reflection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LittleJoys
                        joys={littleJoys}
                        onAdd={handleAddJoy}
                        onDelete={handleDeleteJoy}
                    />
                </div>

                {/* Core Memories Section */}
                <div className="mt-8">
                    <CoreMemories
                        memories={coreMemories}
                        currentDate={currentDate}
                        onAdd={handleAddMemory}
                        onDelete={handleDeleteMemory}
                    />
                </div>

                {/* Reflection & Focus */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <ReflectionToday
                        content={reflection}
                        onSave={setReflection}
                    />
                    <FocusTomorrow
                        content={focusTomorrow}
                        onSave={setFocusTomorrow}
                    />
                </div>
            </main>
        </div>
    );
}
