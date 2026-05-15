function extraerSku(url) {

    if (!url) {
        return null;
    }

    const match = url.match(/\/(\d{8,})$/);

    if (!match) {
        return null;
    }

    return match[1];
}

module.exports = {
    extraerSku
};