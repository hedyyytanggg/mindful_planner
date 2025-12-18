/**
 * Reset user password script
 * 
 * Usage: node scripts/reset-user-password.js <email> <new-password>
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function resetPassword(email, newPassword) {
    console.log('🔐 Password Reset Tool');
    console.log('======================\n');

    try {
        // Check if user exists
        const userResult = await pool.query(
            'SELECT id, email, LENGTH(password) as hash_length FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            console.log(`❌ User not found: ${email}`);
            return;
        }

        const user = userResult.rows[0];
        console.log(`✅ Found user: ${user.email}`);
        console.log(`   Current hash length: ${user.hash_length}\n`);

        // Hash new password with bcrypt
        console.log('🔄 Hashing new password with bcrypt (12 salt rounds)...');
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        console.log(`   New hash: ${hashedPassword.substring(0, 20)}...\n`);

        // Update password
        console.log('💾 Updating password in database...');
        await pool.query(
            'UPDATE users SET password = $1, updatedAt = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedPassword, user.id]
        );

        console.log('✅ Password updated successfully!\n');
        console.log('You can now login with:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${newPassword}\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

// Get arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
    console.log('Password Reset Tool');
    console.log('===================\n');
    console.log('Usage:');
    console.log('  node scripts/reset-user-password.js <email> <new-password>\n');
    console.log('Example:');
    console.log('  node scripts/reset-user-password.js user@example.com MyNewPass123!\n');
    console.log('⚠️  Make sure the password meets requirements:');
    console.log('   - At least 12 characters');
    console.log('   - One uppercase letter');
    console.log('   - One lowercase letter');
    console.log('   - One number');
    console.log('   - One special character (@$!%*?&#)\n');
    process.exit(1);
}

resetPassword(email, newPassword);
