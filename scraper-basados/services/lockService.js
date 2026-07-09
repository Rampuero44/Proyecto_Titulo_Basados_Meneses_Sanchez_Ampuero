const pool = require('../config/database');

const LOCK_TIMEOUT_MINUTOS = 120;

async function adquirirLock(idComercio, subcategoria) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const enCurso = await client.query(
            `SELECT id_log, fecha_inicio
             FROM scraping_log
             WHERE estado = 'EN_CURSO'
             AND id_comercio = $1
             ORDER BY fecha_inicio DESC
             LIMIT 1
             FOR UPDATE SKIP LOCKED`,
            [idComercio]
        );

        if (enCurso.rows.length > 0) {
            const lock = enCurso.rows[0];
            const minutosTranscurridos = (Date.now() - new Date(lock.fecha_inicio).getTime()) / 60000;

            if (minutosTranscurridos < LOCK_TIMEOUT_MINUTOS) {
                await client.query('ROLLBACK');
                console.log(`[LOCK] Scraping en curso para comercio ${idComercio} (iniciado hace ${Math.round(minutosTranscurridos)} min)`);
                return null;
            }

            console.log(`[LOCK] Lock expirado detectado (${Math.round(minutosTranscurridos)} min), marcando como fallido`);
            await client.query(
                `UPDATE scraping_log SET estado = 'FALLIDO', fecha_fin = NOW(), errores = 'Timeout — proceso anterior no completó'
                 WHERE id_log = $1`,
                [lock.id_log]
            );
        }

        const result = await client.query(
            `INSERT INTO scraping_log (id_comercio, fecha_inicio, estado, subcategoria)
             VALUES ($1, NOW(), 'EN_CURSO', $2)
             RETURNING id_log`,
            [idComercio, subcategoria || null]
        );

        await client.query('COMMIT');
        const idLog = result.rows[0].id_log;
        console.log(`[LOCK] Lock adquirido (id_log: ${idLog})`);
        return idLog;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function liberarLock(idLog, stats = {}) {
    await pool.query(
        `UPDATE scraping_log
         SET estado = 'COMPLETADO',
             fecha_fin = NOW(),
             productos_detectados = $1,
             productos_actualizados = $2
         WHERE id_log = $3`,
        [stats.detectados ?? 0, stats.actualizados ?? 0, idLog]
    );
    console.log(`[LOCK] Lock liberado (id_log: ${idLog})`);
}

async function marcarLockFallido(idLog, error) {
    await pool.query(
        `UPDATE scraping_log
         SET estado = 'FALLIDO',
             fecha_fin = NOW(),
             errores = $1
         WHERE id_log = $2`,
        [error?.message ?? 'Error desconocido', idLog]
    );
    console.log(`[LOCK] Scraping marcado como fallido (id_log: ${idLog})`);
}

module.exports = { adquirirLock, liberarLock, marcarLockFallido };