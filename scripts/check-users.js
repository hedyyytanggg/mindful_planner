const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkUsers() {
    try {
        const result = await pool.query('SELECT id, email, name, createdAt FROM users ORDER BY createdAt DESC');
        console.log('Users in database:');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log(`\nTotal users: ${result.rows.length}`);
    } catch (error) {
        console.error('Error querying database:', error.message);
    } finally {
        await pool.end();
    }
}

checkUsers();
