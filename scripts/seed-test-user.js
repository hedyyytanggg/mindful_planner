#!/usr/bin/env node

/**
 * Create a test user for development
 * This allows testing the planner without going through signup
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
    });

    try {
        console.log('📦 Creating test user...');

        const userId = '116d9be154427a470d2fcb16'; // This matches the session ID
        const { rows } = await pool.query(
            `INSERT INTO users (id, email, name, timezone) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO UPDATE 
             SET name = EXCLUDED.name, timezone = EXCLUDED.timezone
             RETURNING id, email, name`,
            [userId, 'test@example.com', 'Test User', 'UTC']
        );

        console.log('✅ Test user created/updated:');
        console.log(`   ID: ${rows[0].id}`);
        console.log(`   Email: ${rows[0].email}`);
        console.log(`   Name: ${rows[0].name}`);
        console.log('');
        console.log('🎉 Ready to use! You can now log in as: test@example.com');
    } catch (error) {
        console.error('❌ Error creating test user:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createTestUser();
