/**
 * Direct password reset for huih1108@gmail.com
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function resetPassword() {
    const email = 'huih1108@gmail.com';
    const newPassword = 'TestMindful123!';

    console.log('🔐 Resetting password for', email);
    console.log('New password:', newPassword);

    try {
        // Get user
        const userResult = await pool.query(
            'SELECT id, email FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            console.log('❌ User not found');
            return;
        }

        const user = userResult.rows[0];
        console.log('✅ Found user');

        // Hash password
        console.log('🔄 Hashing password...');
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        console.log('✅ Password hashed');

        // Update
        console.log('💾 Updating database...');
        await pool.query(
            'UPDATE users SET password = $1, updatedAt = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedPassword, user.id]
        );

        console.log('✅ Password updated!');
        console.log('\nYou can now login with:');
        console.log('Email:', email);
        console.log('Password:', newPassword);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

resetPassword();
