import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

// Pricing Configuration
export const STRIPE_CONFIG = {
    prices: {
        pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '', // e.g., 'price_xxx'
        pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || '',   // e.g., 'price_yyy'
    },
    plans: {
        free: {
            name: 'Free',
            price: 0,
            interval: 'forever',
            features: [
                'All 7 planning zones',
                '7-day history',
                'Daily planning',
                'Mobile responsive',
                'Auto-save',
            ],
            limits: {
                historyDays: 7,
            },
        },
        pro: {
            name: 'Pro',
            priceMonthly: 8,
            priceYearly: 80,
            interval: 'month',
            features: [
                'Everything in Free',
                'Unlimited history',
                'Cloud sync across devices',
                'Project tracking',
                'Core memories with photos',
                'Weekly insights',
                'Priority support',
            ],
            limits: {
                historyDays: null, // unlimited
            },
        },
    },
};

// Helper to get the appropriate price ID based on interval
export function getPriceId(interval: 'month' | 'year'): string {
    return interval === 'month'
        ? STRIPE_CONFIG.prices.pro_monthly
        : STRIPE_CONFIG.prices.pro_yearly;
}

// Helper to format price for display
export function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}
