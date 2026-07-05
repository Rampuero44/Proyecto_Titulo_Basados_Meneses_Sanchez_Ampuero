require('dotenv').config();

if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[SERVER] ERROR FATAL: falta la variable de entorno ANTHROPIC_API_KEY');
    console.error('[SERVER] El enriquecimiento de productos no funcionará sin esta key.');
    console.error('[SERVER] Defínela en scraper-basados/.env antes de iniciar el servidor.');
    process.exit(1);
}

const express = require('express');
const { chromium } = require('playwright');

const pool = require('./config/database');

const {
    extraerProductosCategoria
} = require('./scrapers/lider/scraperCategoria');

const {
    extraerProductosCategoria: extraerProductosCategoriaTottus
} = require('./scrapers/tottus/scraperCategoria');

const {
    extraerProductosCategoria: extraerProductosCategoriaJumbo
} = require('./scrapers/jumbo/scraperCategoria');

const {
    enriquecerProductosNuevos
} = require('./services/enriquecimientoService');

const app = express();
const PORT = 3001;

const INACTIVIDAD_MS = 5 * 60 * 1000;
const TECHO_ABSOLUTO_MS = 3 * 60 * 60 * 1000;
const INTERVALO_CHEQUEO_MS = 30 * 1000;

function ejecutarConVigilancia(factory, { inactividadMs, techoMs }) {
    return new Promise((resolve, reject) => {
        let terminado = false;
        let ultimaActividad = Date.now();

        const marcarActividad = () => {
            ultimaActividad = Date.now();
        };

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

app.use(express.json());

pool.query('SELECT NOW()')
    .then(() => console.log('POSTGRESQL CONNECTED'))
    .catch((error) => {
        console.log('POSTGRESQL ERROR');
        console.log(error.message);
    });

app.get('/buscar', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Debe enviar query' });

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const url = `https://super.lider.cl/search?query=${query}`;
        console.log(`[BUSCAR] ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);

        const productos = [];
        const links = await page.locator('a[href*="/ip/"]').all();

        for (let i = 0; i < links.length; i++) {
            try {
                const nombre = await links[i].innerText();
                const href = await links[i].getAttribute('href');
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
        console.log(error);
        res.status(500).json({ error: error.message });
    } finally {
        await browser.close();
    }
});

app.get('/categoria/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const productos = await ejecutarConVigilancia(
            (marcarActividad) => extraerProductosCategoria(slug, marcarActividad),
            { inactividadMs: INACTIVIDAD_MS, techoMs: TECHO_ABSOLUTO_MS }
        );
        res.json({ comercio: 'Lider', categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/lider/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const productos = await ejecutarConVigilancia(
            (marcarActividad) => extraerProductosCategoria(slug, marcarActividad),
            { inactividadMs: INACTIVIDAD_MS, techoMs: TECHO_ABSOLUTO_MS }
        );
        res.json({ comercio: 'Lider', categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/tottus/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const productos = await ejecutarConVigilancia(
            (marcarActividad) => extraerProductosCategoriaTottus(slug, marcarActividad),
            { inactividadMs: INACTIVIDAD_MS, techoMs: TECHO_ABSOLUTO_MS }
        );
        res.json({ categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/jumbo/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        console.log(`[SERVER] Iniciando scraping Jumbo — categoría: ${slug}`);
        const productos = await ejecutarConVigilancia(
            (marcarActividad) => extraerProductosCategoriaJumbo(slug, marcarActividad),
            { inactividadMs: INACTIVIDAD_MS, techoMs: TECHO_ABSOLUTO_MS }
        );
        res.json({ comercio: 'Jumbo', categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
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
