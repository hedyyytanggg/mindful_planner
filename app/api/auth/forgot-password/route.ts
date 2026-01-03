import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/dbHelpers';
import { query } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await getUserByEmail(email);

        // Always return success to prevent email enumeration
        // But only send email if user exists
        if (user) {
            // Generate reset token (32 random bytes as hex)
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Token expires in 1 hour
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            // Store token in database
            await query(
                'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
                [resetToken, expiresAt, user.id]
            );

            // Send reset email
            const emailSent = await sendPasswordResetEmail(email, resetToken);

            if (!emailSent) {
                console.error('Failed to send password reset email to:', email);
            }
        }

        // Always return success message (security best practice)
        return NextResponse.json({
            message: 'If an account exists with that email, you will receive a password reset link shortly.',
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred processing your request' },
            { status: 500 }
        );
    }
}
