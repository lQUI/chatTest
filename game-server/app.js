const baseAbsPath = __dirname + '/';
const routeUtil = require(baseAbsPath + './app/util/routeUtil');
const constants = require(baseAbsPath + '../common/constants');
const pomelo = require('pomelo');
const util = require('util');

/**
 * Init app for client.
 */
const app = pomelo.createApp();

/**
 * This is a workaround for [a known issue of 'pomelo-logger'](https://github.com/NetEase/pomelo-logger/issues/1).
 */
const loggerProvider = require('pomelo-logger');
loggerProvider.configure(baseAbsPath + './config/log4js.json', {
  serverId: app.getServerId(),
  base: app.getBase()
});
const logger = loggerProvider.getLogger(constants.LOGGER.CATEGORY.POMELO, __filename);

app.set('name', 'single-pomelo-backend-server');

/*

The sio connector will deem client as "timed out to close" if no new "client -(pong)->server" is received after NO LONGER THAN (heartbeatIntervalMillis + heartbeatTimeoutMillis) since the last "client -(pong)->server". Reference "https://socket.io/docs/server-api/".

Meaning of these fields are as follows.
- The client side sdk will receive fields "pingInterval = heartbeatIntervalMillis" and "pingTimeout = heartbeatTimeoutMillis" for session negotiation upon connection established. 
- The client side will send a "ping" every "pingInterval" milliseconds to the server, and expect a "pong" within "pingTimeout" milliseconds till it deems that the server is unavailable.

*/
const heartbeatIntervalMillis = 10000;
const heartbeatTimeoutMillis = 10000;
const closeTimeoutMillis = 10000;

// app configure
// Don't add space into 'production|development'!
app.configure('production|development', function() {
  // route configures
  app.route('room', routeUtil.room);

  // Reference "https://github.com/NetEase/pomelo/blob/master/template/game-server/app.js.sio".
  app.set('connectorConfig', {
    connector: pomelo.connectors.sioconnector,
    transports: ['polling', 'websocket'], // 'websocket', 'polling-xhr', 'polling-jsonp', 'polling'
    heartbeats: true,
    closeTimeout: closeTimeoutMillis,
    heartbeatTimeout: heartbeatTimeoutMillis,
    heartbeatInterval: heartbeatIntervalMillis,
  });
  // filter configures
  app.filter(pomelo.timeout());
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  logger.error(util.format('Uncaught exception: %s.', err.stack), err);
});
