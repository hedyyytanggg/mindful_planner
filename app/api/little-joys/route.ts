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

        // Fetch little joys
        const result = await query(`
            SELECT 
                lj.id,
                lj.joy as content,
                lj.createdat as "createdAt",
                dp.plandate as "planDate"
            FROM little_joys lj
            INNER JOIN daily_plans dp ON lj.planid = dp.id
            WHERE dp.userid = $1
            ${dateFilter}
            ORDER BY dp.plandate DESC, lj.createdat DESC
        `, [userId]);

        // Transform results to ensure consistent date format
        const joys = result.rows.map((joy: any) => ({
            ...joy,
            planDate: joy.planDate instanceof Date
                ? joy.planDate.toISOString().split('T')[0]
                : joy.planDate
        }));

        const stats = {
            total: joys.length
        };

        // Group by date
        const byDate: { [key: string]: any[] } = {};
        joys.forEach(joy => {
            if (!byDate[joy.planDate]) {
                byDate[joy.planDate] = [];
            }
            byDate[joy.planDate].push(joy);
        });

        return NextResponse.json({
            joys,
            byDate,
            stats
        });

    } catch (error) {
        console.error('Error fetching little joys:', error);
        return NextResponse.json(
            { error: 'Failed to fetch little joys' },
            { status: 500 }
        );
    }
}
