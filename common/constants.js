'use-strict';

const IN_DEVELOPMENT = (undefined == process.env.NODE_ENV || null == process.env.NODE_ENV || '' == process.env.NODE_ENV || 'development' == process.env.NODE_ENV);
module.exports.IN_DEVELOPMENT = IN_DEVELOPMENT;

const IN_STAGING = ('staging' == process.env.NODE_ENV);
module.exports.IN_STAGING = IN_STAGING;

const NOT_IN_PRODUCTION = ('production' != process.env.NODE_ENV);
module.exports.NOT_IN_PRODUCTION = NOT_IN_PRODUCTION;

const IN_PRODUCTION = !NOT_IN_PRODUCTION;
module.exports.IN_PRODUCTION = IN_PRODUCTION;

module.exports.LOGGER = {
  CATEGORY: {
    POMELO: 'pomelo',
    CRASH_LOG: 'crash-log',
    SCHEDULER: 'scheduler',
    PLAYERBOT: 'playerbot',
  }
};

module.exports.IS_TESTING = ('true' == process.env.TESTING);

module.exports.PATHS = {
  LOGIN: '/login',
  INT_AUTH_TOKEN: '/intAuthToken',
  ROOM: '/room',
  MASK: '/mask',
  BATTLE: '/battle',
  PLAYER: '/player',
  AVAILABLE: '/available',
  UNAVAILABLE: '/unavailable',

  CENTRALIZED_BATTLE_ID: '/centralizedBattleId',
  DISCONNECTED_DURING_BATTLE_PLAYER: '/disconnectedDuringBattlePlayer',
};

module.exports.NON_POMELO_RPC_PATHS = {
  API_V1: '/v1',
  // TBD
};

module.exports.RET_CODE = {
  OK: 1000,
  FAILURE: 1001,
  ROOM_NOT_FOUND: 1002,
  PLAYER_NOT_FOUND: 1003,
  ROOM_NOT_JOINABLE: 1004,
  PLAYER_NOT_IN_ROOM: 1005,
  PLAYER_ALREADY_IN_ROOM: 1006,
  NO_JOINABLE_ROOM: 1007,
  ROOM_NOT_JOINABLE_WITH_ONGOING_BATTLE: 1008,
  ROOM_NOT_JOINABLE_OVERWHELMED: 1009,

  NO_ONGOING_BATTLE: 1016,
  PLAYER_NOT_IN_BATTLE: 1018,
  CURRENCY_TYPE_MISMATCH: 1019,
  CANNOT_OPERATE_ON_SELF: 1021,

  FRONTEND_SESSION_ALREADY_BOUND: 2002,
  TOKEN_EXPIRED: 2003,
  INCORRECT_CAPTCHA: 2004,

  REDIS_SINGLE_CMD_FAILED: 3001,
  REDIS_TRANSACTION_FAILED: 3002,

  NOT_IMPLEMENTED_YET: 65535,
};

const REDIS_CONST = {
  OK: 'OK',
  MATCH: 'MATCH',
  COUNT: 'COUNT'
};
module.exports.REDIS_CONST = REDIS_CONST;
