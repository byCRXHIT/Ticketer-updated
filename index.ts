/* Import modules */
import dotenv from 'dotenv';
dotenv.config();

/* Misc */
console.clear();

/* Import database */
require('./db/main.js')();

/* Initialize client */
require('./bot/main.js')();

/* Initialize website */
require('./web/main.js')();