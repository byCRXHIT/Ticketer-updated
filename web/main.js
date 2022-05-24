/* Import modules */
const express = require('express');
const { ChalkAdvanced } = require('chalk-advanced');
const { join } = require('path');

/* Import modules */
const middleware = require('./api/middleware');

/* Misc */
const app = express();

/* Export */
module.exports = () => {
  // Initialise middleware
  middleware.initialize(app);

  // Import api
  middleware.api(app);

  // Import web
  middleware.web(app);

  console.log(ChalkAdvanced.bgGreen(ChalkAdvanced.black(' [WEB] Website online ')));
};
