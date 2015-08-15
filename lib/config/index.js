var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var config = {};
// global config
config.appName = 'glance';

// logger config
config.logger = {};
config.logger.name = config.appName;
config.logger.streams = [
  {
    level: process.env.LOG_LEVEL || 'info',
    type: 'raw',
    stream: prettyStdOut
  },
  {
    type: 'file',
    level: process.env.LOG_LEVEL || 'info',
    path: config.appName+'.log',
  }
];
config.logger.serializers = bunyan.stdSerializers;
config.logger.src = false;

// github config
config.github = {};
config.github.cron = process.env.GITHUB_CRON || '0 */15 * * * *';
config.github.auth = {
  token: process.env.GITHUB_AUTH_TOKEN || '',
  type: process.env.GITHUB_AUTH_TYPE || 'oauth',
};
if(process.env.GITHUB_AUTH_USERNAME && process.env.GITHUB_AUTH_PASSWORD) {
  config.github.auth = {
    type: process.env.GITHUB_AUTH_TYPE || 'basic',
    username: process.env.GITHUB_AUTH_USERNAME || null,
    password: process.env.GITHUB_AUTH_PASSWORD || null
  };
}
config.github.org = {
  name: process.env.GITHUB_ORG_NAME || ''
};
config.github.user = {
  name: process.env.GITHUB_USER_NAME
};

module.exports = config;
