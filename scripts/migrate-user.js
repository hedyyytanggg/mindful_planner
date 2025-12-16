const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

function generateId() {
    return crypto.randomBytes(12).toString('hex').substring(0, 25);
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function migrateUser(oldEmail, newEmail, newPassword) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Step 1: Get the old user
        console.log('Step 1: Getting old user...');
        const oldUserResult = await client.query('SELECT * FROM users WHERE email = $1', [oldEmail]);
        if (oldUserResult.rows.length === 0) {
            throw new Error(`Old user with email ${oldEmail} not found`);
        }
        const oldUser = oldUserResult.rows[0];
        const oldUserId = oldUser.id;
        console.log(`✓ Found old user: ${oldEmail} (ID: ${oldUserId})`);

        // Step 2: Get the new user
        console.log('\nStep 2: Getting new user...');
        const existingUserResult = await client.query('SELECT * FROM users WHERE email = $1', [newEmail]);

        if (existingUserResult.rows.length === 0) {
            throw new Error(`New user with email ${newEmail} not found. Please create the user first.`);
        }

        const newUserId = existingUserResult.rows[0].id;
        console.log(`✓ Found new user: ${newEmail} (ID: ${newUserId})`);

        // Step 3: Migrate all data
        console.log('\nStep 3: Migrating data...');

        // Migrate daily_plans
        try {
            console.log('  Migrating daily_plans...');
            const dailyPlansResult = await client.query(
                'UPDATE daily_plans SET userId = $1 WHERE userId = $2 RETURNING id',
                [newUserId, oldUserId]
            );
            console.log(`  ✓ Migrated ${dailyPlansResult.rowCount} daily plans`);
        } catch (e) {
            console.error(`  ✗ Failed to migrate daily_plans:`, e.message);
            throw e;
        }

        // Migrate projects
        try {
            console.log('  Migrating projects...');
            const projectsResult = await client.query(
                'UPDATE projects SET userId = $1 WHERE userId = $2 RETURNING id',
                [newUserId, oldUserId]
            );
            console.log(`  ✓ Migrated ${projectsResult.rowCount} projects`);
        } catch (e) {
            console.error(`  ✗ Failed to migrate projects:`, e.message);
            throw e;
        }

        // Migrate core_memories
        try {
            console.log('  Migrating core_memories...');
            const memoriesResult = await client.query(
                'UPDATE core_memories SET userId = $1 WHERE userId = $2 RETURNING id',
                [newUserId, oldUserId]
            );
            console.log(`  ✓ Migrated ${memoriesResult.rowCount} core memories`);
        } catch (e) {
            console.error(`  ✗ Failed to migrate core_memories:`, e.message);
            throw e;
        }

        // Check if activity_log table exists and migrate
        try {
            const tableCheck = await client.query(
                `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'activity_log'
        )`
            );

            if (tableCheck.rows[0].exists) {
                console.log('  Migrating activity_log...');
                const activityResult = await client.query(
                    'UPDATE activity_log SET userId = $1 WHERE userId = $2 RETURNING id',
                    [newUserId, oldUserId]
                );
                console.log(`  ✓ Migrated ${activityResult.rowCount} activity log entries`);
            } else {
                console.log('  ⚠ activity_log table does not exist, skipping...');
            }
        } catch (e) {
            console.error(`  ✗ Failed to migrate activity_log:`, e.message);
            throw e;
        }

        // Step 4: Delete old user
        console.log('\nStep 4: Deleting old user...');
        try {
            await client.query('DELETE FROM users WHERE id = $1', [oldUserId]);
            console.log(`✓ Deleted old user account: ${oldEmail}`);
        } catch (e) {
            console.error(`✗ Failed to delete old user:`, e.message);
            throw e;
        }

        await client.query('COMMIT');

        console.log('\n✅ Migration completed successfully!');
        console.log(`\nYou can now log in with:`);
        console.log(`Email: ${newEmail}`);
        console.log(`Password: [your password]`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        try {
            await client.query('ROLLBACK');
            console.log('Transaction rolled back');
        } catch (rollbackError) {
            console.error('Failed to rollback:', rollbackError.message);
        }
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Get parameters from command line
const oldEmail = process.argv[2] || 'test@example.com';
const newEmail = process.argv[3] || 'huih1108@gmail.com';
const newPassword = process.argv[4] || 'password123';

console.log(`Migration Plan:`);
console.log(`From: ${oldEmail}`);
console.log(`To: ${newEmail}`);
console.log(`\nStarting migration...\n`);

migrateUser(oldEmail, newEmail, newPassword);
