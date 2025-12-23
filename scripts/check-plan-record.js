const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkPlan() {
    try {
        const plan = await pool.query(`
            SELECT * FROM daily_plans LIMIT 1
        `);
        console.log('\n📝 Sample plan record:');
        console.log(JSON.stringify(plan.rows[0], null, 2));

        await pool.end();
    } catch (error) {
        console.error('Error:', error.message);
        await pool.end();
        process.exit(1);
    }
}

checkPlan();
