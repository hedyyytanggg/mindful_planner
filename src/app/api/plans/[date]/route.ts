/**
 * Example API Route: Get Daily Plan
 * 
 * Demonstrates how to use the database helpers
 * 
 * Endpoint: GET /api/plans/[date]
 * Query: ?userId=123
 * 
 * Response: { id, user_id, plan_date, deep_work, quick_wins, ... }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateDailyPlan, updateDailyPlan } from '@/lib/dbHelpers';

// GET /api/plans/[date]?userId=123
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ date: string }> }
) {
    try {
        const { date } = await context.params;
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId parameter' },
                { status: 400 }
            );
        }

        const plan = await getOrCreateDailyPlan(parseInt(userId), date);

        return NextResponse.json(plan);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plan' },
            { status: 500 }
        );
    }
}

// PATCH /api/plans/[date]?userId=123
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ date: string }> }
) {
    try {
        const { date } = await context.params;
        const userId = request.nextUrl.searchParams.get('userId');
        const updates = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId parameter' },
                { status: 400 }
            );
        }

        const plan = await updateDailyPlan(parseInt(userId), date, updates);

        return NextResponse.json(plan);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to update plan' },
            { status: 500 }
        );
    }
}
