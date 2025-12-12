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

        const plan = await getOrCreateDailyPlan(userId, date);

        return NextResponse.json(plan);
    } catch (error) {
        console.error('API GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plan', details: String(error) },
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

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId parameter' },
                { status: 400 }
            );
        }

        const body = await request.json();

        const plan = await updateDailyPlan(userId, date, body);

        return NextResponse.json(plan);
    } catch (error) {
        console.error('API PATCH error:', error);
        return NextResponse.json(
            { error: 'Failed to update plan', details: String(error) },
            { status: 500 }
        );
    }
}
