import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { pool } from '@/lib/db';
import { updateUserSubscription } from '@/lib/subscription';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle the event
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) {
        console.error('No userId in subscription metadata');
        return;
    }

    const status = subscription.status;
    let subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing';

    switch (status) {
        case 'active':
            subscriptionStatus = 'active';
            break;
        case 'trialing':
            subscriptionStatus = 'trialing';
            break;
        case 'past_due':
            subscriptionStatus = 'past_due';
            break;
        case 'canceled':
        case 'unpaid':
            subscriptionStatus = 'canceled';
            break;
        default:
            subscriptionStatus = 'inactive';
    }

    await updateUserSubscription(pool, userId, {
        subscriptionTier: 'pro',
        subscriptionStatus,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        subscriptionEndDate: (subscription as any).current_period_end
            ? new Date((subscription as any).current_period_end * 1000)
            : null,
    });

    console.log(`Updated subscription for user ${userId}: ${subscriptionStatus}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) {
        console.error('No userId in subscription metadata');
        return;
    }

    await updateUserSubscription(pool, userId, {
        subscriptionTier: 'free',
        subscriptionStatus: 'canceled',
        subscriptionEndDate: (subscription as any).ended_at
            ? new Date((subscription as any).ended_at * 1000)
            : new Date(),
    });

    console.log(`Subscription deleted for user ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription as string;
    if (!subscriptionId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionUpdate(subscription);

    console.log(`Payment succeeded for subscription ${subscriptionId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const userId = (invoice as any).subscription_details?.metadata?.userId;
    if (!userId) return;

    await updateUserSubscription(pool, userId, {
        subscriptionStatus: 'past_due',
    });

    console.log(`Payment failed for user ${userId}`);
}
