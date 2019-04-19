require( 'node-import' );
require( 'dotenv' ).config();
var sleep = require( 'sleep' );
var puppeteer = require( 'puppeteer' );

/**
 * Importo las configuraciones desde configuration.js
 */
imports( 'configuration' );

/**
 * Importo las funciones de apoyo desde functions.js
 */
imports( 'functions' );

/**
 * Import configuration for all sites. Array with objects.
 */
var all_sites = require('./sites.json');

log('Iniciando Bot para pasear por los sitios webs');

/*****************************************************
 **                Flujo Principal                  **
 *****************************************************/

function init() {
    //console.log(all_sites);

    let actualSite = 0;

    async function controlSite() {
        if (actualSite >= all_sites.length) {
            return false;
        }

        let configSite = all_sites[actualSite];
        await visitWebsite(configSite);

        actualSite++;
        controlSite();
    }

    controlSite();
}

init();

async function visitWebsite(configSite) {
    log(configSite);

    // Inicio el navegador.
    log('Open Browser');
    const browser = await initBrowser(puppeteer, hideBrowser, isRaspberry);
    const page = await initPage(browser);

    // Si existe login se realiza
    if (configSite.url_login) {
        log('Realizando proceso de Login en ' + configSite.url_login);
        await login(
            page,
            configSite.url_login,
            configSite.selector_user,
            configSite.username,
            configSite.selector_password,
            configSite.password,
            configSite.selector_login_button,
        );
        await sleep.sleep(getRandomInt(1, 5));
    }

    // Visit the main website.
    log('Go to website: ' + configSite.url_web);
    await goToPage(page, configSite.url_web);
    await sleep.sleep(getRandomInt(3, 13));

    await browser.close();
    await sleep.sleep(getRandomInt(1, 5));
}
