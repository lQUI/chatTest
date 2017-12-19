const baseAbsPath = __dirname + '/';

const SharedFuncs = require('../../common/SharedFuncs');
const constants = require('../../common/constants');

const yaml = require('js-yaml');
const fs = require('fs');

const util = require('util');

const loggerProvider = require(baseAbsPath + '../node_modules/log4js');
loggerProvider.configure({
  appenders: {
    stdout: {
      type: 'stdout',
    },
    playerbot: {
      type: 'file',
      filename: baseAbsPath + '../logs/playerbot.log',
      maxLogSize: 10485760,
      pattern: '.yyyy-MM-dd',
      backups: 10,
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ['stdout', 'playerbot'],
      level: 'debug' // Accepts any log from the appenders at or above 'debug' level. 
    },
  }
});


const logger = loggerProvider.getLogger();
module.exports.logger = logger;

let botConfig = null;
try {
  botConfig = yaml.safeLoad(fs.readFileSync(baseAbsPath + '../config/playerbot.yml', 'utf8'));
  logger.debug('botConfig is ');
  logger.debug(util.inspect(botConfig, {
    depth: null,
    colors: true
  }));
} catch (e) {
  logger.debug(e.stack);
}
module.exports.botConfig = botConfig;

module.exports.extractCliArgsAndMatchExpectedCount = function(count, argNameList) {
  const args = process.argv.slice(2);
  if (count != args.length) {
    let usageHint = 'Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' ';
    for (let k in argNameList) {
      usageHint += (argNameList[k] + ' ');
    }
    logger.debug(usageHint);
    process.exit(-1);
  }
  return args;
};

module.exports.initPomeloClient = function(pomelo, pAllPlayers /* a reference not used yet */ , pSelfPlayer /* a reference not used yet */ ) {
  //handle disconnect message, occours when the client is disconnect with servers
  pomelo.removeAllListeners('disconnect');
  pomelo.on('disconnect', function(reason) {
    logger.debug('Has disconnected.');
  });
};
