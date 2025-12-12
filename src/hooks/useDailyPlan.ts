/**
 * Custom Hook: useDailyPlan
 * 
 * Manages fetching and updating daily plans from the database
 * 
 * Usage:
 *   const { plan, loading, error, savePlan } = useDailyPlan(userId, date);
 */

import { useState, useEffect, useCallback } from 'react';

export interface DailyPlanData {
  id: number;
  user_id: number;
  plan_date: string;
  deep_work: any[];
  quick_wins: any[];
  make_it_happen: any | null;
  recharge_zone: any | null;
  little_joys: string[];
  reflection: string | null;
  focus_tomorrow: string | null;
  created_at: string;
  updated_at: string;
}

interface UseDailyPlanReturn {
  plan: DailyPlanData | null;
  loading: boolean;
  error: string | null;
  savePlan: (updates: Partial<DailyPlanData>) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useDailyPlan(
  userId: number | null,
  date: string
): UseDailyPlanReturn {
  const [plan, setPlan] = useState<DailyPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plan from database
  const fetchPlan = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/plans/${date}?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch plan: ${response.statusText}`);
      }

      const data = await response.json();
      setPlan(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching plan:', message);
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  // Fetch on mount and when userId/date changes
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  // Save plan to database
  const savePlan = useCallback(
    async (updates: Partial<DailyPlanData>) => {
      if (!userId) {
        setError('User ID is required');
        return;
      }

      try {
        setError(null);

        const response = await fetch(`/api/plans/${date}?userId=${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`Failed to save plan: ${response.statusText}`);
        }

        const updatedPlan = await response.json();
        setPlan(updatedPlan);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        console.error('Error saving plan:', message);
        throw err; // Re-throw so component can handle it
      }
    },
    [userId, date]
  );

  return {
    plan,
    loading,
    error,
    savePlan,
    refetch: fetchPlan,
  };
}
