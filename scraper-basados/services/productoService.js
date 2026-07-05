const pool = require('../config/database');

async function obtenerCategoriaId(slugCategoria) {

    const result = await pool.query(
        `
        SELECT id_categoria
        FROM categorias_producto
        WHERE slug = $1
        LIMIT 1
        `,
        [slugCategoria]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0].id_categoria;
}

async function obtenerComercioId(nombreComercio) {

    const result = await pool.query(
        `
        SELECT id_comercio
        FROM comercios
        WHERE LOWER(nombre) = LOWER($1)
        LIMIT 1
        `,
        [nombreComercio]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0].id_comercio;
}

async function buscarProductoPorSku(sku) {

    const result = await pool.query(
        `
        SELECT id_producto
        FROM productos
        WHERE sku_scraping = $1
        LIMIT 1
        `,
        [sku]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

function extraerPesoGramos(nombre) {
    if (!nombre) return null;
    const regex = /(\d+[,.]?\d*)\s*(kg|g|gr)\b/i;
    const match = nombre.match(regex);
    if (!match) return null;
    const valor = parseFloat(match[1].replace(',', '.'));
    const unidad = match[2].toLowerCase();
    if (unidad === 'kg') return Math.round(valor * 1000);
    return Math.round(valor);
}

async function obtenerOCrearFormato(pesoGramos) {
    if (!pesoGramos) return null;
    const nombre = pesoGramos >= 1000 ? `${(pesoGramos / 1000).toFixed(1)} kg` : `${pesoGramos} g`;
    const existing = await pool.query(
        'SELECT id_formato FROM formatos WHERE nombre = $1 AND unidad = $2', [nombre, 'g']
    );
    if (existing.rows.length > 0) return existing.rows[0].id_formato;
    const inserted = await pool.query(
        'INSERT INTO formatos (nombre, peso_gramos, unidad) VALUES ($1, $2, $3) ON CONFLICT (nombre, unidad) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id_formato',
        [nombre, pesoGramos, 'g']
    );
    return inserted.rows[0]?.id_formato ?? null;
}

async function registrarAuditoriaProducto(idProducto, accion, datosAnteriores, datosNuevos, usuarioResponsable) {

    await pool.query(
        `
        INSERT INTO auditoria_productos (
            id_producto,
            accion,
            datos_anteriores,
            datos_nuevos,
            fecha_cambio,
            usuario_responsable
        )
        VALUES (
            $1, $2, $3, $4, CURRENT_TIMESTAMP, $5
        )
        `,
        [
            idProducto,
            accion,
            datosAnteriores ? JSON.stringify(datosAnteriores) : null,
            JSON.stringify(datosNuevos),
            usuarioResponsable
        ]
    );
}

async function insertarProducto(producto) {

    const idCategoria = await obtenerCategoriaId(
        producto.categoriaBasados
    );

    if (!idCategoria) {
        throw new Error(
            `Categoría no encontrada: ${producto.categoriaBasados}`
        );
    }

    const pesoGramos = extraerPesoGramos(producto.nombre);
    const idFormato = await obtenerOCrearFormato(pesoGramos);

    const result = await pool.query(
        `
        INSERT INTO productos (
            nombre,
            id_categoria,
            imagen_url,
            alcoholico,
            sku_scraping,
            url_imagen_original,
            id_formato,
            enriquecido,
            fecha_actualizacion
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, false, CURRENT_TIMESTAMP
        )
        RETURNING id_producto
        `,
        [
            producto.nombre,
            idCategoria,
            producto.imagenUrl,
            ['bebidas-y-licores'].includes(producto.categoriaBasados),
            producto.skuScraping,
            producto.imagenUrl,
            idFormato
        ]
    );

    const idProducto = result.rows[0].id_producto;

    try {
        await registrarAuditoriaProducto(idProducto, 'creado', null, {
            nombre: producto.nombre,
            categoria: producto.categoriaBasados,
            comercio: producto.comercio,
            skuScraping: producto.skuScraping
        }, 'scraper');
    } catch (error) {
        console.log('[AUDITORIA] Error registrando creación de producto');
        console.log(error.message);
    }

    return idProducto;
}

function limpiarPrecio(precioTexto) {

    if (!precioTexto) {
        return null;
    }

    return Number(
        precioTexto
            .replace(/\$/g, '')
            .replace(/\./g, '')
            .replace(/\/kg/g, '')
            .replace(',', '.')
            .trim()
    );
}

async function insertarHistorialPrecio(
    idProducto,
    producto
) {

    const idComercio = await obtenerComercioId(
        producto.comercio
    );

    if (!idComercio) {
        throw new Error(
            `Comercio no encontrado: ${producto.comercio}`
        );
    }

    // Validar precio antes de insertar
    const precioLimpio = limpiarPrecio(producto.precio);
    const precioNumerico = parseFloat(precioLimpio);
    
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
        console.log(`[DB] Precio inválido para producto ${producto.nombre} (${precioLimpio}), omitiendo historial`);
        return;
    }

    await pool.query(
        `
        INSERT INTO historial_precios (
            id_producto,
            id_comercio,
            precio,
            url_producto,
            fecha_scraping,
            precio_unitario,
            disponible
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            CURRENT_TIMESTAMP,
            $5,
            true
        )
        `,
        [
            idProducto,
            idComercio,
            precioNumerico,
            producto.url,
            producto.precioUnitario
        ]
    );
}

async function guardarProducto(producto) {

    if (!producto.skuScraping) {
        console.log(
            '[DB] Producto sin SKU, ignorado'
        );

        return;
    }

    let productoExistente = await buscarProductoPorSku(
        producto.skuScraping
    );

    let idProducto;

    if (!productoExistente) {

        console.log(
            `[DB] Insertando producto: ${producto.nombre}`
        );

        idProducto = await insertarProducto(producto);

    } else {

        idProducto = productoExistente.id_producto;
    }

    await insertarHistorialPrecio(
        idProducto,
        producto
    );
}

module.exports = {
    guardarProducto,
    obtenerComercioId,
    registrarAuditoriaProducto
};