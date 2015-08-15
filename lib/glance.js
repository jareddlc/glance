var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var github = require('./github');
var http = require('http');
var log = require('./logger')();
var path = require('path');
var routes = require('../routes');

var glance = module.exports = {};

glance.init = function init(callback) {

  glance.app = express();
  // view engine setup
  glance.app.set('views', path.join(__dirname, '../site/views'));
  glance.app.set('view engine', 'html');
  glance.app.engine('html', require('hbs').__express);

  glance.app.use(favicon(path.join(__dirname, '../site/static/img/favicon.ico')));
  glance.app.use(bodyParser.json());
  glance.app.use(bodyParser.urlencoded({extended: true}));
  glance.app.use(cookieParser());
  glance.app.use(express.static(path.join(__dirname, '../site/static/')));

  // set express port
  glance.app.set('port', process.env.PORT || 3000);

  // error handlers
  glance.app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  // express routes
  glance.app.use('/', routes);

  // init modules
  async.waterfall([
    function(callback) {
      github.init(callback);
    }
  ], function(err) {
    if(err) {
      log.error({err: err}, 'Error - Glance: init');
      callback(new Error({err: err}, 'Error: Starting Glance'));
    }
    else {
      log.info('Glance: Initialized');
      callback(null);
    }
  });
};

glance.start = function start(callback) {
  // load modules
  async.waterfall([
    function(callback) {
      github.start(callback);
    },
    function(callback) {
      http.createServer(glance.app).listen(glance.app.get('port'), callback);
    },
    function(callback) {
      log.info({port: glance.app.get('port')}, 'Glance: Express server listening on port '+glance.app.get('port'));
    }
  ], function(err) {
    if(err) {
      log.error({err: err}, 'Error - Glance: start');
    }
  });
};

glance.stop = function stop(callback) {
  callback(null);
};
