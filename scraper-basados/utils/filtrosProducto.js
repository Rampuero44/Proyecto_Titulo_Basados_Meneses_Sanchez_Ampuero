const filtrosCategorias = require('../config/filtrosCategorias');
const { normalizarTexto } = require('./normalizadorTexto');

function pasaFiltros(producto, slugCategoria) {
    const filtrosBase = filtrosCategorias[slugCategoria];

    if (!filtrosBase) {
        return true;
    }

    const overrides = filtrosBase.porComercio?.[producto.comercio];
    const incluir = overrides?.incluir ?? filtrosBase.incluir ?? [];
    const excluir = overrides?.excluir ?? filtrosBase.excluir ?? [];

    const textoProducto = normalizarTexto(producto.nombre || '');

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

module.exports = {
    pasaFiltros
};
