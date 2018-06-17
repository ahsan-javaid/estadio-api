'use strict';
var express = require('express');
var kraken = require('kraken-js');
var path = require('path');
var bodyParser = require('body-parser');


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
  onconfig: function (config, next) {
    /*
     * Add any additional config setup or overrides here. `config` is an initialized
     * `confit` (https://github.com/krakenjs/confit/) configuration object.
     */

    next(null, config);
  }
};

app = module.exports = express();

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use('/files', express.static('files'));

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }'
} ));


app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: false}));


global.log = require('./app/lib/logger');
global.appRoot = path.resolve(__dirname);

app.use(kraken(options));
global.models = require('./app/models/index');
global.mailer = require('./app/lib/mailer')();

app.on('start', function () {
  global.kraken = app.kraken;
  global.log.info('Application ready to serve requests.');
  global.log.info('Environment: %s', app.kraken.get('env:env'));
});
