function extraerSkuPorIdNumerico(url) {
    if (!url) {
        return null;
    }

    const match = url.match(/\/(\d{8,})$/);

    if (!match) {
        return null;
    }

    return match[1];
}

function extraerSkuJumbo(url) {
    if (!url) {
        return null;
    }

    const partes = url.replace(/\/$/, '').split('/');
    const ultimo = partes[partes.length - 1];
    const penultimo = partes[partes.length - 2];
    const slug = ultimo === 'p' ? penultimo : ultimo;

    const match = slug.match(/(\d{5,})/);
    if (match) {
        return match[1];
    }

    return slug;
}

const extractoresPorComercio = {
    Lider: extraerSkuPorIdNumerico,
    Tottus: extraerSkuPorIdNumerico,
    Jumbo: extraerSkuJumbo
};

function extraerSku(url, comercio) {
    const extractor = extractoresPorComercio[comercio] ?? extraerSkuPorIdNumerico;
    return extractor(url);
}

module.exports = {
    extraerSku,
    extraerSkuJumbo
};
