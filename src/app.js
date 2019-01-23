const express = require("express");
const app = express();
const favicon = require('express-favicon');

const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

appConfig.init(app, express);
app.use(favicon(__dirname + '/public/favicon.ico'));

routeConfig.init(app);

module.exports = app;