const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'db.gdtnopudyfayueglplpm.supabase.co',
    database: 'postgres',
    password: 'calumnia2023',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;