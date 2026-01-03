import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { updateUserPassword } from '@/lib/dbHelpers';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Find user with valid token
        const result = await query(
            `SELECT id, email FROM users 
             WHERE reset_token = $1 
             AND reset_token_expires > NOW()`,
            [token]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const user = result.rows[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password and clear reset token
        await query(
            `UPDATE users 
             SET password = $1, 
                 reset_token = NULL, 
                 reset_token_expires = NULL,
                 updatedAt = CURRENT_TIMESTAMP 
             WHERE id = $2`,
            [hashedPassword, user.id]
        );

        console.log(`✅ Password reset successful for user: ${user.email}`);

        return NextResponse.json({
            message: 'Password reset successful. You can now log in with your new password.',
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred resetting your password' },
            { status: 500 }
        );
    }
}
