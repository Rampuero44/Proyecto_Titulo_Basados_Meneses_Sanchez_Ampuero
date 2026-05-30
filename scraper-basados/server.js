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

app.use(express.json());

pool.query('SELECT NOW()')
    .then(() => console.log('POSTGRESQL CONNECTED'))
    .catch((error) => {
        console.log('POSTGRESQL ERROR');
        console.log(error.message);
    });

// ── Lider ────────────────────────────────────────────────────────────────────

app.get('/buscar', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Debe enviar query' });

    const browser = await chromium.launch({ headless: false });
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
        const productos = await extraerProductosCategoria(slug);
        res.json({ comercio: 'Lider', categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// Alias para consistencia con otros scrapers
app.get('/lider/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const productos = await extraerProductosCategoria(slug);
        res.json({ comercio: 'Lider', categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// ── Tottus ───────────────────────────────────────────────────────────────────

app.get('/tottus/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const productos = await extraerProductosCategoriaTottus(slug);
        res.json({ categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// ── Jumbo ────────────────────────────────────────────────────────────────────

app.get('/jumbo/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        console.log(`[SERVER] Iniciando scraping Jumbo — categoría: ${slug}`);
        const productos = await extraerProductosCategoriaJumbo(slug);
        res.json({ comercio: 'Jumbo', categoria: slug, total: productos.length, productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// ── Enriquecimiento IA ────────────────────────────────────────────────────────

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