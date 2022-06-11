/* Import modules */
const express = require('express');
const { ChalkAdvanced } = require('chalk-advanced');
const { join } = require('path');
require('dotenv').config();

/* Import modules */
const middleware = require('./api/middleware');

/* Misc */
const app = express();
app.listen(process.env.PORT)

/* Export */
module.exports = (client) => {
  // Initialise middleware
  middleware.initialize(app, client);

  // Import api
  middleware.api(app, client);

  // Import web
  middleware.web(app, client);

  // Import cdn
  middleware.cdn(app);

  console.log(ChalkAdvanced.bgGreen(ChalkAdvanced.black(` [WEB] Website online.`)));
  console.log(ChalkAdvanced.bgBlue(ChalkAdvanced.black(` [WEB] Webserver is running on port: ${process.env.PORT}`)));
};
