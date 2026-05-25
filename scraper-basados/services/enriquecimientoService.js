const pool = require('../config/database');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const BATCH_SIZE = 20;
const DELAY_MS = 1000;

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
    "marca": "nombre de la marca comercial registrada (ej: Agrosuper, Don Pollo, Belmont, Sureña, Tottus, Lider, Ariztía, Sopraval, Miraflores, Natura, Chef) o null. IMPORTANTE: solo devuelve una marca si es claramente un nombre comercial registrado — NO devuelves descripciones del producto como 'Trutro', 'Vacuno', 'Pechuga', 'Maravilla', 'Canola', 'Oliva', 'Coco' (estos son tipos de aceite, no marcas). Capitaliza correctamente (primera letra mayúscula, resto minúsculas, ej: 'TOTTUS' → 'Tottus', 'DON POLLO' → 'Don Pollo')",
    "peso_gramos": número entero en gramos o null. Reglas estrictas: (1) Si el nombre incluye peso fijo (ej: "850 g", "2 kg"), conviértelo a gramos. (2) Si es una CARNE DE RES, AVE O PESCADO sin peso indicado (se vende al corte por kilo), usa 1000. (3) Si es un aceite, bebida, salsa u otro líquido, usa null aunque el precio sea por litro. (4) Para cualquier otro producto sin peso indicado, usa null,
    "unidad_formato": "g" para sólidos (carnes, embutidos, verduras), "ml" para líquidos (aceites, bebidas, salsas) o "un" para productos contables (packs, huevos). Si es líquido sin volumen indicado usa "ml",
    "calorias_100g": número entero de calorías por 100g o null,
    "proteinas_100g": número con decimales de proteínas por 100g o null,
    "grasas_100g": número con decimales de grasas por 100g o null,
    "carbohidratos_100g": número con decimales de carbohidratos por 100g o null
  }
]

Reglas:
- Para carnes sin marca visible, usa null en marca
- peso_gramos debe ser el peso del envase en gramos (ej: "850 g" → 850, "2 kg" → 2000). Para carnes/pescados sin peso indicado usa 1000. Para líquidos sin volumen indicado usa 1000 (representa 1 litro base)
- Para líquidos con volumen indicado (ej: "1 L", "500 ml") usa ese valor en ml como peso_gramos con unidad "ml"
- calorias_100g debe estar entre 0 y 900
- Si no puedes determinar un valor con confianza razonable, usa null`;

    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        throw new Error(`Error API Claude: ${response.status}`);
    }

    const data = await response.json();
    const texto = data.content[0].text.trim();

    // Intentar parsear directamente
    try {
        return JSON.parse(texto);
    } catch {}

    // Limpiar markdown y reintentar
    try {
        const limpio = texto
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();
        return JSON.parse(limpio);
    } catch {}

    // Extraer array con regex
    try {
        const match = texto.match(/\[[\s\S]*\]/);
        if (match) return JSON.parse(match[0]);
    } catch {}

    // Si todo falla, retornar array vacío para no bloquear el proceso
    console.warn('[ENRIQUECIMIENTO] JSON inválido, saltando batch');
    return [];
}

function validarDatos(datos) {
    const unidad = ['g', 'ml', 'un'].includes(datos.unidad_formato) ? datos.unidad_formato : 'g';
    return {
        calorias: datos.calorias_100g >= 0 && datos.calorias_100g <= 900
            ? datos.calorias_100g : null,
        proteinas: datos.proteinas_100g >= 0 && datos.proteinas_100g <= 100
            ? datos.proteinas_100g : null,
        grasas: datos.grasas_100g >= 0 && datos.grasas_100g <= 100
            ? datos.grasas_100g : null,
        carbohidratos: datos.carbohidratos_100g >= 0 && datos.carbohidratos_100g <= 100
            ? datos.carbohidratos_100g : null,
        peso_gramos: datos.peso_gramos > 0 && datos.peso_gramos <= 50000
            ? datos.peso_gramos : null,
        marca: datos.marca && datos.marca.length > 0 && datos.marca.length <= 100
            ? datos.marca : null,
        unidad_formato: unidad
    };
}

async function obtenerOCrearMarca(nombreMarca) {
    if (!nombreMarca) return null;

    const existing = await pool.query(
        'SELECT id_marca FROM marcas WHERE LOWER(nombre) = LOWER($1)',
        [nombreMarca]
    );

    if (existing.rows.length > 0) return existing.rows[0].id_marca;

    const inserted = await pool.query(
        'INSERT INTO marcas (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING RETURNING id_marca',
        [nombreMarca]
    );

    if (inserted.rows.length > 0) return inserted.rows[0].id_marca;

    const retry = await pool.query(
        'SELECT id_marca FROM marcas WHERE LOWER(nombre) = LOWER($1)',
        [nombreMarca]
    );
    return retry.rows[0]?.id_marca ?? null;
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

    const existing = await pool.query(
        'SELECT id_formato FROM formatos WHERE nombre = $1 AND unidad = $2',
        [nombre, unidad]
    );
    if (existing.rows.length > 0) return existing.rows[0].id_formato;

    const inserted = await pool.query(
        'INSERT INTO formatos (nombre, peso_gramos, unidad) VALUES ($1, $2, $3) ON CONFLICT (nombre, unidad) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id_formato',
        [nombre, unidad === 'g' ? cantidad : null, unidad]
    );
    return inserted.rows[0]?.id_formato ?? null;
}

async function actualizarProducto(idProducto, datos) {
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
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_producto = $7
    `, [
        datos.calorias,
        datos.proteinas,
        datos.grasas,
        datos.carbohidratos,
        idMarca,
        idFormato,
        idProducto
    ]);
}

async function marcarIntentado(idProducto) {
    await pool.query(
        'UPDATE productos SET enriquecido = true WHERE id_producto = $1',
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
