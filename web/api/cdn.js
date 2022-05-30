/* Import modules */
const { join } = require('path');
const { static } = require('express');

/* Export */
module.exports = (app) => {
    app.use('/assets', static(join(__dirname, '../cdn/assets')));

    return app;
}