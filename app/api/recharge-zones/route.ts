import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const filter = searchParams.get('filter') || 'last30';

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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

        // Fetch recharge zones
        const result = await query(`
            SELECT 
                rz.id,
                rz.activityid as "activityId",
                rz.customactivity as "customActivity",
                rz.completed,
                rz.updatedat as "completedAt",
                rz.createdat as "createdAt",
                dp.plandate as "planDate"
            FROM recharge_zones rz
            INNER JOIN daily_plans dp ON rz.planid = dp.id
            WHERE dp.userid = $1
            ${dateFilter}
            ORDER BY dp.plandate DESC, rz.createdat DESC
        `, [userId]);

        // Transform results to ensure consistent date format
        const activities = result.rows.map((activity: any) => ({
            ...activity,
            planDate: activity.planDate instanceof Date
                ? activity.planDate.toISOString().split('T')[0]
                : activity.planDate
        }));

        // Calculate stats
        const completedActivities = activities.filter(a => a.completed);

        const stats = {
            total: activities.length,
            completed: completedActivities.length,
            incomplete: activities.length - completedActivities.length,
            completionRate: activities.length > 0
                ? Math.round((completedActivities.length / activities.length) * 100)
                : 0
        };

        // Group by date
        const byDate: { [key: string]: any[] } = {};
        activities.forEach(activity => {
            if (!byDate[activity.planDate]) {
                byDate[activity.planDate] = [];
            }
            byDate[activity.planDate].push(activity);
        });

        return NextResponse.json({
            activities,
            byDate,
            stats
        });

    } catch (error) {
        console.error('Error fetching recharge zones:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recharge zones' },
            { status: 500 }
        );
    }
}
