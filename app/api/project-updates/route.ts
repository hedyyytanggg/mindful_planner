import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import {
    createProjectUpdate,
    getProjectUpdatesByPlan,
    deleteProjectUpdate,
} from '@/lib/dbHelpers';

// Helper function to validate date is not more than 1 month ago (for creating/editing)
function validateDateNotTooOldForEditing(dateString: string): { valid: boolean; error?: string } {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Compare date strings to avoid time component issues
    const minDateStr = oneMonthAgo.toISOString().split('T')[0];

    if (dateString < minDateStr) {
        return {
            valid: false,
            error: 'Cannot create updates with dates older than 1 month'
        };
    }

    return { valid: true };
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const planId = url.searchParams.get('planId');

        if (!planId) {
            return NextResponse.json(
                { error: 'planId query parameter is required' },
                { status: 400 }
            );
        }

        const updates = await getProjectUpdatesByPlan(planId);

        return NextResponse.json({ updates });
    } catch (error) {
        console.error('Error fetching project updates:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { projectId, planId, updateDate, content } = body;

        if (!projectId || !planId || !updateDate || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: projectId, planId, updateDate, content' },
                { status: 400 }
            );
        }

        // Validate update date is not older than 1 month
        const dateValidation = validateDateNotTooOldForEditing(updateDate);
        if (!dateValidation.valid) {
            return NextResponse.json(
                { error: dateValidation.error },
                { status: 400 }
            );
        }

        const update = await createProjectUpdate(
            projectId,
            planId,
            updateDate,
            content.trim()
        );

        return NextResponse.json({ update }, { status: 201 });
    } catch (error) {
        console.error('Error creating project update:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'id query parameter is required' },
                { status: 400 }
            );
        }

        await deleteProjectUpdate(id);

        return NextResponse.json({ message: 'Update deleted successfully' });
    } catch (error) {
        console.error('Error deleting project update:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
