import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { getUserByEmail } from '@/lib/dbHelpers';
import { hasProAccess } from '@/lib/subscription';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const filter = searchParams.get('filter') || 'last30';

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Get user session to check subscription status
        const session = await getServerSession(authOptions);
        let isPro = false;

        if (session?.user?.email) {
            const user = await getUserByEmail(session.user.email);
            isPro = user ? hasProAccess(user) : false;
        }

        // Calculate date filter
        let dateFilter = '';
        const today = new Date();

        if (filter === 'thisWeek') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            dateFilter = `AND dp.plandate >= '${startOfWeek.toISOString().split('T')[0]}'`;
        } else if (filter === 'thisMonth') {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            dateFilter = `AND dp.plandate >= '${startOfMonth.toISOString().split('T')[0]}'`;
        } else if (filter === 'last30') {
            const last30 = new Date(today);
            last30.setDate(today.getDate() - 30);
            dateFilter = `AND dp.plandate >= '${last30.toISOString().split('T')[0]}'`;
        }

        // Apply 7-day limit for free users
        if (!isPro) {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            const freeUserLimit = `AND dp.plandate >= '${sevenDaysAgo.toISOString().split('T')[0]}'`;

            dateFilter = dateFilter
                ? `${dateFilter} ${freeUserLimit}`
                : freeUserLimit;
        }

        // Fetch deep work zones
        const result = await query(`
            SELECT 
                dwz.id,
                dwz.title,
                dwz.timeestimate,
                dwz.notes,
                dwz.completed,
                dwz.updatedat as "completedAt",
                dwz.createdat as "createdAt",
                dp.plandate as "planDate"
            FROM deep_work_zones dwz
            INNER JOIN daily_plans dp ON dwz.planid = dp.id
            WHERE dp.userid = $1
            ${dateFilter}
            ORDER BY dp.plandate DESC, dwz.createdat DESC
        `, [userId]);

        // Transform results to ensure consistent date format
        const deepWorkZones = result.rows.map((zone: any) => ({
            ...zone,
            planDate: zone.planDate instanceof Date
                ? zone.planDate.toISOString().split('T')[0]
                : zone.planDate
        }));

        // Calculate stats
        const completedZones = deepWorkZones.filter(z => z.completed);
        const totalMinutes = completedZones.reduce((sum, z) => sum + (z.timeestimate || 0), 0);

        const stats = {
            total: deepWorkZones.length,
            completed: completedZones.length,
            incomplete: deepWorkZones.length - completedZones.length,
            completionRate: deepWorkZones.length > 0
                ? Math.round((completedZones.length / deepWorkZones.length) * 100)
                : 0,
            totalHours: Math.round(totalMinutes / 60 * 10) / 10
        };

        // Group by date
        const byDate: { [key: string]: any[] } = {};
        deepWorkZones.forEach(zone => {
            if (!byDate[zone.planDate]) {
                byDate[zone.planDate] = [];
            }
            byDate[zone.planDate].push(zone);
        });

        return NextResponse.json({
            deepWorkZones,
            byDate,
            stats,
            isPro,
            limitApplied: !isPro
        });

    } catch (error) {
        console.error('Error fetching deep work zones:', error);
        return NextResponse.json(
            { error: 'Failed to fetch deep work zones' },
            { status: 500 }
        );
    }
}
