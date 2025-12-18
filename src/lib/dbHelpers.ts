/**
 * Database utility functions for Mindful Daily Planner
 * Provides type-safe query helpers for common operations
 */

import { query } from './db';
import { randomBytes } from 'crypto';

// Generate a unique ID (similar to nanoid but simple)
function generateId(): string {
    return randomBytes(12).toString('hex').substring(0, 25);
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export interface User {
    id: string;
    email: string;
    name: string | null;
    password: string | null;
    timezone: string;
    createdAt: string;
    updatedAt: string;
}

export async function createUser(
    email: string,
    name: string,
    passwordHash: string,
    timezone: string = 'UTC'
): Promise<User> {
    try {
        const userId = generateId();
        const { rows } = await query<User>(
            `INSERT INTO users (id, email, name, password, timezone) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
            [userId, email, name, passwordHash, timezone]
        );
        if (!rows[0]) {
            throw new Error('No user returned from INSERT');
        }
        return rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const { rows } = await query<User>(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    }
}

export async function getUserById(id: string): Promise<User | null> {
    const { rows } = await query<User>(
        'SELECT * FROM users WHERE id = $1',
        [id]
    );
    return rows[0] || null;
}

export async function updateUserPassword(
    userId: string,
    newPasswordHash: string
): Promise<void> {
    try {
        await query(
            'UPDATE users SET password = $1, updatedAt = CURRENT_TIMESTAMP WHERE id = $2',
            [newPasswordHash, userId]
        );
    } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
    }
}

// ============================================================================
// DAILY PLAN OPERATIONS
// ============================================================================

export interface DailyPlan {
    id: string;
    userId: string;
    planDate: string;
    deep_work: any[];
    quick_wins: any[];
    make_it_happen: any | null;
    recharge_zone: any | null;
    little_joys: string[];
    reflection: string | null;
    focus_tomorrow: string | null;
    createdAt: string;
    updatedAt: string;
}

export async function getDailyPlan(
    userId: string,
    planDate: string
): Promise<DailyPlan | null> {
    const { rows } = await query<any>(
        `SELECT * FROM daily_plans 
         WHERE userId = $1 AND planDate = $2`,
        [userId, planDate]
    );

    if (!rows[0]) return null;

    const plan = rows[0];
    const planId = plan.id;

    // Load all detail data
    const [deepWorkRes, quickWinsRes, makeItHappenRes, rechargeZonesRes, littleJoysRes, reflectionRes, focusRes] = await Promise.all([
        query(`SELECT * FROM deep_work_zones WHERE planid = $1 ORDER BY createdat`, [planId]),
        query(`SELECT * FROM quick_wins WHERE planid = $1 ORDER BY createdat`, [planId]),
        query(`SELECT * FROM make_it_happen WHERE planid = $1 LIMIT 1`, [planId]),
        query(`SELECT * FROM recharge_zones WHERE planid = $1 ORDER BY createdat`, [planId]),
        query(`SELECT * FROM little_joys WHERE planid = $1 ORDER BY createdat`, [planId]),
        query(`SELECT * FROM reflections_today WHERE planid = $1 LIMIT 1`, [planId]),
        query(`SELECT * FROM focus_tomorrow WHERE planid = $1 LIMIT 1`, [planId]),
    ]);

    // Assemble the complete plan with all details
    const completePlan: DailyPlan = {
        id: plan.id,
        userId: plan.userId,
        planDate: plan.planDate,
        deep_work: deepWorkRes.rows,
        quick_wins: quickWinsRes.rows,
        make_it_happen: makeItHappenRes.rows[0] || null,
        recharge_zone: rechargeZonesRes.rows.map(r => ({
            id: r.id,
            activityId: r.activityid || r.activityId,
            customActivity: r.customactivity || r.customActivity,
            completed: r.completed,
            createdAt: r.createdat || r.createdAt,
            updatedAt: r.updatedat || r.updatedAt,
        })),
        little_joys: littleJoysRes.rows.map(r => r.joy || r.content),
        reflection: reflectionRes.rows[0]?.content || null,
        focus_tomorrow: focusRes.rows[0]?.content || null,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
    };

    console.log('📊 Loaded plan with recharge_zone:', completePlan.recharge_zone);

    return completePlan;
}

export async function getOrCreateDailyPlan(
    userId: string,
    planDate: string
): Promise<DailyPlan> {
    // First try to get existing plan
    let plan = await getDailyPlan(userId, planDate);
    if (plan) return plan;

    // Create new plan if it doesn't exist
    const planId = generateId();
    const { rows } = await query<DailyPlan>(
        `INSERT INTO daily_plans (id, userId, planDate, createdAt, updatedAt) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
         ON CONFLICT (userId, planDate) DO UPDATE 
         SET updatedAt = CURRENT_TIMESTAMP
         RETURNING *`,
        [planId, userId, planDate]
    );
    return rows[0];
}

// Helper functions for detail tables
async function saveDeepWorkZones(planId: string, items: any[]): Promise<void> {
    // Delete existing deep_work_zones for this plan
    await query(`DELETE FROM deep_work_zones WHERE planid = $1`, [planId]);

    // Insert new deep_work_zones
    for (const item of items) {
        if (item.title) {
            const zoneId = generateId();
            await query(
                `INSERT INTO deep_work_zones (id, planid, title, timeestimate, notes, completed, createdat, updatedat)
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [zoneId, planId, item.title, item.timeEstimate || null, item.notes || null, item.completed || false]
            );
        }
    }
}

async function saveQuickWins(planId: string, items: any[]): Promise<void> {
    // Delete existing quick_wins for this plan
    await query(`DELETE FROM quick_wins WHERE planid = $1`, [planId]);

    // Insert new quick_wins
    for (const item of items) {
        if (item.title) {
            const winId = generateId();
            await query(
                `INSERT INTO quick_wins (id, planid, title, completed, createdat, updatedat)
                 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [winId, planId, item.title, item.completed || false]
            );
        }
    }
}

async function saveMakeItHappen(planId: string, item: any): Promise<void> {
    // Delete existing make_it_happen for this plan
    await query(`DELETE FROM make_it_happen WHERE planid = $1`, [planId]);

    // Insert new make_it_happen if item exists
    if (item && item.task) {
        const taskId = generateId();
        await query(
            `INSERT INTO make_it_happen (id, planid, task, completed, createdat, updatedat)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [taskId, planId, item.task, item.completed || false]
        );
    }
}

async function saveRechargeZones(planId: string, items: any[]): Promise<void> {
    // Delete existing recharge_zones for this plan
    await query(`DELETE FROM recharge_zones WHERE planid = $1`, [planId]);

    // Insert new recharge_zones
    for (const item of items) {
        if (item.activityId || item.customActivity) {
            const zoneId = generateId();
            await query(
                `INSERT INTO recharge_zones (id, planid, activityid, customactivity, completed, createdat, updatedat)
                 VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [zoneId, planId, item.activityId || null, item.customActivity || null, item.completed || false]
            );
        }
    }
}

async function saveLittleJoys(planId: string, items: string[]): Promise<void> {
    // Delete existing little_joys for this plan
    await query(`DELETE FROM little_joys WHERE planid = $1`, [planId]);

    // Insert new little_joys
    for (const content of items) {
        if (content && content.trim()) {
            const joyId = generateId();
            await query(
                `INSERT INTO little_joys (id, planid, joy, createdat)
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
                [joyId, planId, content.trim()]
            );
        }
    }
}

async function saveReflectionToday(planId: string, content: string | null): Promise<void> {
    // Delete existing reflection for this plan
    await query(`DELETE FROM reflections_today WHERE planid = $1`, [planId]);

    // Insert new reflection if content exists
    if (content && content.trim()) {
        const reflectionId = generateId();
        await query(
            `INSERT INTO reflections_today (id, planid, content, createdat, updatedat)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [reflectionId, planId, content.trim()]
        );
    }
}

async function saveFocusTomorrow(planId: string, content: string | null): Promise<void> {
    // Delete existing focus_tomorrow for this plan
    await query(`DELETE FROM focus_tomorrow WHERE planid = $1`, [planId]);

    // Insert new focus_tomorrow if content exists
    if (content && content.trim()) {
        const focusId = generateId();
        await query(
            `INSERT INTO focus_tomorrow (id, planid, content, createdat, updatedat)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [focusId, planId, content.trim()]
        );
    }
}

// ============================================================================
// CORE MEMORIES OPERATIONS
// ============================================================================

export interface CoreMemory {
    id: string;
    userId: string;
    title: string;
    description: string;
    memoryDate: string;
    createdAt: string;
    updatedAt: string;
}

export async function createCoreMemory(
    userId: string,
    title: string,
    description: string,
    memoryDate: string
): Promise<CoreMemory> {
    try {
        const memoryId = generateId();
        // Convert userId to number if possible, otherwise keep as string
        const userIdValue = isNaN(Number(userId)) ? userId : Number(userId);
        const { rows } = await query<any>(
            `INSERT INTO core_memories (id, userid, title, description, memorydate, createdat, updatedat)
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [memoryId, userIdValue, title, description, memoryDate]
        );
        if (!rows[0]) {
            throw new Error('No memory returned from INSERT');
        }
        // Transform snake_case to camelCase
        return transformMemory(rows[0]);
    } catch (error) {
        console.error('Error creating core memory:', error);
        throw error;
    }
}

function transformMemory(dbMemory: any): CoreMemory {
    return {
        id: dbMemory.id,
        userId: String(dbMemory.userid || dbMemory.userId || dbMemory.user_id || ''),
        title: dbMemory.title,
        description: dbMemory.description,
        memoryDate: dbMemory.memorydate || dbMemory.memoryDate || dbMemory.memory_date,
        createdAt: dbMemory.createdat || dbMemory.createdAt || dbMemory.created_at,
        updatedAt: dbMemory.updatedat || dbMemory.updatedAt || dbMemory.updated_at,
    };
}

export async function getCoreMemoriesByUser(userId: string): Promise<CoreMemory[]> {
    try {
        // Convert userId to number if possible
        const userIdValue = isNaN(Number(userId)) ? userId : Number(userId);
        const { rows } = await query<any>(
            `SELECT * FROM core_memories WHERE userid = $1 ORDER BY memorydate DESC, createdat DESC`,
            [userIdValue]
        );
        return rows.map(transformMemory);
    } catch (error) {
        console.error('Error fetching core memories:', error);
        throw error;
    }
}

export async function getCoreMemoriesByUserAndDate(userId: string, memoryDate: string): Promise<CoreMemory[]> {
    try {
        // Convert userId to number if possible
        const userIdValue = isNaN(Number(userId)) ? userId : Number(userId);
        const { rows } = await query<any>(
            `SELECT * FROM core_memories WHERE userid = $1 AND memorydate = $2 ORDER BY createdat DESC`,
            [userIdValue, memoryDate]
        );
        return rows.map(transformMemory);
    } catch (error) {
        console.error('Error fetching core memories by date:', error);
        throw error;
    }
}

export async function getCoreMemoryById(id: string): Promise<CoreMemory | null> {
    try {
        const { rows } = await query<any>(
            `SELECT * FROM core_memories WHERE id = $1`,
            [id]
        );
        return rows[0] ? transformMemory(rows[0]) : null;
    } catch (error) {
        console.error('Error fetching core memory:', error);
        throw error;
    }
}

export async function updateCoreMemory(
    id: string,
    updates: Partial<Omit<CoreMemory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<CoreMemory> {
    try {
        const allowedFields = ['title', 'description', 'memoryDate'];

        const setClause = Object.keys(updates)
            .filter((key) => allowedFields.includes(key))
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');

        if (!setClause) {
            const existing = await getCoreMemoryById(id);
            if (!existing) throw new Error('Core memory not found');
            return existing;
        }

        const values = [
            id,
            ...Object.keys(updates)
                .filter((key) => allowedFields.includes(key))
                .map((key) => updates[key as keyof typeof updates]),
        ];

        const { rows } = await query<any>(
            `UPDATE core_memories 
             SET ${setClause}, updatedAt = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            values
        );
        if (!rows[0]) {
            throw new Error('Core memory not found');
        }
        return transformMemory(rows[0]);
    } catch (error: unknown) {
        console.error('Error updating core memory:', error);
        throw error;
    }
}

export async function deleteCoreMemory(id: string): Promise<void> {
    try {
        await query(`DELETE FROM core_memories WHERE id = $1`, [id]);
    } catch (error) {
        console.error('Error deleting core memory:', error);
        throw error;
    }
}

// ============================================================================
// PROJECTS & PROJECT UPDATES OPERATIONS
// ============================================================================

export interface Project {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectUpdate {
    id: string;
    projectId: string;
    planId: string;
    updateDate: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    projectName?: string; // For joined queries
}

// Projects
export async function createProject(
    userId: string,
    name: string,
    description: string | null
): Promise<Project> {
    try {
        const projectId = generateId();
        const { rows } = await query<any>(
            `INSERT INTO projects (id, userid, name, description, isactive, createdat, updatedat)
             VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [projectId, userId, name, description]
        );
        return transformProject(rows[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

export async function getProjectsByUser(userId: string, activeOnly: boolean = true): Promise<Project[]> {
    try {
        const query_text = activeOnly
            ? `SELECT * FROM projects WHERE userid = $1 AND isactive = true ORDER BY name`
            : `SELECT * FROM projects WHERE userid = $1 ORDER BY name`;
        const { rows } = await query<any>(query_text, [userId]);
        return rows.map(transformProject);
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

export async function getProjectById(id: string): Promise<Project | null> {
    try {
        const { rows } = await query<any>(
            `SELECT * FROM projects WHERE id = $1`,
            [id]
        );
        return rows[0] ? transformProject(rows[0]) : null;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
}

export async function updateProject(
    id: string,
    updates: Partial<Pick<Project, 'name' | 'description' | 'isActive'>>
): Promise<Project> {
    try {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (updates.name !== undefined) {
            fields.push(`name = $${paramCount++}`);
            values.push(updates.name);
        }
        if (updates.description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(updates.description);
        }
        if (updates.isActive !== undefined) {
            fields.push(`isactive = $${paramCount++}`);
            values.push(updates.isActive);
        }

        if (fields.length === 0) {
            const existing = await getProjectById(id);
            if (!existing) throw new Error('Project not found');
            return existing;
        }

        fields.push(`updatedat = CURRENT_TIMESTAMP`);
        values.push(id);

        const { rows } = await query<any>(
            `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );
        return transformProject(rows[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}

export async function deleteProject(id: string): Promise<void> {
    try {
        await query(`DELETE FROM projects WHERE id = $1`, [id]);
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

function transformProject(dbRow: any): Project {
    return {
        id: dbRow.id,
        userId: String(dbRow.userid || dbRow.userId || dbRow.user_id || ''),
        name: dbRow.name,
        description: dbRow.description,
        isActive: dbRow.isactive ?? dbRow.isActive ?? true,
        createdAt: dbRow.createdat || dbRow.createdAt || dbRow.created_at,
        updatedAt: dbRow.updatedat || dbRow.updatedAt || dbRow.updated_at,
    };
}

// Project Updates
export async function createProjectUpdate(
    projectId: string,
    planId: string,
    updateDate: string,
    content: string
): Promise<ProjectUpdate> {
    try {
        const updateId = generateId();
        const { rows } = await query<any>(
            `INSERT INTO project_updates (id, projectid, planid, updatedate, content, createdat, updatedat)
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING 
                project_updates.*,
                (SELECT name FROM projects WHERE id = $2) as projectname`,
            [updateId, projectId, planId, updateDate, content]
        );
        return transformProjectUpdate(rows[0]);
    } catch (error) {
        console.error('Error creating project update:', error);
        throw error;
    }
}

export async function getProjectUpdatesByPlan(planId: string): Promise<ProjectUpdate[]> {
    try {
        const { rows } = await query<any>(
            `SELECT pu.*, p.name as projectname 
             FROM project_updates pu
             LEFT JOIN projects p ON pu.projectid = p.id
             WHERE pu.planid = $1 
             ORDER BY pu.createdat DESC`,
            [planId]
        );
        return rows.map(transformProjectUpdate);
    } catch (error) {
        console.error('Error fetching project updates:', error);
        throw error;
    }
}

export async function getProjectUpdatesByProject(projectId: string): Promise<ProjectUpdate[]> {
    try {
        const { rows } = await query<any>(
            `SELECT * FROM project_updates WHERE projectid = $1 ORDER BY updatedate DESC, createdat DESC`,
            [projectId]
        );
        return rows.map(transformProjectUpdate);
    } catch (error) {
        console.error('Error fetching project updates:', error);
        throw error;
    }
}

export async function deleteProjectUpdate(id: string): Promise<void> {
    try {
        await query(`DELETE FROM project_updates WHERE id = $1`, [id]);
    } catch (error) {
        console.error('Error deleting project update:', error);
        throw error;
    }
}

function transformProjectUpdate(dbRow: any): ProjectUpdate {
    const update: ProjectUpdate = {
        id: dbRow.id,
        projectId: String(dbRow.projectid || dbRow.projectId || dbRow.project_id || ''),
        planId: String(dbRow.planid || dbRow.planId || dbRow.plan_id || ''),
        updateDate: dbRow.updatedate || dbRow.updateDate || dbRow.update_date,
        content: dbRow.content,
        createdAt: dbRow.createdat || dbRow.createdAt || dbRow.created_at,
        updatedAt: dbRow.updatedat || dbRow.updatedAt || dbRow.updated_at,
    };
    if (dbRow.projectname || dbRow.projectName || dbRow.project_name) {
        update.projectName = dbRow.projectname || dbRow.projectName || dbRow.project_name;
    }
    return update;
}

export async function updateDailyPlan(
    userId: string,
    planDate: string,
    planData: {
        deep_work?: any[];
        quick_wins?: any[];
        make_it_happen?: any;
        recharge_zone?: any[];
        little_joys?: string[];
        reflection?: string;
        focus_tomorrow?: string;
    }
): Promise<DailyPlan> {
    // Get or create the daily plan first
    const plan = await getOrCreateDailyPlan(userId, planDate);
    const planId = plan.id;

    // Save all the nested detail data
    if (planData.deep_work) {
        await saveDeepWorkZones(planId, planData.deep_work);
    }
    if (planData.quick_wins) {
        await saveQuickWins(planId, planData.quick_wins);
    }
    if (planData.make_it_happen) {
        await saveMakeItHappen(planId, planData.make_it_happen);
    }
    if (planData.recharge_zone) {
        await saveRechargeZones(planId, planData.recharge_zone);
    }
    if (planData.little_joys) {
        await saveLittleJoys(planId, planData.little_joys);
    }
    if (planData.reflection !== undefined) {
        await saveReflectionToday(planId, planData.reflection);
    }
    if (planData.focus_tomorrow !== undefined) {
        await saveFocusTomorrow(planId, planData.focus_tomorrow);
    }

    // Update the daily_plans record's timestamp
    await query(
        `UPDATE daily_plans SET updatedAt = CURRENT_TIMESTAMP WHERE id = $1`,
        [planId]
    );

    // Return the updated plan
    return (await getDailyPlan(userId, planDate))!;
}

export async function getUserPlans(
    userId: string,
    limit: number = 30
): Promise<DailyPlan[]> {
    const { rows } = await query<any>(
        `SELECT * FROM daily_plans 
     WHERE "userId" = $1 
     ORDER BY "planDate" DESC 
     LIMIT $2`,
        [userId, limit]
    );

    // Load detail data for each plan
    const plans: DailyPlan[] = [];
    for (const plan of rows) {
        const completePlan = await getDailyPlan(userId, plan.planDate);
        if (completePlan) {
            plans.push(completePlan);
        }
    }
    return plans;
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
