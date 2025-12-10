#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script sets up the PostgreSQL database with the required schema.
 * 
 * Usage:
 *   node scripts/init-db.js
 * 
 * Make sure DATABASE_URL is set in your .env.local file first!
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const initSchema = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Daily plans table
  CREATE TABLE IF NOT EXISTS daily_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    deep_work JSONB DEFAULT '[]',
    quick_wins JSONB DEFAULT '[]',
    make_it_happen JSONB DEFAULT 'null',
    recharge_zone JSONB DEFAULT 'null',
    little_joys JSONB DEFAULT '[]',
    reflection TEXT,
    focus_tomorrow TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, plan_date)
  );

  -- Deep work zones table (individual tasks)
  CREATE TABLE IF NOT EXISTS deep_work_zones (
    id SERIAL PRIMARY KEY,
    daily_plan_id INTEGER NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    time_estimate INTEGER,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Quick wins table
  CREATE TABLE IF NOT EXISTS quick_wins (
    id SERIAL PRIMARY KEY,
    daily_plan_id INTEGER NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- App settings table
  CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_digest_enabled BOOLEAN DEFAULT TRUE,
    daily_reminder_enabled BOOLEAN DEFAULT TRUE,
    daily_reminder_time TIME DEFAULT '09:00:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes for faster queries
  CREATE INDEX IF NOT EXISTS idx_daily_plans_user_id ON daily_plans(user_id);
  CREATE INDEX IF NOT EXISTS idx_daily_plans_date ON daily_plans(plan_date);
  CREATE INDEX IF NOT EXISTS idx_deep_work_plan_id ON deep_work_zones(daily_plan_id);
  CREATE INDEX IF NOT EXISTS idx_quick_wins_plan_id ON quick_wins(daily_plan_id);
  CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON app_settings(user_id);
`;

async function initDb() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
    });

    try {
        console.log('📦 Initializing database...');
        console.log(`📍 Database URL: ${process.env.DATABASE_URL}`);

        const client = await pool.connect();
        await client.query(initSchema);
        client.release();

        console.log('✅ Database schema created successfully!');
        console.log('📊 Tables created:');
        console.log('  - users');
        console.log('  - daily_plans');
        console.log('  - deep_work_zones');
        console.log('  - quick_wins');
        console.log('  - app_settings');
        console.log('');
        console.log('🎉 Ready to use! Start your app with: npm run dev');
    } catch (error) {
        console.error('❌ Database initialization failed:');
        console.error(error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initDb();
