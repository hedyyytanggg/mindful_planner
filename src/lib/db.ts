import { Pool, PoolClient } from 'pg';

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});

// Handle pool errors
pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
});

/**
 * Execute a query using the connection pool
 * @param text SQL query string
 * @param values Query parameters
 * @returns Query result
 */
export async function query<T = any>(
    text: string,
    values?: any[]
): Promise<{ rows: T[]; rowCount: number | null }> {
    const start = Date.now();
    try {
        const result = await pool.query(text, values);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return { rows: result.rows, rowCount: result.rowCount };
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Get a client from the pool for transactions
 * @returns Database client
 */
export async function getClient(): Promise<PoolClient> {
    return pool.connect();
}

/**
 * Execute multiple queries in a transaction
 * @param callback Function that receives the client
 * @returns Result from callback
 */
export async function transaction<T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> {
    const client = await getClient();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Close the connection pool (call on app shutdown)
 */
export async function closePool(): Promise<void> {
    await pool.end();
}

export default pool;
