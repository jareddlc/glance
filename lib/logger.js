var bunyan = require('bunyan');
var config = require('./config');

module.exports = function() {
  return bunyan.createLogger(config.logger);
};
