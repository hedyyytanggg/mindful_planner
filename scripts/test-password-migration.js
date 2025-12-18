/**
 * Test script to verify SHA256 to bcrypt password migration
 * 
 * This script:
 * 1. Creates a test user with SHA256 password hash
 * 2. Attempts to login to trigger migration
 * 3. Verifies the password was migrated to bcrypt
 * 
 * Usage: node scripts/test-password-migration.js
 */

const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Generate SHA256 hash (legacy method)
function hashPasswordSHA256(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Check if hash is SHA256 format
function isSHA256Hash(hash) {
    return /^[a-f0-9]{64}$/i.test(hash);
}

// Check if hash is bcrypt format
function isBcryptHash(hash) {
    return /^\$2[aby]\$\d{2}\$/.test(hash);
}

async function testMigration() {
    const testEmail = `migration-test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testUserId = crypto.randomBytes(12).toString('hex').substring(0, 25);

    console.log('🧪 Starting Password Migration Test');
    console.log('=====================================\n');

    try {
        // Step 1: Create a test user with SHA256 password
        console.log('1️⃣ Creating test user with SHA256 password...');
        const sha256Hash = hashPasswordSHA256(testPassword);
        console.log(`   Email: ${testEmail}`);
        console.log(`   Password: ${testPassword}`);
        console.log(`   SHA256 Hash: ${sha256Hash.substring(0, 20)}...`);
        console.log(`   Is SHA256 format: ${isSHA256Hash(sha256Hash)}`);

        await pool.query(
            `INSERT INTO users (id, email, name, password, timezone) 
             VALUES ($1, $2, $3, $4, $5)`,
            [testUserId, testEmail, 'Migration Test', sha256Hash, 'UTC']
        );
        console.log('   ✅ Test user created\n');

        // Step 2: Verify the user exists with SHA256 hash
        console.log('2️⃣ Verifying user before migration...');
        const beforeResult = await pool.query(
            'SELECT id, email, password FROM users WHERE email = $1',
            [testEmail]
        );

        if (beforeResult.rows.length === 0) {
            throw new Error('Test user not found!');
        }

        const beforeHash = beforeResult.rows[0].password;
        console.log(`   Password hash: ${beforeHash.substring(0, 20)}...`);
        console.log(`   Is SHA256: ${isSHA256Hash(beforeHash)}`);
        console.log(`   Is bcrypt: ${isBcryptHash(beforeHash)}`);
        console.log('   ✅ User verified with SHA256 hash\n');

        // Step 3: Instructions for manual login test
        console.log('3️⃣ Testing migration via login...');
        console.log('\n⚠️  MANUAL TEST REQUIRED:');
        console.log('   Please perform the following steps:\n');
        console.log(`   1. Open http://localhost:3000/login in your browser`);
        console.log(`   2. Login with:`);
        console.log(`      Email: ${testEmail}`);
        console.log(`      Password: ${testPassword}`);
        console.log(`   3. The migration should happen automatically\n`);
        console.log('   Press Ctrl+C after testing, then run this script again to verify migration.\n');

        // Wait for manual test
        console.log('   Waiting 30 seconds for you to test login...');
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Step 4: Check if migration occurred
        console.log('\n4️⃣ Checking if migration occurred...');
        const afterResult = await pool.query(
            'SELECT id, email, password FROM users WHERE email = $1',
            [testEmail]
        );

        if (afterResult.rows.length === 0) {
            throw new Error('Test user disappeared!');
        }

        const afterHash = afterResult.rows[0].password;
        console.log(`   Password hash: ${afterHash.substring(0, 20)}...`);
        console.log(`   Is SHA256: ${isSHA256Hash(afterHash)}`);
        console.log(`   Is bcrypt: ${isBcryptHash(afterHash)}`);

        if (isBcryptHash(afterHash)) {
            console.log('   ✅ Migration successful! Password is now bcrypt\n');
        } else if (isSHA256Hash(afterHash)) {
            console.log('   ⚠️  Password still SHA256. Migration may not have occurred.\n');
            console.log('   Did you login with the test account?\n');
        }

        // Step 5: Cleanup
        console.log('5️⃣ Cleaning up test user...');
        await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
        console.log('   ✅ Test user deleted\n');

        console.log('✅ Migration test completed!');
        console.log('=====================================');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);

        // Cleanup on error
        try {
            await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
            console.log('   ✅ Cleaned up test user');
        } catch (cleanupError) {
            console.error('   ⚠️  Cleanup failed:', cleanupError.message);
        }
    } finally {
        await pool.end();
    }
}

// Alternative: Quick verification only (no login test)
async function quickVerification() {
    console.log('🔍 Quick Migration Verification');
    console.log('================================\n');

    try {
        // Check all users and categorize by hash type
        const result = await pool.query(`
            SELECT 
                id,
                email,
                LENGTH(password) as hash_length,
                SUBSTRING(password, 1, 10) as hash_start,
                CASE 
                    WHEN password ~ E'^\\$2[aby]\\$' THEN 'bcrypt'
                    WHEN LENGTH(password) = 64 AND password ~ '^[a-fA-F0-9]+$' THEN 'sha256'
                    ELSE 'unknown'
                END as hash_type
            FROM users
            ORDER BY hash_type, email
        `);

        const bcryptUsers = result.rows.filter(u => u.hash_type === 'bcrypt');
        const sha256Users = result.rows.filter(u => u.hash_type === 'sha256');
        const unknownUsers = result.rows.filter(u => u.hash_type === 'unknown');

        console.log('📊 User Password Hash Summary:\n');
        console.log(`   Total users: ${result.rows.length}`);
        console.log(`   ✅ bcrypt (secure): ${bcryptUsers.length}`);
        console.log(`   ⚠️  SHA256 (needs migration): ${sha256Users.length}`);
        console.log(`   ❓ Unknown format: ${unknownUsers.length}\n`);

        if (sha256Users.length > 0) {
            console.log(`⚠️  Users with SHA256 passwords (will auto-migrate on login):\n`);
            sha256Users.forEach((user, i) => {
                console.log(`   ${i + 1}. ${user.email}`);
                console.log(`      Hash: ${user.hash_start}... (${user.hash_length} chars)\n`);
            });
        }

        if (bcryptUsers.length > 0) {
            console.log(`✅ Users with bcrypt passwords (already secure):\n`);
            bcryptUsers.forEach((user, i) => {
                console.log(`   ${i + 1}. ${user.email}`);
                console.log(`      Hash: ${user.hash_start}... (${user.hash_length} chars)\n`);
            });
        }

        if (unknownUsers.length > 0) {
            console.log(`❓ Users with unknown hash format:\n`);
            unknownUsers.forEach((user, i) => {
                console.log(`   ${i + 1}. ${user.email}`);
                console.log(`      Hash: ${user.hash_start}... (${user.hash_length} chars)\n`);
            });
        }

        if (sha256Users.length === 0) {
            console.log('🎉 All users have been migrated to bcrypt!\n');
        }

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        await pool.end();
    }
}

// Run based on argument
const command = process.argv[2];

if (command === 'verify') {
    quickVerification();
} else if (command === 'test') {
    testMigration();
} else {
    console.log('Password Migration Test Script');
    console.log('==============================\n');
    console.log('Usage:');
    console.log('  node scripts/test-password-migration.js verify  - Check for SHA256 passwords');
    console.log('  node scripts/test-password-migration.js test    - Full migration test\n');
    process.exit(0);
}
