'use strict';

const constants = require('./constants');

class GeneralFailure extends Error {
  constructor(ret, errMsg) {
    super(errMsg);
    this.ret = (undefined === ret || null === ret ? constants.RET_CODE.FAILURE : ret);
    this.errMsg = errMsg;
  }
}

GeneralFailure.prototype.toString = function() {
  const instance = this;
  return JSON.stringify({ret: instance.ret, errMsg: instance.errMsg});
};

exports.GeneralFailure = GeneralFailure;
