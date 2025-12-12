/**
 * MIGRATION GUIDE: localStorage → PostgreSQL
 * 
 * This file shows how to update your Planner component to use the database
 * 
 * Before: Data saved to localStorage
 * After: Data saved to PostgreSQL via API routes
 */

// ============================================================================
// STEP 1: Replace localStorage functions with API calls
// ============================================================================

/**
 * Before: savePlanForDate saved to localStorage
 * 
 * const savePlanForDate = (date: string) => {
 *   const plan = { deepWork, quickWins, ... };
 *   localStorage.setItem(`plan_${date}`, JSON.stringify(plan));
 * };
 * 
 * After: savePlanForDate saves to database via API
 */

// In your component, replace the save/load functions with:

async function savePlanForDate(userId: number, date: string, plan: any) {
  try {
    const response = await fetch(`/api/plans/${date}?userId=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deep_work: plan.deepWork,
        quick_wins: plan.quickWins,
        make_it_happen: plan.makeItHappen,
        recharge_zone: plan.recharge,
        little_joys: plan.littleJoys,
        reflection: plan.reflection,
        focus_tomorrow: plan.focusTomorrow,
      }),
    });

    if (!response.ok) throw new Error('Failed to save plan');
    return await response.json();
  } catch (error) {
    console.error('Error saving plan:', error);
    // Fall back to localStorage for offline support
    localStorage.setItem(`plan_${date}`, JSON.stringify(plan));
  }
}

async function loadPlanForDate(userId: number, date: string) {
  try {
    const response = await fetch(`/api/plans/${date}?userId=${userId}`);

    if (!response.ok) throw new Error('Failed to load plan');

    return await response.json();
  } catch (error) {
    console.error('Error loading plan:', error);
    // Fall back to localStorage
    const saved = localStorage.getItem(`plan_${date}`);
    return saved ? JSON.parse(saved) : null;
  }
}

// ============================================================================
// STEP 2: Example usage in your component
// ============================================================================

/**
 * Updated useEffect to load data from database
 */

// Initialize date and load data from database
useEffect(() => {
  const today = new Date().toISOString().split('T')[0];
  setCurrentDate(today);
  
  // Load from database (replace with your actual userId)
  const userId = 1; // TODO: Get from session/context
  loadPlanForDate(userId, today).then((plan) => {
    if (plan) {
      setDeepWork(plan.deep_work || []);
      setQuickWins(plan.quick_wins || []);
      setMakeItHappen(plan.make_it_happen || null);
      setRecharge(plan.recharge_zone || null);
      setLittleJoys(plan.little_joys || []);
      setReflection(plan.reflection || null);
      setFocusTomorrow(plan.focus_tomorrow || null);
    }
  });
  
  setIsLoading(false);
}, []);

// Auto-save whenever any state changes
useEffect(() => {
  if (!isLoading && currentDate) {
    const userId = 1; // TODO: Get from session/context
    
    const plan = {
      deepWork,
      quickWins,
      makeItHappen,
      recharge,
      littleJoys,
      reflection,
      focusTomorrow,
    };
    
    savePlanForDate(userId, currentDate, plan);
  }
}, [deepWork, quickWins, makeItHappen, recharge, littleJoys, reflection, focusTomorrow, isLoading, currentDate]);

// ============================================================================
// STEP 3: Get userId from NextAuth session
// ============================================================================

import { useSession } from 'next-auth/react';

export default function PlannerPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id; // Get from your session structure

  // Then use userId in all your API calls
}

// ============================================================================
// STEP 4: Handle errors and offline mode
// ============================================================================

/**
 * For offline support, keep using localStorage as a backup
 * If database fails, it automatically falls back to localStorage
 * 
 * When user comes back online, retry saving:
 */

useEffect(() => {
  const handleOnline = () => {
    // Retry saving to database when connection restored
    if (currentDate && userId) {
      const plan = {
        deepWork,
        quickWins,
        makeItHappen,
        recharge,
        littleJoys,
        reflection,
        focusTomorrow,
      };
      savePlanForDate(userId, currentDate, plan);
    }
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, [userId, currentDate, deepWork, quickWins, makeItHappen, recharge, littleJoys, reflection, focusTomorrow]);
