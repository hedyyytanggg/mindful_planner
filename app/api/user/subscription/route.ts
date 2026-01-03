import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';
import { getUserByEmail } from '@/lib/dbHelpers';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await getUserByEmail(session.user.email);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            tier: user.subscription_tier || 'free',
            status: user.subscription_status,
            endDate: user.subscription_end_date,
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}
