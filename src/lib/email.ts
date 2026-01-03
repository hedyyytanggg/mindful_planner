/**
 * Email utility for sending transactional emails
 * Using Resend for reliable email delivery
 */

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send an email using Resend API
 * Get your API key from https://resend.com/api-keys
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'noreply@yourdomain.com';

    // If no API key is configured, log the email (for development)
    if (!resendApiKey) {
        console.log('📧 Email would be sent (no RESEND_API_KEY configured):');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${html}`);
        return true;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: fromEmail,
                to,
                subject,
                html,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Failed to send email:', error);
            return false;
        }

        console.log(`✅ Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🧘 Mindful Planner</h1>
            </div>
            
            <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
                
                <p style="color: #4b5563; font-size: 16px;">
                    We received a request to reset your password for your Mindful Planner account.
                </p>
                
                <p style="color: #4b5563; font-size: 16px;">
                    Click the button below to create a new password:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                        Reset Password
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px;">
                    Or copy and paste this link into your browser:
                </p>
                <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">
                    ${resetUrl}
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                        <strong>This link will expire in 1 hour.</strong>
                    </p>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Mindful Planner. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: email,
        subject: 'Reset Your Mindful Planner Password',
        html,
    });
}
