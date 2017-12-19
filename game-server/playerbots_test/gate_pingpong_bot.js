const baseAbsPath = __dirname + '/';

const commonFuncs = require(baseAbsPath + './common_funcs');
const args = commonFuncs.extractCliArgsAndMatchExpectedCount(0, []);

const pomelo = require(baseAbsPath + './pomeloclient').pomelo;

const logger = commonFuncs.logger;

let selfPlayer = {};
let allPlayers = {};

commonFuncs.initPomeloClient(pomelo, allPlayers, selfPlayer);

const gateHost = commonFuncs.botConfig.gameServerHost;
const gatePort = 3014;

new Promise(function(resolve, reject) {
  pomelo.init({
    host: gateHost,
    port: gatePort,
    log: true
  }, function() {
    // Intentionally left blank to keep the connection for pingpong test.
  });
})
  .catch(function(err) {
    logger.error(err.stack);
  });
