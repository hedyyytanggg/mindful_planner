import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { getUserByEmail } from '@/lib/dbHelpers';
import { hasProAccess } from '@/lib/subscription';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const filter = searchParams.get('filter') || 'all';

        console.log('Quick Wins API called with:', { userId, filter });

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user session to check subscription status
        const session = await getServerSession(authOptions);
        let isPro = false;

        if (session?.user?.email) {
            const user = await getUserByEmail(session.user.email);
            isPro = user ? hasProAccess(user) : false;
        }

        // Calculate date range based on filter
        let dateCondition = '';
        const now = new Date();

        if (filter === 'thisWeek') {
            const startOfWeek = new Date(now);
            const dayOfWeek = startOfWeek.getDay();
            startOfWeek.setDate(now.getDate() - dayOfWeek);
            startOfWeek.setHours(0, 0, 0, 0);
            dateCondition = `AND dp.plandate >= '${startOfWeek.toISOString().split('T')[0]}'`;
        } else if (filter === 'thisMonth') {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            dateCondition = `AND dp.plandate >= '${monthStart.toISOString().split('T')[0]}'`;
        } else if (filter === 'last30') {
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(now.getDate() - 30);
            dateCondition = `AND dp.plandate >= '${thirtyDaysAgo.toISOString().split('T')[0]}'`;
        } else if (filter === 'last90') {
            const ninetyDaysAgo = new Date(now);
            ninetyDaysAgo.setDate(now.getDate() - 90);
            dateCondition = `AND dp.plandate >= '${ninetyDaysAgo.toISOString().split('T')[0]}'`;
        }

        // Apply 7-day limit for free users
        if (!isPro) {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            const freeUserLimit = `AND dp.plandate >= '${sevenDaysAgo.toISOString().split('T')[0]}'`;

            dateCondition = dateCondition
                ? `${dateCondition} ${freeUserLimit}`
                : freeUserLimit;
        }

        console.log('Date condition:', dateCondition);

        // Fetch all quick wins with their associated plan dates
        const quickWinsResult = await query(
            `SELECT 
                qw.id,
                qw.title,
                qw.completed,
                qw.createdat,
                qw.updatedat,
                dp.plandate
            FROM quick_wins qw
            JOIN daily_plans dp ON qw.planid = dp.id
            WHERE dp.userid = $1 ${dateCondition}
            ORDER BY dp.plandate DESC, qw.createdat DESC`,
            [userId]
        );

        console.log('Found quick wins:', quickWinsResult.rows.length);

        // Transform results
        const quickWins = quickWinsResult.rows.map((qw: any) => ({
            id: qw.id,
            title: qw.title,
            completed: qw.completed,
            completedAt: qw.updatedat, // Use updatedat as proxy for completion time
            createdAt: qw.createdat,
            planDate: qw.plandate instanceof Date
                ? qw.plandate.toISOString().split('T')[0]
                : qw.plandate,
        }));

        // Calculate statistics
        const total = quickWins.length;
        const completed = quickWins.filter(qw => qw.completed).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Group by date
        const byDate: { [key: string]: any[] } = {};
        quickWins.forEach(qw => {
            if (!byDate[qw.planDate]) {
                byDate[qw.planDate] = [];
            }
            byDate[qw.planDate].push(qw);
        });

        return NextResponse.json({
            quickWins,
            byDate,
            stats: {
                total,
                completed,
                incomplete: total - completed,
                completionRate,
            },
            isPro,
            limitApplied: !isPro
        });
    } catch (error: unknown) {
        console.error('Error fetching quick wins:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch quick wins',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
