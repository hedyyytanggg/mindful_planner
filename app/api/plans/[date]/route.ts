import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateDailyPlan, updateDailyPlan } from '@/lib/dbHelpers';

// Helper function to validate date is not more than 1 month ago (for editing)
function validateDateNotTooOldForEditing(dateString: string): { valid: boolean; error?: string } {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Compare date strings to avoid time component issues
    const minDateStr = oneMonthAgo.toISOString().split('T')[0];

    if (dateString < minDateStr) {
        return {
            valid: false,
            error: 'Cannot edit data older than 1 month'
        };
    }

    return { valid: true };
}

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

        // No date restriction for viewing - allow up to 1 year ago

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

        // Validate date is not older than 2 months for editing
        const dateValidation = validateDateNotTooOldForEditing(date);
        if (!dateValidation.valid) {
            return NextResponse.json(
                { error: dateValidation.error },
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
