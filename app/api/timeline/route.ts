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

        console.log('Timeline API called with:', { userId, filter });

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

        console.log('User subscription status:', { isPro });

        // Calculate date range based on filter
        let dateCondition = '';
        const now = new Date();

        if (filter === 'thisWeek') {
            // Get the start of the current week (Sunday)
            const startOfWeek = new Date(now);
            const dayOfWeek = startOfWeek.getDay(); // 0 = Sunday, 6 = Saturday
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
        }

        // Apply 7-day limit for free users
        if (!isPro) {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            const freeUserLimit = `AND dp.plandate >= '${sevenDaysAgo.toISOString().split('T')[0]}'`;

            // Combine with existing date condition if present
            dateCondition = dateCondition
                ? `${dateCondition} ${freeUserLimit}`
                : freeUserLimit;

            console.log('Applied 7-day limit for free user');
        }

        console.log('Date condition:', dateCondition);

        // Fetch all plans with counts from related tables
        const plansResult = await query(
            `SELECT 
                dp.id,
                dp.plandate,
                COUNT(DISTINCT dw.id) FILTER (WHERE dw.id IS NOT NULL) as deep_work_count,
                COUNT(DISTINCT dw.id) FILTER (WHERE dw.id IS NOT NULL AND dw.completed = true) as deep_work_completed,
                COUNT(DISTINCT qw.id) FILTER (WHERE qw.id IS NOT NULL) as quick_wins_count,
                COUNT(DISTINCT qw.id) FILTER (WHERE qw.id IS NOT NULL AND qw.completed = true) as quick_wins_completed,
                COUNT(DISTINCT cm.id) as memories_count,
                COUNT(DISTINCT pu.id) as updates_count
            FROM daily_plans dp
            LEFT JOIN deep_work_zones dw ON dw.planid = dp.id
            LEFT JOIN quick_wins qw ON qw.planid = dp.id
            LEFT JOIN core_memories cm ON cm.memorydate = dp.plandate AND cm.userid = dp.userid
            LEFT JOIN project_updates pu ON pu.planid = dp.id
            WHERE dp.userid = $1 ${dateCondition}
            GROUP BY dp.id, dp.plandate
            ORDER BY dp.plandate DESC`,
            [userId]
        );

        console.log('Found plans:', plansResult.rows.length);

        // Transform results
        const entries = plansResult.rows.map((plan: any) => {
            // Format date properly (convert from Date object to YYYY-MM-DD string)
            const planDate = plan.plandate instanceof Date
                ? plan.plandate.toISOString().split('T')[0]
                : plan.plandate;

            return {
                date: planDate,
                deepWorkCount: parseInt(plan.deep_work_count) || 0,
                deepWorkCompleted: parseInt(plan.deep_work_completed) || 0,
                quickWinsCount: parseInt(plan.quick_wins_count) || 0,
                quickWinsCompleted: parseInt(plan.quick_wins_completed) || 0,
                makeItHappenCompleted: false, // TODO: Add make_it_happen table
                rechargeCount: 0, // TODO: Add recharge table
                littleJoysCount: 0, // TODO: Add little_joys table
                hasReflection: false, // TODO: Add to daily_plans table
                hasFocusTomorrow: false, // TODO: Add to daily_plans table
                coreMemoriesCount: parseInt(plan.memories_count) || 0,
                projectUpdatesCount: parseInt(plan.updates_count) || 0,
            };
        }).filter(entry => {
            // Filter out entries with no activity at all
            return entry.deepWorkCount > 0 ||
                entry.quickWinsCount > 0 ||
                entry.coreMemoriesCount > 0 ||
                entry.projectUpdatesCount > 0;
        });

        return NextResponse.json({
            entries,
            total: entries.length,
            isPro,
            limitApplied: !isPro,
        });
    } catch (error: unknown) {
        console.error('Error fetching timeline:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch timeline',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
