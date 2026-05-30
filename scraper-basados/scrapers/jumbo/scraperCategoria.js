const { chromium } = require('playwright');
const categoriasJumbo = require('../../config/categoriasJumbo');
const filtrosCategorias = require('../../config/filtrosCategorias');
const { normalizarTexto } = require('../../utils/normalizadorTexto');
const { guardarProducto, obtenerComercioId } = require('../../services/productoService');
const {
    iniciarLog,
    finalizarLog
} = require('../../services/scrapingLogService');

// ─── Filtros ──────────────────────────────────────────────────────────────────

function pasaFiltros(producto, slugCategoria) {
    const filtros = filtrosCategorias[slugCategoria];
    if (!filtros) return true;

    const textoProducto = normalizarTexto(producto.nombre || '');
    const incluir = filtros.incluir || [];
    const excluir = filtros.excluir || [];

    const tieneExclusion = excluir.some(keyword =>
        textoProducto.includes(normalizarTexto(keyword))
    );
    if (tieneExclusion) return false;
    if (incluir.length === 0) return true;

    return incluir.some(keyword =>
        textoProducto.includes(normalizarTexto(keyword))
    );
}

// ─── Extraer SKU desde URL de Jumbo ──────────────────────────────────────────

function extraerSkuJumbo(url) {
    const partes = url.replace(/\/$/, '').split('/');
    const ultimo = partes[partes.length - 1];
    const penultimo = partes[partes.length - 2];
    const slug = ultimo === 'p' ? penultimo : ultimo;

    // Intentar extraer ID numérico del slug (ej: 1996518 de lomo-liso-1996518-kg)
    const match = slug.match(/(\d{5,})/);
    if (match) return match[1];

    // Si no hay ID numérico, usar el slug completo
    return slug;
}

// ─── Scroll infinito: bajar hasta cargar todos los productos ─────────────────

async function scrollHastaElFinal(page, maxScrolls = 20) {
    let scrollsHechos = 0;
    let alturaAnterior = 0;

    while (scrollsHechos < maxScrolls) {
        const alturaActual = await page.evaluate(() => document.body.scrollHeight);

        if (alturaActual === alturaAnterior) {
            // No hubo cambio de altura — ya llegamos al final
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

// ─── Scraper principal ────────────────────────────────────────────────────────

async function extraerProductosCategoria(slugCategoria) {

    const categoria = categoriasJumbo[slugCategoria];

    if (!categoria) {
        throw new Error(`Categoría no configurada para Jumbo: ${slugCategoria}`);
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

            // Jumbo tiene id de comercio 2 en la BD
            const idLog = await iniciarLog({
                idComercio: await obtenerComercioId('Jumbo'),
                subcategoria: subcategoria.nombre
            });

            const page = await browser.newPage();

            // Evitar bloqueos — user agent de Chrome real
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

                try {
                    await page.goto(urlPaginada, {
                        waitUntil: 'domcontentloaded',
                        timeout: 30000
                    });
                } catch (e) {
                    console.log(`[JUMBO] Error cargando página: ${e.message}`);
                    seguir = false;
                    break;
                }

                await page.waitForTimeout(4000);

                // Si Jumbo usa scroll infinito, bajar hasta cargar todos
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

                // Detectar fin de paginación comparando URLs con página anterior
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

                        // Nombre del producto
                        let nombre = null;
                        try {
                            nombre = await card
                                .locator('[class*="product-card-name"]')
                                .first()
                                .innerText({ timeout: 3000 });
                        } catch {
                            nombre = null;
                        }

                        // Precio principal
                        let precioTexto = null;
                        try {
                            const precioEl = await card
                                .locator('.product-prices__value, [class*="Price"], [class*="price"], .price')
                                .first();
                            precioTexto = await precioEl.innerText({ timeout: 3000 });
                        } catch {
                            precioTexto = null;
                        }

                        // Precio unitario (por kg/lt)
                        let precioUnitario = null;
                        try {
                            const unitEl = await card
                                .locator('[class*="unit"], [class*="Unit"], .price-per-unit')
                                .first();
                            precioUnitario = await unitEl.innerText({ timeout: 2000 });
                        } catch {
                            precioUnitario = null;
                        }

                        // URL del producto - la card ES el link <a>
                        let link = null;
                        try {
                            link = await card
                                .getAttribute('href', { timeout: 3000 });
                        } catch {
                            link = null;
                        }

                        // Imagen
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

                        const sku = extraerSkuJumbo(urlCompleta);

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
