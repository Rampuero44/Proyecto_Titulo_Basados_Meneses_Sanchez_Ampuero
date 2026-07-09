const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA || undefined,
    }
});

pool.on('error', (err) => {
    console.error('[DB] Error inesperado en cliente del pool:', err.message);
});

module.exports = pool;