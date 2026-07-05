const { chromium } = require('playwright');

async function ejecutar() {

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(
        'https://super.lider.cl/search?q=pepsi',
        {
            waitUntil: 'domcontentloaded'
        }
    );

    await page.waitForTimeout(8000);

    const links =
        await page.locator('a[href*="/ip/"]').all();

    console.log(
        'PRODUCTOS ENCONTRADOS:',
        links.length
    );

    const resultados = [];

    for (let i = 0; i < links.length; i++) {

        try {

            const nombre =
                await links[i].innerText();

            const href =
                await links[i].getAttribute('href');

            if (!href) {
                continue;
            }

            const productoPage =
                await browser.newPage();

            await productoPage.goto(
                `https://super.lider.cl${href}`,
                {
                    waitUntil: 'domcontentloaded'
                }
            );

            await productoPage.waitForTimeout(3000);

            const textos =
                await productoPage
                    .locator('span')
                    .allInnerTexts();

            let precio = 'NO ENCONTRADO';

            for (const texto of textos) {

                if (texto.includes('$')) {

                    precio = texto;

                    break;
                }
            }

            resultados.push({
                nombre,
                precio,
                url: `https://super.lider.cl${href}`
            });

            console.log(
                `OK: ${nombre}`
            );

            await productoPage.close();

        } catch (error) {

            console.log(
                'ERROR PRODUCTO'
            );

            console.log(error);
        }
    }

    console.log('================');

    console.log(
        JSON.stringify(
            resultados,
            null,
            2
        )
    );

    await browser.close();
}

ejecutar();