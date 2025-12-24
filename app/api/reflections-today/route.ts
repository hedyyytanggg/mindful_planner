import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const filter = searchParams.get('filter') || 'last30';

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        // Determine date filter
        let dateFilter = '';
        const today = new Date();

        if (filter === 'thisWeek') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Start of this week (Sunday)
            dateFilter = `AND dp.plandate >= '${startOfWeek.toISOString().split('T')[0]}'`;
        } else if (filter === 'last30') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            dateFilter = `AND dp.plandate >= '${thirtyDaysAgo.toISOString().split('T')[0]}'`;
        } else if (filter === 'thisMonth') {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            dateFilter = `AND dp.plandate >= '${startOfMonth.toISOString().split('T')[0]}'`;
        }

        // Fetch all reflections
        const result = await query(
            `
            SELECT 
                rt.id,
                rt.content,
                rt.createdat as "createdAt",
                dp.plandate as "planDate"
            FROM reflections_today rt
            INNER JOIN daily_plans dp ON rt.planid = dp.id
            WHERE dp.userid = $1 ${dateFilter}
            ORDER BY dp.plandate DESC
            `,
            [userId]
        );

        const reflections = result.rows;

        // Transform dates to ISO strings before grouping
        const reflectionsWithStringDates = reflections.map((item: any) => ({
            ...item,
            planDate: item.planDate instanceof Date
                ? item.planDate.toISOString().split('T')[0]
                : item.planDate
        }));

        // Group by date
        const byDate: { [key: string]: any[] } = {};
        reflectionsWithStringDates.forEach((reflection: any) => {
            if (!byDate[reflection.planDate]) {
                byDate[reflection.planDate] = [];
            }
            byDate[reflection.planDate].push(reflection);
        });

        // Calculate stats
        const stats = {
            total: reflections.length,
        };

        return NextResponse.json({
            reflections: reflectionsWithStringDates,
            byDate,
            stats
        });

    } catch (error) {
        console.error('Error fetching reflections:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reflections' },
            { status: 500 }
        );
    }
}
