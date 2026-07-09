const pool = require('../config/database');
const { registrarAuditoriaProducto } = require('./productoService');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const BATCH_SIZE = Number(process.env.ENRIQUECIMIENTO_BATCH_SIZE) || 20;
const DELAY_MS = 1000;
const MODEL = 'claude-haiku-4-5-20251001';

async function obtenerProductosSinEnriquecer() {
    const result = await pool.query(`
        SELECT id_producto, nombre
        FROM productos
        WHERE enriquecido = false
        ORDER BY fecha_creacion DESC
        LIMIT $1
    `, [BATCH_SIZE]);
    return result.rows;
}

async function consultarClaude(productos) {
    const listaProductos = productos
        .map((p, i) => `${i + 1}. "${p.nombre}"`)
        .join('\n');

    const prompt = `Eres un experto en productos alimenticios chilenos. Para cada producto de la lista, extrae la siguiente información en formato JSON.

CRÍTICO: Responde ÚNICAMENTE con el array JSON. Sin texto antes, sin texto después, sin explicaciones, sin markdown, sin bloques de código, sin backticks. Solo el array JSON puro comenzando con [ y terminando con ].

Productos:
${listaProductos}

Formato exacto requerido:
[
  {
    "index": 1,
    "marca": "nombre de la marca comercial registrada o null. REGLAS ESTRICTAS: (1) Solo devuelve una marca si es claramente un nombre comercial registrado (ej: Agrosuper, Don Pollo, Ariztía, Sopraval, Miraflores, Belmont, Sureña, Natura, Chef, Super Cerdo, Cuisine & Co). (2) Los nombres de supermercados NO son marcas de producto: 'Tottus' y 'Lider' son tiendas, no marcas — usa null si el producto no tiene otra marca identificable. (3) NO devuelvas cortes, tipos o ingredientes como marca: 'Trutro', 'Vacuno', 'Pechuga', 'Maravilla', 'Canola', 'Oliva', 'Coco', 'Entero', 'Trozado' NO son marcas. (4) Capitaliza correctamente: primera letra mayúscula, resto minúsculas (ej: 'AGROSUPER' → 'Agrosuper', 'DON POLLO' → 'Don Pollo')",
    "peso_gramos": número entero en gramos o ml según unidad, o null,
    "unidad_formato": "g" para sólidos, "ml" para líquidos o "un" para packs,
    "cantidad_pack": número entero de unidades en el pack o null,
    "calorias_100g": número entero de calorías por 100g o null,
    "proteinas_100g": número con decimales de proteínas por 100g o null,
    "grasas_100g": número con decimales de grasas por 100g o null,
    "carbohidratos_100g": número con decimales de carbohidratos por 100g o null
  }
]`;

    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        throw new Error(`Error API Claude: ${response.status}`);
    }

    const data = await response.json();

    if (!data.content || data.content.length === 0 || !data.content[0].text) {
        throw new Error('Respuesta de Claude sin contenido');
    }

    const texto = data.content[0].text.trim();

    try {
        return JSON.parse(texto);
    } catch {}

    try {
        const limpio = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(limpio);
    } catch {}

    throw new Error('No se pudo parsear la respuesta de Claude como JSON');
}

function validarDatos(datos) {
    if (!datos) return {};

    return {
        marca: typeof datos.marca === 'string' ? datos.marca : null,
        peso_gramos: Number.isInteger(datos.peso_gramos) && datos.peso_gramos > 0 ? datos.peso_gramos : null,
        unidad_formato: ['g', 'ml', 'un'].includes(datos.unidad_formato) ? datos.unidad_formato : 'g',
        cantidad_pack: Number.isInteger(datos.cantidad_pack) && datos.cantidad_pack > 0 ? datos.cantidad_pack : null,
        calorias: Number.isInteger(datos.calorias_100g) && datos.calorias_100g >= 0 && datos.calorias_100g <= 900 ? datos.calorias_100g : null,
        proteinas: typeof datos.proteinas_100g === 'number' && datos.proteinas_100g >= 0 && datos.proteinas_100g <= 100 ? datos.proteinas_100g : null,
        grasas: typeof datos.grasas_100g === 'number' && datos.grasas_100g >= 0 && datos.grasas_100g <= 100 ? datos.grasas_100g : null,
        carbohidratos: typeof datos.carbohidratos_100g === 'number' && datos.carbohidratos_100g >= 0 && datos.carbohidratos_100g <= 100 ? datos.carbohidratos_100g : null,
    };
}

async function obtenerOCrearMarca(nombreMarca) {
    if (!nombreMarca || typeof nombreMarca !== 'string' || !nombreMarca.trim()) return null;
    const nombre = nombreMarca.trim();
    const existing = await pool.query('SELECT id_marca FROM marcas WHERE LOWER(nombre) = LOWER($1)', [nombre]);
    if (existing.rows.length > 0) return existing.rows[0].id_marca;
    try {
        const inserted = await pool.query(
            'INSERT INTO marcas (nombre) VALUES ($1) ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id_marca',
            [nombre]
        );
        return inserted.rows[0]?.id_marca ?? null;
    } catch {
        const retry = await pool.query('SELECT id_marca FROM marcas WHERE LOWER(nombre) = LOWER($1)', [nombre]);
        return retry.rows[0]?.id_marca ?? null;
    }
}

async function obtenerOCrearFormato(cantidad, unidad = 'g') {
    if (!cantidad) return null;
    let nombre;
    if (unidad === 'ml') {
        nombre = cantidad >= 1000 ? `${(cantidad / 1000).toFixed(1)} L` : `${cantidad} ml`;
    } else if (unidad === 'un') {
        nombre = `${cantidad} unidades`;
    } else {
        nombre = cantidad >= 1000 ? `${(cantidad / 1000).toFixed(1)} kg` : `${cantidad} g`;
    }
    const existing = await pool.query('SELECT id_formato FROM formatos WHERE nombre = $1 AND unidad = $2', [nombre, unidad]);
    if (existing.rows.length > 0) return existing.rows[0].id_formato;
    const inserted = await pool.query(
        'INSERT INTO formatos (nombre, peso_gramos, unidad) VALUES ($1, $2, $3) ON CONFLICT (nombre, unidad) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id_formato',
        [nombre, unidad === 'g' ? cantidad : null, unidad]
    );
    return inserted.rows[0]?.id_formato ?? null;
}

async function obtenerEstadoActual(idProducto) {
    const result = await pool.query(`
        SELECT p.calorias, p.proteinas, p.grasas, p.carbohidratos,
               m.nombre AS marca, f.nombre AS formato
        FROM productos p
        LEFT JOIN marcas m ON m.id_marca = p.id_marca
        LEFT JOIN formatos f ON f.id_formato = p.id_formato
        WHERE p.id_producto = $1
    `, [idProducto]);
    return result.rows[0] ?? null;
}

async function actualizarProducto(idProducto, datos) {
    const estadoAnterior = await obtenerEstadoActual(idProducto);
    const idMarca = await obtenerOCrearMarca(datos.marca);
    const idFormato = await obtenerOCrearFormato(datos.peso_gramos, datos.unidad_formato ?? 'g');

    await pool.query(`
        UPDATE productos SET
            calorias = COALESCE($1, calorias),
            proteinas = COALESCE($2, proteinas),
            grasas = COALESCE($3, grasas),
            carbohidratos = COALESCE($4, carbohidratos),
            id_marca = COALESCE($5, id_marca),
            id_formato = COALESCE($6, id_formato),
            enriquecido = true,
            enriquecimiento_exitoso = true,
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_producto = $7
    `, [datos.calorias, datos.proteinas, datos.grasas, datos.carbohidratos, idMarca, idFormato, idProducto]);

    try {
        await registrarAuditoriaProducto(idProducto, 'enriquecido', estadoAnterior, {
            calorias: datos.calorias, proteinas: datos.proteinas,
            grasas: datos.grasas, carbohidratos: datos.carbohidratos,
            marca: datos.marca, peso_gramos: datos.peso_gramos, unidad_formato: datos.unidad_formato
        }, 'enriquecimiento-ia');
    } catch {
        console.log('[AUDITORIA] Error registrando enriquecimiento de producto');
    }
}

async function marcarIntentado(idProducto) {
    await pool.query(
        'UPDATE productos SET enriquecido = true, enriquecimiento_exitoso = false WHERE id_producto = $1',
        [idProducto]
    );
}

async function enriquecerProductosNuevos() {
    const productos = await obtenerProductosSinEnriquecer();

    if (productos.length === 0) {
        console.log('[ENRIQUECIMIENTO] No hay productos pendientes');
        return { procesados: 0, exitosos: 0, fallidos: 0 };
    }

    console.log(`[ENRIQUECIMIENTO] Procesando ${productos.length} productos`);

    let exitosos = 0;
    let fallidos = 0;

    try {
        const resultados = await consultarClaude(productos);

        for (const resultado of resultados) {
            const producto = productos[resultado.index - 1];
            if (!producto) continue;

            try {
                const datosValidados = validarDatos(resultado);
                await actualizarProducto(producto.id_producto, datosValidados);
                exitosos++;
                console.log(`[ENRIQUECIMIENTO] OK: ${producto.nombre}`);
            } catch (error) {
                await marcarIntentado(producto.id_producto);
                fallidos++;
                console.error(`[ENRIQUECIMIENTO] Error actualizando ${producto.nombre}: ${error.message}`);
            }

            await new Promise(r => setTimeout(r, DELAY_MS));
        }

        const noRespondidos = productos.filter(
            p => !resultados.find(r => productos[r.index - 1]?.id_producto === p.id_producto)
        );
        for (const p of noRespondidos) {
            await marcarIntentado(p.id_producto);
            fallidos++;
        }

    } catch (error) {
        console.error(`[ENRIQUECIMIENTO] Error consultando Claude: ${error.message}`);
        for (const p of productos) {
            await marcarIntentado(p.id_producto);
        }
        fallidos = productos.length;
    }

    console.log(`[ENRIQUECIMIENTO] Completado: ${exitosos} exitosos, ${fallidos} fallidos`);
    return { procesados: productos.length, exitosos, fallidos };
}

module.exports = { enriquecerProductosNuevos };