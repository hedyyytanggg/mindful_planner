import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import {
    createProject,
    getProjectsByUser,
    updateProject,
} from '@/lib/dbHelpers';

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
        const activeOnly = url.searchParams.get('activeOnly') !== 'false';

        const projects = await getProjectsByUser(userId, activeOnly);

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
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
        const { name, description } = body;

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            );
        }

        const project = await createProject(
            userId,
            name.trim(),
            description?.trim() || null
        );

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
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
        const { id, name, description, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (isActive !== undefined) updates.isActive = isActive;

        const project = await updateProject(id, updates);

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
