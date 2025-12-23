const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkData() {
    try {
        // Check users
        const users = await pool.query('SELECT id, email FROM users LIMIT 5');
        console.log('\n📊 Users in database:');
        console.log(users.rows);

        // Check plans count by user
        const planCounts = await pool.query(`
            SELECT userid, COUNT(*) as count 
            FROM daily_plans 
            GROUP BY userid
        `);
        console.log('\n📅 Daily plans by user:');
        console.log(planCounts.rows);

        // Check recent plans
        const recentPlans = await pool.query(`
            SELECT userid, plan_date, 
                   jsonb_array_length(COALESCE(deep_work, '[]'::jsonb)) as deep_work_count,
                   jsonb_array_length(COALESCE(quick_wins, '[]'::jsonb)) as quick_wins_count
            FROM daily_plans 
            ORDER BY plan_date DESC 
            LIMIT 10
        `);
        console.log('\n🔍 Recent plans:');
        console.log(recentPlans.rows);

        await pool.end();
    } catch (error) {
        console.error('Error:', error);
        await pool.end();
        process.exit(1);
    }
}

checkData();
