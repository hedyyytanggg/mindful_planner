import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getCoreMemoryById, deleteCoreMemory } from '@/lib/dbHelpers';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any)?.id;
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        }

        const memory = await getCoreMemoryById(id);

        if (!memory) {
            console.error(`Memory with id ${id} not found`);
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }

        // Verify ownership
        if (String(memory.userId) !== String(userId)) {
            console.error(`Ownership check failed: memory.userId=${memory.userId}, userId=${userId}`);
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await deleteCoreMemory(id);

        return NextResponse.json(
            { message: 'Memory deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting memory:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
