const { chromium } = require('playwright');
const categoriasTottus = require('../../config/categoriasTottus');
const { pasaFiltros } = require('../../utils/filtrosProducto');
const { extraerSku } = require('../../utils/extraerSku');
const { guardarProducto, obtenerComercioId } = require('../../services/productoService');
const {
    iniciarLog,
    finalizarLog
} = require('../../services/scrapingLogService');

async function extraerProductosCategoria(slugCategoria, onActividad) {

    const categoria = categoriasTottus[slugCategoria];

    if (!categoria) {
        throw new Error(`Categoría no configurada: ${slugCategoria}`);
    }

    const browser = await chromium.launch({
        headless: true
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

                let intentos = 0;
                let cargada = false;

                while (intentos < 3 && !cargada) {
                    intentos++;
                    try {
                        await page.goto(urlPaginada, {
                            waitUntil: 'domcontentloaded',
                            timeout: 30000
                        });
                        cargada = true;
                    } catch (error) {
                        console.log(`[TOTTUS] Intento ${intentos} fallido cargando página ${pagina}`);
                        console.log(error.message);
                    }
                }

                if (!cargada) {
                    console.log(`[TOTTUS] Página ${pagina} no se pudo cargar tras ${intentos} intentos, se omite`);
                    pagina++;
                    continue;
                }

                await page.waitForSelector('[data-testid="ssr-pod"]', { timeout: 8000 }).catch(() => null);

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

                        const marcaTexto = await card
                            .locator('[class*="pod-title"][class*="title-rebrand"]')
                            .first()
                            .innerText()
                            .catch(() => null);

                        const nombreDesdeUrl = link
                            ? link.split('/')[6]?.replace(/-/g, ' ')
                                .replace(/\b\w/g, c => c.toUpperCase())
                                .trim()
                            : null;

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

                        const sku = extraerSku(urlCompleta, 'Tottus');

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
                                onActividad?.();

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
