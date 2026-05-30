const { chromium } = require('playwright');
const categoriasTottus = require('../../config/categoriasTottus');
const filtrosCategorias = require('../../config/filtrosCategorias');
const { normalizarTexto } = require('../../utils/normalizadorTexto');
const { extraerSku } = require('../../utils/extraerSku');
const { guardarProducto, obtenerComercioId } = require('../../services/productoService');
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

    const categoria = categoriasTottus[slugCategoria];

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
                idComercio: await obtenerComercioId('Tottus'),
                subcategoria: subcategoria.nombre
            });

            const page = await browser.newPage();

            console.log(`[TOTTUS] Scraping categoría: ${categoria.nombre}`);
            console.log(`[TOTTUS] Subcategoría: ${subcategoria.nombre}`);
            console.log(`[TOTTUS] URL base: ${subcategoria.url}`);

            let pagina = 1;
            let seguir = true;

            while (seguir) {

                const urlPaginada = `${subcategoria.url}?page=${pagina}`;

                console.log(`[TOTTUS] Página: ${pagina}`);
                console.log(`[TOTTUS] URL paginada: ${urlPaginada}`);

                await page.goto(urlPaginada, {
                    waitUntil: 'domcontentloaded'
                });

                await page.waitForTimeout(5000);

                const cards = await page
                    .locator('[data-testid="ssr-pod"]')
                    .all();

                console.log(`[TOTTUS] Productos detectados: ${cards.length}`);

                productosDetectados += cards.length;

                if (cards.length === 0) {
                    seguir = false;
                    break;
                }

                paginasScrapeadas++;

                for (let i = 0; i < cards.length; i++) {

                    try {

                        const card = cards[i];

                        // Extraer nombre desde subtítulo (nombre real del producto)
                        const nombreTexto = await card
                            .locator('[class*="pod-subTitle"], [class*="subTitle-rebrand"]')
                            .first()
                            .innerText()
                            .catch(() => null);

                        const link = await card
                            .locator('a[href]')
                            .first()
                            .getAttribute('href')
                            .catch(() => null);

                        // Extraer marca desde pod-title (es la marca real en Tottus)
                        const marcaTexto = await card
                            .locator('[class*="pod-title"][class*="title-rebrand"]')
                            .first()
                            .innerText()
                            .catch(() => null);

                        // Fallback: extraer nombre desde URL (posición 7)
                        const nombreDesdeUrl = link
                            ? link.split('/')[6]?.replace(/-/g, ' ')
                                .replace(/\b\w/g, c => c.toUpperCase())
                                .trim()
                            : null;

                        // Usar nombre de texto si es válido, sino usar el de URL
                        const nombre = (nombreTexto && nombreTexto.length > 3 && !/^\d+$/.test(nombreTexto))
                            ? nombreTexto.trim()
                            : nombreDesdeUrl;

                        const precioTexto = await card
                            .locator('[data-internet-price]')
                            .first()
                            .getAttribute('data-internet-price')
                            .catch(() => null);

                        const precioPrincipal = precioTexto
                            ? `$${precioTexto}`
                            : null;

                        const precioUnitario = await card
                            .locator('.prices-unit-price, [class*="unit-price"]')
                            .first()
                            .innerText()
                            .catch(() => null);

                        const imagen = await card
                            .locator('img')
                            .first()
                            .getAttribute('src')
                            .catch(() => null);

                        if (!nombre || !link) {
                            continue;
                        }

                        const urlCompleta = link.startsWith('http')
                            ? link
                            : `https://www.tottus.cl${link}`;

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
                            comercio: 'Tottus',
                            marcaScraping: marcaTexto ? marcaTexto.trim() : null,
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

                        console.log('[TOTTUS] Error leyendo card');
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