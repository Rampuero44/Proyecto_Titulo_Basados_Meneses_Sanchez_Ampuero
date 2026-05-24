const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres.gdtnopudyfayueglplpm',
    host: 'aws-1-sa-east-1.pooler.supabase.com',
    database: 'postgres',
    password: 'calumnia2023',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;