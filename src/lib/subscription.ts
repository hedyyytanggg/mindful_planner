import { Pool } from 'pg';

export type SubscriptionTier = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing';

export interface UserSubscription {
    userId: string;
    email: string;
    subscriptionTier: SubscriptionTier;
    subscriptionStatus: SubscriptionStatus;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    subscriptionEndDate: Date | null;
}

// Check if user has active Pro subscription
export function hasProAccess(subscription: UserSubscription | any): boolean {
    const tier = subscription.subscriptionTier || subscription.subscription_tier || 'free';
    const status = subscription.subscriptionStatus || subscription.subscription_status || 'inactive';
    const endDate = subscription.subscriptionEndDate || subscription.subscription_end_date;

    if (tier !== 'pro') {
        return false;
    }

    // Check if subscription is active
    if (!['active', 'trialing'].includes(status)) {
        return false;
    }

    // Check if subscription hasn't expired
    if (endDate) {
        const now = new Date();
        const expirationDate = typeof endDate === 'string' ? new Date(endDate) : endDate;
        if (now > expirationDate) {
            return false;
        }
    }

    return true;
}

// Check if user can access data from a specific date
export function canAccessDate(subscription: UserSubscription, date: Date): boolean {
    // Pro users have unlimited access
    if (hasProAccess(subscription)) {
        return true;
    }

    // Free users can only access last 7 days
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    return daysDiff <= 7;
}

// Get user subscription info from database
export async function getUserSubscription(pool: Pool, userId: string): Promise<UserSubscription | null> {
    try {
        const result = await pool.query(
            `SELECT 
        id as "userId",
        email,
        subscription_tier as "subscriptionTier",
        subscription_status as "subscriptionStatus",
        stripe_customer_id as "stripeCustomerId",
        stripe_subscription_id as "stripeSubscriptionId",
        subscription_end_date as "subscriptionEndDate"
      FROM users 
      WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user subscription:', error);
        return null;
    }
}

// Update user subscription in database
export async function updateUserSubscription(
    pool: Pool,
    userId: string,
    data: {
        subscriptionTier?: SubscriptionTier;
        subscriptionStatus?: SubscriptionStatus;
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        subscriptionEndDate?: Date | null;
    }
): Promise<boolean> {
    try {
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (data.subscriptionTier !== undefined) {
            updates.push(`subscription_tier = $${paramIndex++}`);
            values.push(data.subscriptionTier);
        }
        if (data.subscriptionStatus !== undefined) {
            updates.push(`subscription_status = $${paramIndex++}`);
            values.push(data.subscriptionStatus);
        }
        if (data.stripeCustomerId !== undefined) {
            updates.push(`stripe_customer_id = $${paramIndex++}`);
            values.push(data.stripeCustomerId);
        }
        if (data.stripeSubscriptionId !== undefined) {
            updates.push(`stripe_subscription_id = $${paramIndex++}`);
            values.push(data.stripeSubscriptionId);
        }
        if (data.subscriptionEndDate !== undefined) {
            updates.push(`subscription_end_date = $${paramIndex++}`);
            values.push(data.subscriptionEndDate);
        }

        if (updates.length === 0) {
            return false;
        }

        updates.push(`updatedat = CURRENT_TIMESTAMP`);
        values.push(userId);

        const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
    `;

        await pool.query(query, values);
        return true;
    } catch (error) {
        console.error('Error updating user subscription:', error);
        return false;
    }
}

// Calculate how many days until user needs to upgrade
export function getDaysUntilUpgradeNeeded(subscription: UserSubscription): number | null {
    if (hasProAccess(subscription)) {
        return null; // Pro users don't need to upgrade
    }

    // For free users, they'll need to upgrade on day 8
    // This is a placeholder - you'd track their first activity date
    return 8;
}
