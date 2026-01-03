import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, getPriceId } from '@/lib/stripe';
import { pool } from '@/lib/db';
import { getUserSubscription } from '@/lib/subscription';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get request body
        const body = await request.json();
        const { priceInterval } = body as { priceInterval: 'month' | 'year' };

        if (!priceInterval || !['month', 'year'].includes(priceInterval)) {
            return NextResponse.json(
                { error: 'Invalid price interval. Must be "month" or "year"' },
                { status: 400 }
            );
        }

        // Get user subscription info
        const userSubscription = await getUserSubscription(pool, session.user.id);
        if (!userSubscription) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get or create Stripe customer
        let customerId = userSubscription.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: session.user.email,
                metadata: {
                    userId: session.user.id,
                },
            });
            customerId = customer.id;

            // Update user with Stripe customer ID
            await pool.query(
                'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
                [customerId, session.user.id]
            );
        }

        // Get the price ID
        const priceId = getPriceId(priceInterval);
        if (!priceId) {
            return NextResponse.json(
                { error: 'Price not configured. Please contact support.' },
                { status: 500 }
            );
        }

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade?canceled=true`,
            metadata: {
                userId: session.user.id,
            },
            subscription_data: {
                metadata: {
                    userId: session.user.id,
                },
            },
        });

        return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
