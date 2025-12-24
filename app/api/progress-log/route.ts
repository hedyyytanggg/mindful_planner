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
            dateFilter = `AND pu.updatedat >= '${startOfWeek.toISOString().split('T')[0]}'`;
        } else if (filter === 'thisMonth') {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            dateFilter = `AND pu.updatedat >= '${startOfMonth.toISOString().split('T')[0]}'`;
        } else if (filter === 'last30') {
            const last30 = new Date(today);
            last30.setDate(today.getDate() - 30);
            dateFilter = `AND pu.updatedat >= '${last30.toISOString().split('T')[0]}'`;
        }

        // Fetch project updates
        const result = await query(`
            SELECT 
                pu.id,
                pu.projectid as "projectId",
                p.name as "projectName",
                pu.content,
                pu.updatedat as "updateDate",
                pu.createdat as "createdAt"
            FROM project_updates pu
            INNER JOIN projects p ON pu.projectid = p.id
            WHERE p.userid = $1
            ${dateFilter}
            ORDER BY pu.updatedat DESC, pu.createdat DESC
        `, [userId]);

        // Transform results to ensure consistent date format
        const updates = result.rows.map((update: any) => ({
            ...update,
            updateDate: update.updateDate instanceof Date
                ? update.updateDate.toISOString().split('T')[0]
                : update.updateDate
        }));

        // Group by project
        const byProject: { [key: string]: any[] } = {};
        const projectInfo: { [key: string]: { name: string; count: number } } = {};

        updates.forEach(update => {
            const projectKey = update.projectId;
            if (!byProject[projectKey]) {
                byProject[projectKey] = [];
                projectInfo[projectKey] = {
                    name: update.projectName,
                    count: 0
                };
            }
            byProject[projectKey].push(update);
            projectInfo[projectKey].count++;
        });

        const stats = {
            total: updates.length,
            projects: Object.keys(projectInfo).length
        };

        return NextResponse.json({
            updates,
            byProject,
            projectInfo,
            stats
        });

    } catch (error) {
        console.error('Error fetching progress log:', error);
        return NextResponse.json(
            { error: 'Failed to fetch progress log' },
            { status: 500 }
        );
    }
}
