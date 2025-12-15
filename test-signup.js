#!/usr/bin/env node

const crypto = require('crypto');
const { Client } = require('pg');

// Simple password hashing
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate ID
function generateId() {
    return crypto.randomBytes(12).toString('hex').substring(0, 25);
}

async function testSignup() {
    const client = new Client({
        user: 'mindful_user',
        password: 'mindful_dev_password',
        host: 'localhost',
        port: 5432,
        database: 'mindful_dev',
    });

    try {
        await client.connect();
        console.log('✓ Connected to database');

        // Test 1: Create a user
        const userId = generateId();
        const email = `test${Date.now()}@example.com`;
        const password = hashPassword('password123');
        const name = 'Test User';

        const result = await client.query(
            `INSERT INTO users (id, email, name, password, timezone) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [userId, email, name, password, 'UTC']
        );

        console.log('✓ User created:', result.rows[0]);

        // Test 2: Get user by email
        const getResult = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        console.log('✓ User retrieved:', getResult.rows[0]);

        // Test 3: Verify schema columns
        const schemaResult = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

        console.log('✓ Users table schema:');
        schemaResult.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

testSignup();
