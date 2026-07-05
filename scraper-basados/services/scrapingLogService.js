const pool = require('../config/database');

async function iniciarLog({
    idComercio,
    subcategoria
}) {

    const result = await pool.query(
        `
        INSERT INTO scraping_log (
            id_comercio,
            fecha_inicio,
            estado,
            subcategoria,
            paginas_scrapeadas,
            productos_detectados,
            productos_actualizados
        )
        VALUES (
            $1,
            CURRENT_TIMESTAMP,
            'RUNNING',
            $2,
            0,
            0,
            0
        )
        RETURNING id_log
        `,
        [
            idComercio,
            subcategoria
        ]
    );

    return result.rows[0].id_log;
}

async function finalizarLog({
    idLog,
    paginasScrapeadas,
    productosDetectados,
    productosActualizados,
    estado,
    errores = null
}) {

    await pool.query(
        `
        UPDATE scraping_log
        SET
            fecha_fin = CURRENT_TIMESTAMP,
            paginas_scrapeadas = $1,
            productos_detectados = $2,
            productos_actualizados = $3,
            estado = $4,
            errores = $5
        WHERE id_log = $6
        `,
        [
            paginasScrapeadas,
            productosDetectados,
            productosActualizados,
            estado,
            errores,
            idLog
        ]
    );
}

module.exports = {
    iniciarLog,
    finalizarLog
};