
/*****************************************************
 Funciones
 *****************************************************/
/**
 * Retorna un entero aleatorio entre min (incluido) y max (excluido)
 * @param  {Number} min Valor mínimo
 * @param  {Number} max Valor máximo (Excluido)
 * @return {Number}     Devuelve un entero
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Inicializo la ventana del navegador.
 * @returns {Promise<*>}
 */
async function initBrowser(puppeteer, hideBrowser, isRaspberry) {
    let browser;

    if (isRaspberry == 'true') {
        log('Iniciando Navegador chromium de repositorio');

        browser = await puppeteer.launch({
            headless: hideBrowser, // Muestra o no el navegador
            args:[
                '--no-sandbox', // Deshabilita sandbox si el kernel no lo dispone
                '--disable-setuid-sandbox', // Deshabilita sandbox si el kernel no lo dispone
            ],
            executablePath: '/usr/bin/chromium-browser',
        });
    } else {
        log('Iniciando Navegador Chromium del paquete');

        browser = await puppeteer.launch({
            headless: hideBrowser, // Muestra o no el navegador
            args:[
                '--no-sandbox', // Deshabilita sandbox si el kernel no lo dispone
                '--disable-setuid-sandbox', // Deshabilita sandbox si el kernel no lo dispone
            ],
        });
    }

    return browser;
}

/**
 * Inicializa y configura la página.
 * @returns {Promise<void>}
 */
async function initPage(browser) {
    let page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    return page;
}

/**
 * Efectua el proceso de login.
 * @param page
 * @returns {Promise<void>}
 */
async function login(page, urlSiteLogin, selector_user, username,
                     selector_password, password, selector_login_button) {
    await page.goto(urlSiteLogin, {
        waitUntil: 'networkidle0' // Esperando a que cargue la página
    });

    await page.type(selector_user, username);
    await page.type(selector_password, password);

    /**
     * Pulso enviar formulario y espero a completar login.
     */
    await Promise.all([
        page.click(selector_login_button),
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 }),
    ]);
}

/**
 * Entra en la url recibida.
 * @param page
 * @param urlSiteLogin
 */
async function goToPage(page, url, gotoTimeout = 30000) {
    log('Go to Page: ' + url);

    try {
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: gotoTimeout
        });
    } catch (error) {
        console.error(error);
        log('No se pudo navegar a: ' + seccion + ' con el error:');
        log(error);
    }
}

async function getAllLinks(page, id) {
    console.log('Obteniendo Links');

    let allLinks = await page.$$eval(`${id} a`, anchors => {
        return anchors.map(anchor => anchor.href);
    });

    // TODO → Filtrar los links desde blacklist.json
    // TODO → Filtrar enlaces para dejar rutas únicas
    // TODO → Filtrar enlaces que coincidan con el recurso

    // Desordeno todos los enlaces de la colección.
    let filtrados = allLinks.sort(function() {return Math.random() - 0.5});

    return filtrados;
}

function log(info) {
    console.log(info);
    // Todo → Registrar en archivo de logs
}
