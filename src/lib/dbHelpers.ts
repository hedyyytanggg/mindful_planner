/**
 * Database utility functions for Mindful Daily Planner
 * Provides type-safe query helpers for common operations
 */

import { query } from './db';

// ============================================================================
// USER OPERATIONS
// ============================================================================

export interface User {
    id: number;
    email: string;
    name: string | null;
    password_hash: string | null;
    timezone: string;
    created_at: string;
    updated_at: string;
}

export async function createUser(
    email: string,
    name: string,
    passwordHash: string,
    timezone: string = 'UTC'
): Promise<User> {
    const { rows } = await query<User>(
        `INSERT INTO users (email, name, password_hash, timezone) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
        [email, name, passwordHash, timezone]
    );
    return rows[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const { rows } = await query<User>(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return rows[0] || null;
}

export async function getUserById(id: number): Promise<User | null> {
    const { rows } = await query<User>(
        'SELECT * FROM users WHERE id = $1',
        [id]
    );
    return rows[0] || null;
}

// ============================================================================
// DAILY PLAN OPERATIONS
// ============================================================================

export interface DailyPlan {
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

export async function getDailyPlan(
    userId: number,
    planDate: string
): Promise<DailyPlan | null> {
    const { rows } = await query<DailyPlan>(
        `SELECT * FROM daily_plans 
     WHERE user_id = $1 AND plan_date = $2`,
        [userId, planDate]
    );
    return rows[0] || null;
}

export async function getOrCreateDailyPlan(
    userId: number,
    planDate: string
): Promise<DailyPlan> {
    // First try to get existing plan
    let plan = await getDailyPlan(userId, planDate);
    if (plan) return plan;

    // Create new plan if it doesn't exist
    const { rows } = await query<DailyPlan>(
        `INSERT INTO daily_plans (user_id, plan_date) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, plan_date) DO UPDATE 
     SET updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
        [userId, planDate]
    );
    return rows[0];
}

export async function updateDailyPlan(
    userId: number,
    planDate: string,
    updates: Partial<DailyPlan>
): Promise<DailyPlan> {
    const allowedFields = [
        'deep_work',
        'quick_wins',
        'make_it_happen',
        'recharge_zone',
        'little_joys',
        'reflection',
        'focus_tomorrow',
    ];

    const setClause = Object.keys(updates)
        .filter((key) => allowedFields.includes(key))
        .map((key, index) => `${key} = $${index + 3}`)
        .join(', ');

    if (!setClause) {
        return (await getDailyPlan(userId, planDate))!;
    }

    const values = [
        userId,
        planDate,
        ...Object.keys(updates)
            .filter((key) => allowedFields.includes(key))
            .map((key) => updates[key as keyof typeof updates]),
    ];

    const { rows } = await query<DailyPlan>(
        `UPDATE daily_plans 
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND plan_date = $2
     RETURNING *`,
        values
    );
    return rows[0];
}

export async function getUserPlans(
    userId: number,
    limit: number = 30
): Promise<DailyPlan[]> {
    const { rows } = await query<DailyPlan>(
        `SELECT * FROM daily_plans 
     WHERE user_id = $1 
     ORDER BY plan_date DESC 
     LIMIT $2`,
        [userId, limit]
    );
    return rows;
}

// ============================================================================
// DEEP WORK ZONES OPERATIONS
// ============================================================================

export interface DeepWorkZone {
    id: number;
    daily_plan_id: number;
    title: string;
    time_estimate: number | null;
    notes: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export async function createDeepWorkZone(
    dailyPlanId: number,
    title: string,
    timeEstimate?: number,
    notes?: string
): Promise<DeepWorkZone> {
    const { rows } = await query<DeepWorkZone>(
        `INSERT INTO deep_work_zones (daily_plan_id, title, time_estimate, notes) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
        [dailyPlanId, title, timeEstimate || null, notes || null]
    );
    return rows[0];
}

// ============================================================================
// APP SETTINGS OPERATIONS
// ============================================================================

export interface AppSettings {
    id: number;
    user_id: number;
    theme: string;
    notifications_enabled: boolean;
    email_digest_enabled: boolean;
    daily_reminder_enabled: boolean;
    daily_reminder_time: string;
    created_at: string;
    updated_at: string;
}

export async function getAppSettings(userId: number): Promise<AppSettings | null> {
    const { rows } = await query<AppSettings>(
        'SELECT * FROM app_settings WHERE user_id = $1',
        [userId]
    );
    return rows[0] || null;
}

export async function createAppSettings(userId: number): Promise<AppSettings> {
    const { rows } = await query<AppSettings>(
        `INSERT INTO app_settings (user_id) 
     VALUES ($1) 
     RETURNING *`,
        [userId]
    );
    return rows[0];
}

export async function updateAppSettings(
    userId: number,
    updates: Partial<AppSettings>
): Promise<AppSettings> {
    const allowedFields = [
        'theme',
        'notifications_enabled',
        'email_digest_enabled',
        'daily_reminder_enabled',
        'daily_reminder_time',
    ];

    const setClause = Object.keys(updates)
        .filter((key) => allowedFields.includes(key))
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

    if (!setClause) {
        return (await getAppSettings(userId))!;
    }

    const values = [
        userId,
        ...Object.keys(updates)
            .filter((key) => allowedFields.includes(key))
            .map((key) => updates[key as keyof typeof updates]),
    ];

    const { rows } = await query<AppSettings>(
        `UPDATE app_settings 
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1
     RETURNING *`,
        values
    );
    return rows[0];
}
