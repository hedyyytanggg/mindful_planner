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
            dateFilter = `AND cm.memorydate >= '${startOfWeek.toISOString().split('T')[0]}'`;
        } else if (filter === 'thisMonth') {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            dateFilter = `AND cm.memorydate >= '${startOfMonth.toISOString().split('T')[0]}'`;
        } else if (filter === 'last30') {
            const last30 = new Date(today);
            last30.setDate(today.getDate() - 30);
            dateFilter = `AND cm.memorydate >= '${last30.toISOString().split('T')[0]}'`;
        }

        // Fetch core memories
        const result = await query(`
            SELECT 
                cm.id,
                cm.title,
                cm.description,
                cm.memorydate as "memoryDate",
                cm.tags,
                cm.createdat as "createdAt"
            FROM core_memories cm
            WHERE cm.userid = $1
            ${dateFilter}
            ORDER BY cm.memorydate DESC, cm.createdat DESC
        `, [userId]);

        // Transform results to ensure consistent date format
        const memories = result.rows.map((memory: any) => ({
            ...memory,
            memoryDate: memory.memoryDate instanceof Date
                ? memory.memoryDate.toISOString().split('T')[0]
                : memory.memoryDate
        }));

        const stats = {
            total: memories.length
        };

        // Group by date
        const byDate: { [key: string]: any[] } = {};
        memories.forEach(memory => {
            if (!byDate[memory.memoryDate]) {
                byDate[memory.memoryDate] = [];
            }
            byDate[memory.memoryDate].push(memory);
        });

        return NextResponse.json({
            memories,
            byDate,
            stats
        });

    } catch (error) {
        console.error('Error fetching core memories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch core memories' },
            { status: 500 }
        );
    }
}
