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

    all_sites.forEach((ele) => {
        visitWebsite(ele);
    });
}

init();

async function visitWebsite(configSite) {
    log(configSite);

    // Inicio el navegador y realizo el login.
    log('Open Browser');
    const browser = await initBrowser(puppeteer, hideBrowser, isRaspberry);
    const page = await initPage(browser);

    // Si existe login se realiza
    if (configSite.url_login) {
        log('Realizando proceso de Login en ' + configSite.url_login);
        await login(page, configSite.url_login);
        sleep.sleep(getRandomInt(1, 5));
    }

    // Visit the main website.
    log('Go to ' + configSite.url_web);
    await goToPage(page, configSite.url_web);
    sleep.sleep(getRandomInt(3, 13));

    await browser.close();
}
