const { chromium } = require('playwright');
const categoriasJumbo = require('../../config/categoriasJumbo');
const { pasaFiltros } = require('../../utils/filtrosProducto');
const { extraerSku } = require('../../utils/extraerSku');
const { guardarProducto, obtenerComercioId } = require('../../services/productoService');
const {
    iniciarLog,
    finalizarLog
} = require('../../services/scrapingLogService');

async function scrollHastaElFinal(page, maxScrolls = 20) {
    let scrollsHechos = 0;
    let alturaAnterior = 0;

    while (scrollsHechos < maxScrolls) {
        const alturaActual = await page.evaluate(() => document.body.scrollHeight);

        if (alturaActual === alturaAnterior) {
            break;
        }

        alturaAnterior = alturaActual;

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2500);

        scrollsHechos++;
        console.log(`[JUMBO] Scroll ${scrollsHechos} — altura: ${alturaActual}px`);
    }

    console.log(`[JUMBO] Scroll finalizado tras ${scrollsHechos} iteraciones`);
}

async function extraerProductosCategoria(slugCategoria, onActividad) {

    const categoria = categoriasJumbo[slugCategoria];

    if (!categoria) {
        throw new Error(`Categoría no configurada para Jumbo: ${slugCategoria}`);
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
                idComercio: await obtenerComercioId('Jumbo'),
                subcategoria: subcategoria.nombre
            });

            const page = await browser.newPage();

            await page.setExtraHTTPHeaders({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            });

            console.log(`[JUMBO] Scraping categoría: ${categoria.nombre}`);
            console.log(`[JUMBO] Subcategoría: ${subcategoria.nombre}`);
            console.log(`[JUMBO] URL base: ${subcategoria.url}`);

            let pagina = 1;
            let seguir = true;
            let urlsPaginaAnterior = new Set();

            while (seguir) {

                const urlPaginada = `${subcategoria.url}?page=${pagina}`;

                console.log(`[JUMBO] Página: ${pagina}`);
                console.log(`[JUMBO] URL paginada: ${urlPaginada}`);

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
                        console.log(`[JUMBO] Intento ${intentos} fallido cargando página ${pagina}`);
                        console.log(error.message);
                    }
                }

                if (!cargada) {
                    console.log(`[JUMBO] Página ${pagina} no se pudo cargar tras ${intentos} intentos, se omite`);
                    pagina++;
                    continue;
                }

                await page
                    .waitForSelector('a[href*="/p"]:has([class*="product-card-name"])', { timeout: 8000 })
                    .catch(() => null);

                await scrollHastaElFinal(page);

                const cards = await page
                    .locator('a[href*="/p"]:has([class*="product-card-name"])')
                    .all();

                console.log(`[JUMBO] Productos detectados en página ${pagina}: ${cards.length}`);

                if (cards.length === 0) {
                    console.log(`[JUMBO] Sin productos — fin de paginación`);
                    seguir = false;
                    break;
                }

                const urlsPaginaActual = new Set();
                for (const card of cards) {
                    const href = await card.getAttribute('href').catch(() => null);
                    if (href) urlsPaginaActual.add(href);
                }

                const mismasUrls = urlsPaginaAnterior.size > 0 &&
                    [...urlsPaginaActual].every(url => urlsPaginaAnterior.has(url));

                if (mismasUrls) {
                    console.log(`[JUMBO] Página ${pagina} igual a la anterior — fin de paginación`);
                    seguir = false;
                    break;
                }

                urlsPaginaAnterior = urlsPaginaActual;
                productosDetectados += cards.length;
                paginasScrapeadas++;

                for (let i = 0; i < cards.length; i++) {
                    try {
                        const card = cards[i];

                        let nombre = null;
                        try {
                            nombre = await card
                                .locator('[class*="product-card-name"]')
                                .first()
                                .innerText({ timeout: 3000 });
                        } catch {
                            nombre = null;
                        }

                        let precioTexto = null;
                        try {
                            const precioEl = await card
                                .locator('.product-prices__value, [class*="Price"], [class*="price"], .price')
                                .first();
                            precioTexto = await precioEl.innerText({ timeout: 3000 });
                        } catch {
                            precioTexto = null;
                        }

                        let precioUnitario = null;
                        try {
                            const unitEl = await card
                                .locator('[class*="unit"], [class*="Unit"], .price-per-unit')
                                .first();
                            precioUnitario = await unitEl.innerText({ timeout: 2000 });
                        } catch {
                            precioUnitario = null;
                        }

                        let link = null;
                        try {
                            link = await card
                                .getAttribute('href', { timeout: 3000 });
                        } catch {
                            link = null;
                        }

                        let imagen = null;
                        try {
                            imagen = await card
                                .locator('img')
                                .first()
                                .getAttribute('src', { timeout: 2000 });
                        } catch {
                            imagen = null;
                        }

                        if (!nombre || !link) {
                            continue;
                        }

                        const urlCompleta = link.startsWith('http')
                            ? link
                            : `https://www.jumbo.cl${link}`;

                        const sku = extraerSku(urlCompleta, 'Jumbo');

                        const lineasPrecio = (precioTexto || '')
                            .split('\n')
                            .map(l => l.trim())
                            .filter(Boolean);

                        const precioPrincipal = lineasPrecio[0] || precioTexto;

                        const producto = {
                            skuScraping: sku,
                            nombre: nombre.trim(),
                            precio: precioPrincipal,
                            precioUnitario: precioUnitario || null,
                            url: urlCompleta,
                            imagenUrl: imagen,
                            categoriaBasados: slugCategoria,
                            categoriaOrigen: subcategoria.nombre,
                            comercio: 'Jumbo',
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
                                console.log(`[JUMBO] ✓ ${nombre.trim()} — ${precioPrincipal}`);
                            } catch (error) {
                                console.log('[DB] Error guardando producto Jumbo');
                                console.log(error.message);
                            }
                        }

                    } catch (error) {
                        console.log('[JUMBO] Error leyendo card');
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
