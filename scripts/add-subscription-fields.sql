-- Add subscription fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;

-- Create index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Update existing users to have explicit free tier
UPDATE users SET subscription_tier = 'free', subscription_status = 'inactive' WHERE subscription_tier IS NULL;
