import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import {
    createCoreMemory,
    getCoreMemoriesByUser,
    getCoreMemoriesByUserAndDate,
    updateCoreMemory,
    deleteCoreMemory,
    getCoreMemoryById,
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
            error: 'Cannot create memories with dates older than 1 month'
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

        const userId = (session.user as any)?.id;
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        }

        const url = new URL(req.url);
        const memoryDate = url.searchParams.get('memoryDate');

        if (!memoryDate) {
            return NextResponse.json(
                { error: 'memoryDate query parameter is required' },
                { status: 400 }
            );
        }

        const memories = await getCoreMemoriesByUserAndDate(userId, memoryDate);

        return NextResponse.json({
            memories,
        });
    } catch (error) {
        console.error('Error fetching memories:', error);
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

        const userId = (session.user as any)?.id;
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        }

        const body = await req.json();
        const { title, description, memoryDate } = body;

        if (!title || !description || !memoryDate) {
            return NextResponse.json(
                { error: 'Missing required fields: title, description, memoryDate' },
                { status: 400 }
            );
        }

        // Validate memory date is not older than 1 month
        const dateValidation = validateDateNotTooOldForEditing(memoryDate);
        if (!dateValidation.valid) {
            return NextResponse.json(
                { error: dateValidation.error },
                { status: 400 }
            );
        }

        const memory = await createCoreMemory(
            userId,
            title,
            description,
            memoryDate
        );

        return NextResponse.json(
            { memory },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating memory:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
