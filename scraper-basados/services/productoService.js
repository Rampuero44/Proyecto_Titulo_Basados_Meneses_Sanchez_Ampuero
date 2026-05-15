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

async function insertarProducto(producto) {

    const idCategoria = await obtenerCategoriaId(
        producto.categoriaBasados
    );

    if (!idCategoria) {
        throw new Error(
            `Categoría no encontrada: ${producto.categoriaBasados}`
        );
    }

    const result = await pool.query(
        `
        INSERT INTO productos (
            nombre,
            id_categoria,
            imagen_url,
            alcoholico,
            sku_scraping,
            url_imagen_original,
            fecha_actualizacion
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            CURRENT_TIMESTAMP
        )
        RETURNING id_producto
        `,
        [
            producto.nombre,
            idCategoria,
            producto.imagenUrl,
            producto.categoriaBasados === 'bebidas-y-licores',
            producto.skuScraping,
            producto.imagenUrl
        ]
    );

    return result.rows[0].id_producto;
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
            limpiarPrecio(producto.precio),
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
    guardarProducto
};