const { chromium } = require('playwright');
const categoriasLider = require('../../config/categoriasLider');
const filtrosCategorias = require('../../config/filtrosCategorias');
const { normalizarTexto } = require('../../utils/normalizadorTexto');
const { extraerSku } = require('../../utils/extraerSku');
const { guardarProducto } = require('../../services/productoService');
const {
    iniciarLog,
    finalizarLog
} = require('../../services/scrapingLogService');

function pasaFiltros(producto, slugCategoria) {

    const filtros = filtrosCategorias[slugCategoria];

    if (!filtros) {
        return true;
    }

    const textoProducto = normalizarTexto(producto.nombre || '');

    const incluir = filtros.incluir || [];
    const excluir = filtros.excluir || [];

    const tieneExclusion = excluir.some(keyword =>
        textoProducto.includes(normalizarTexto(keyword))
    );

    if (tieneExclusion) {
        return false;
    }

    if (incluir.length === 0) {
        return true;
    }

    return incluir.some(keyword =>
        textoProducto.includes(normalizarTexto(keyword))
    );
}

async function extraerProductosCategoria(slugCategoria) {

    const categoria = categoriasLider[slugCategoria];

    if (!categoria) {
        throw new Error(`Categoría no configurada: ${slugCategoria}`);
    }

    const browser = await chromium.launch({
        headless: false
    });

    const resultados = [];
    const productosVistos = new Set();

    try {

        for (const subcategoria of categoria.subcategorias) {
            let paginasScrapeadas = 0;
            let productosDetectados = 0;
            let productosActualizados = 0;

            const idLog = await iniciarLog({
                idComercio: 1,
                subcategoria: subcategoria.nombre
            });

            const page = await browser.newPage();

            console.log(`[LIDER] Scraping categoría: ${categoria.nombre}`);
            console.log(`[LIDER] Subcategoría: ${subcategoria.nombre}`);
            console.log(`[LIDER] URL base: ${subcategoria.url}`);

            let pagina = 1;
            let seguir = true;

            while (seguir) {

                const urlPaginada = `${subcategoria.url}?page=${pagina}`;

                console.log(`[LIDER] Página: ${pagina}`);
                console.log(`[LIDER] URL paginada: ${urlPaginada}`);

                await page.goto(urlPaginada, {
                    waitUntil: 'domcontentloaded'
                });

                await page.waitForTimeout(5000);

                const cards = await page
                    .locator('[data-item-id]')
                    .all();

                console.log(`[LIDER] Productos detectados: ${cards.length}`);

                productosDetectados += cards.length;
                

                if (cards.length === 0) {
                    seguir = false;
                    break;
                }

                paginasScrapeadas++;

                for (let i = 0; i < cards.length; i++) {

                    try {

                        const card = cards[i];

                        const nombre = await card
                            .locator('a[href*="/ip/"]')
                            .innerText();

                        const precioTexto = await card
                            .locator('[data-automation-id="product-price"]')
                            .innerText();

                        const lineasPrecio = precioTexto
                            .split('\n')
                            .map(linea => linea.trim())
                            .filter(Boolean);

                        const precioPrincipal = lineasPrecio[0] || null;

                        const precioUnitario = lineasPrecio.find(linea =>
                            linea.includes('x un')
                        );

                        const link = await card
                            .locator('a[href*="/ip/"]')
                            .getAttribute('href');

                        const imagen = await card
                            .locator('img')
                            .getAttribute('src');

                        if (!nombre || !link) {
                            continue;
                        }

                        const urlCompleta = link.startsWith('http')
                            ? link
                            : `https://super.lider.cl${link}`;
                        const sku = extraerSku(urlCompleta);

                        const producto = {
                            skuScraping: sku,
                            nombre: nombre.trim(),
                            precio: precioPrincipal,
                            precioUnitario: precioUnitario || null,
                            url: urlCompleta,
                            imagenUrl: imagen,
                            categoriaBasados: slugCategoria,
                            categoriaOrigen: subcategoria.nombre,
                            comercio: 'Lider',
                            fechaScraping: new Date().toISOString()
                        };

                        if (
                            pasaFiltros(producto, slugCategoria) &&
                            !productosVistos.has(urlCompleta)
                        ) {

                            productosVistos.add(urlCompleta);

                            resultados.push(producto);

                            try {

                                await guardarProducto(producto);
                                productosActualizados++;

                            } catch (error) {

                                console.log('[DB] Error guardando producto');
                                console.log(error.message);
                            }
                        }

                    } catch (error) {

                        console.log('[LIDER] Error leyendo card');
                        console.log(error.message);
                    }
                }

                pagina++;
            }

            await finalizarLog({
                idLog,
                paginasScrapeadas,
                productosDetectados,
                productosActualizados,
                estado: 'OK'
            });

            await page.close();
        }

        return resultados;

    } finally {

        await browser.close();
    }
}

module.exports = {
    extraerProductosCategoria
};