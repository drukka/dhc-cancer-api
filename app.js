'use strict';

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const oasTools = require('oas-tools');
const helmet = require('helmet');
const cors = require('cors');
const mung = require('express-mung');
const languageHeaderParser = require('accept-language-parser');

const { openApi, html } = require('./app/lib');
const { PORT, OAS_TOOLS_CONFIGURATION } = require('./app/config');
const { authService } = require('./app/auth/services');

// load and configure OpenAPI specification
const oasDoc = openApi.loadSpecification();
oasTools.configure(Object.assign(
  {},
  OAS_TOOLS_CONFIGURATION,
  {
    securityFile: {
      Bearer: authService.verifyToken
    }
  }
));

// global middlewares
app.use(bodyParser.json({ limit: '40mb' }));
app.use(helmet());
app.use(cors());
app.use(html.escape());
app.use(mung.json(html.deescape()));
app.use((req, res, next) => {
  res.locals.acceptLanguage = languageHeaderParser.parse(req.headers['accept-language']);
  res.locals.currentLanguage = res.locals.acceptLanguage[0] ? res.locals.acceptLanguage[0].code : 'en';
  next();
});
app.use('/default-resources', express.static('defaultResources'));
app.use('/profile-pictures', express.static('uploads/profilePictures'));

// start server with OpenAPI spec
oasTools.initialize(oasDoc, app, () => {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.httpStatus || 500).json(err.customErrorMessage || {});
  });

  app.listen(PORT, () => {
    console.log('Server started');
  });
});

module.exports = app;
