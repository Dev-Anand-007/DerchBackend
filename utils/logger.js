const debug = require('debug');

module.exports = {
  server: debug('development:server'),
  db: debug('development:db'),
  routes: debug('development:routes'),
};

// A logger is a tool that records information about how your application is running (events, errors, performance). Instead of using console.log, a logger gives structured, configurable, and controlled logging.