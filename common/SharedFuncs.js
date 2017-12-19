const md5 = require('crypto-js/md5');
const sha1 = require('crypto-js/sha1');
const hmacSha1 = require('crypto-js/hmac-sha1');
const moment = require('moment');

class SharedFuncs {

  static isEmpty(obj) {
    if (undefined === obj || null === obj) return true;
    if (typeof obj == "boolean") {
      return false; 
    }
    if (typeof obj == "number") {
      return false; 
    }
    if (typeof obj == "string") {
      return "" == obj;
    }
    return 0 == Object.keys(obj).length;
  }

  static md5Sign(seed) {
    return md5(seed.toString()).toString();
  }

  static sha1Sign(seed) {
    return sha1(seed.toString()).toString();
  }

  static hmacSha1Sign(seed, key) {
    return hmacSha1(seed.toString(), key.toString()).toString();  
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static guid() {
    const s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  static shortCode(nsegs) {
    const s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    let nsegsInt = parseInt(nsegs);
    let effectiveNsegs = ((isNaN(nsegsInt) || 1 >= nsegsInt) ? 1 : nsegsInt);
    let ret = "";
    while (effectiveNsegs--) {
      ret += s4();
    }
    return ret;
  }

  // NOTE: Time utils begins.
  static startOfCurrentWeekMillis() {
    return 1000 * moment().startOf('week').unix();
  }

  static currentSecs() {
    const currentMomentObj = moment();
    return currentMomentObj.unix();
  }

  static currentMillis() {
    const currentMomentObj = moment();
    return 1000 * currentMomentObj.unix() + currentMomentObj.milliseconds();
  }

  static currentMomentObj() {
    return moment();
  }

  static gmtSecsFromNow(nDays) {
    return moment().add(nDays, 'days').unix();
  }

  static gmtMillisFromNow(nDays) {
    const targetMomentObj = moment().add(nDays, 'days');
    return 1000*targetMomentObj.unix() + targetMomentObj.milliseconds();
  }

  static ymdHisByDaysFromNow(nDays) {
    const targetMomentObj = moment().add(nDays, 'days');
    return targetMomentObj.format('YYYY-MM-DD HH:mm:ss').toString();
  }

  static gmtMiilisecToLocalYmdhis(millis) {
    return moment(millis).format("YYYY-MM-DD HH:mm:ss");
  }

  static gmtMiilisecToLocalYmdhi(millis) {
    return moment(millis).format("YYYY-MM-DD HH:mm");
  }

  static gmtMiilisecToLocalYmd(millis) {
    return moment(millis).format("YYYY-MM-DD");
  }

  // NOTE: Time utils ends.

  static strReplaceInOrder(str, args) {
    return str.replace(/{(\d+)}/g, function (match, number) {
      return (undefined !== args[number])
        ? args[number]
        : match
        ;   
    }); 
  }
}

module.exports = SharedFuncs;
