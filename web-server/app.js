const baseAbsPath = __dirname + '/';
const express = require('express');
const app = express();

const loggerProvider = require(baseAbsPath + '../game-server/node_modules/log4js');
loggerProvider.configure({
  appenders: {
    stdout: {
      type: 'stdout',
    },
  },
  categories: {
    default: {
      appenders: ['stdout'],
      level: 'debug' // Accepts any log from the appenders at or above 'debug' level. 
    },
  }
});

const logger = loggerProvider.getLogger();

// Body parser middleware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', baseAbsPath + './pugs');
app.use('/', express.static(baseAbsPath + './public'));

logger.debug("Web server has started.\nPlease log on http://127.0.0.1:3001/index.html");
app.listen(3001);
