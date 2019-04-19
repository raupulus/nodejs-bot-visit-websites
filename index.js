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

console.log('Iniciando Bot para pasear por los sitios webs');

/*****************************************************
                  Flujo Principal
 *****************************************************/
