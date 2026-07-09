require('dotenv').config();

if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[SERVER] ERROR FATAL: falta la variable de entorno ANTHROPIC_API_KEY');
    process.exit(1);
}

const express = require('express');
const { chromium } = require('playwright');

const pool = require('./config/database');
const { extraerProductosCategoria } = require('./scrapers/lider/scraperCategoria');
const { extraerProductosCategoria: extraerProductosCategoriaTottus } = require('./scrapers/tottus/scraperCategoria');
const { extraerProductosCategoria: extraerProductosCategoriaJumbo } = require('./scrapers/jumbo/scraperCategoria');
const { enriquecerProductosNuevos } = require('./services/enriquecimientoService');
const { adquirirLock, liberarLock, marcarLockFallido } = require('./services/lockService');

const app = express();
const PORT = 3001;

const INACTIVIDAD_MS = 5 * 60 * 1000;
const TECHO_ABSOLUTO_MS = 3 * 60 * 60 * 1000;
const INTERVALO_CHEQUEO_MS = 30 * 1000;

const COMERCIOS = { lider: 1, tottus: 2, jumbo: 3 };

function ejecutarConVigilancia(factory, { inactividadMs, techoMs }) {
    return new Promise((resolve, reject) => {
        let terminado = false;
        let ultimaActividad = Date.now();

        const marcarActividad = () => { ultimaActividad = Date.now(); };

        const finalizar = (callback, valor) => {
            if (terminado) return;
            terminado = true;
            clearInterval(intervalId);
            clearTimeout(techoId);
            callback(valor);
        };

        const intervalId = setInterval(() => {
            const inactivoPor = Date.now() - ultimaActividad;
            if (inactivoPor > inactividadMs) {
                finalizar(reject, new Error(
                    `Scraping abortado por inactividad: ${Math.round(inactivoPor / 60000)} min sin guardar productos nuevos`
                ));
            }
        }, INTERVALO_CHEQUEO_MS);

        const techoId = setTimeout(() => {
            finalizar(reject, new Error(
                `Scraping abortado: superó el techo absoluto de ${techoMs / 3600000} horas`
            ));
        }, techoMs);

        factory(marcarActividad)
            .then((resultado) => finalizar(resolve, resultado))
            .catch((error) => finalizar(reject, error));
    });
}

async function ejecutarScraping(res, nombreComercio, slug, scraperFn) {
    const idComercio = COMERCIOS[nombreComercio.toLowerCase()];
    const idLog = await adquirirLock(idComercio, slug);

    if (!idLog) {
        return res.status(409).json({ error: `Scraping de ${nombreComercio} ya está en curso` });
    }

    try {
        const productos = await ejecutarConVigilancia(
            (marcarActividad) => scraperFn(slug, marcarActividad),
            { inactividadMs: INACTIVIDAD_MS, techoMs: TECHO_ABSOLUTO_MS }
        );
        await liberarLock(idLog, { detectados: productos.length, actualizados: productos.length });
        res.json({ comercio: nombreComercio, categoria: slug, total: productos.length, productos });
    } catch (error) {
        await marcarLockFallido(idLog, error);
        res.status(500).json({ error: error.message });
    }
}

app.use(express.json());

pool.query('SELECT NOW()')
    .then(() => console.log('POSTGRESQL CONNECTED'))
    .catch((error) => {
        console.error('POSTGRESQL ERROR:', error.message);
    });

app.get('/buscar', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Debe enviar query' });

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const url = `https://super.lider.cl/search?query=${query}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);

        const productos = [];
        const links = await page.locator('a[href*="/ip/"]').all();

        for (const link of links) {
            try {
                const nombre = await link.innerText();
                const href = await link.getAttribute('href');
                if (!href || !nombre) continue;
                productos.push({
                    nombre: nombre.trim(),
                    url: href.startsWith('http') ? href : `https://super.lider.cl${href}`
                });
            } catch {
                console.log('[BUSCAR] Error leyendo producto');
            }
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await browser.close();
    }
});

app.get('/lider/:slug', async (req, res) => {
    await ejecutarScraping(res, 'Lider', req.params.slug, extraerProductosCategoria);
});

app.get('/categoria/:slug', async (req, res) => {
    await ejecutarScraping(res, 'Lider', req.params.slug, extraerProductosCategoria);
});

app.get('/tottus/:slug', async (req, res) => {
    await ejecutarScraping(res, 'Tottus', req.params.slug, extraerProductosCategoriaTottus);
});

app.get('/jumbo/:slug', async (req, res) => {
    await ejecutarScraping(res, 'Jumbo', req.params.slug, extraerProductosCategoriaJumbo);
});

app.post('/enriquecer', async (req, res) => {
    try {
        console.log('[SERVER] Iniciando enriquecimiento manual');
        const resultado = await enriquecerProductosNuevos();
        res.json({ ok: true, ...resultado });
    } catch (error) {
        console.error('[SERVER] Error en enriquecimiento:', error.message);
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`SCRAPER BASADOS RUNNING PORT ${PORT}`);
});