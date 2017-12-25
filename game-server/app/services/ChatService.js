var ChatService = function(app) {
  this.app = app;
  this.roomMap = {};
};

/**
 * Add player into the channel
 *
 * @param {String} uid         user id
 * @param {String} playerName  player's role name
 * @param {String} channelName channel name
 * @return {Number} see code.js
 */
ChatService.prototype.add = function(uid, sid, channelName) {
  console.log('sid is', sid);
  var channel = this.app.get('channelService').getChannel(channelName, true);
  if (!channel) {
    return 1003
  }
  //add uid,channelName to roomMap
  this.roomMap[uid] = channelName;
  channel.add(uid, sid);

  return 1000;
};


ChatService.prototype.leave = function(uid, playerName, channelName) {};

ChatService.prototype.pushMsgByChannel = function(msg, uid, cb) {
  var channel = this.app.get('channelService').getChannel(this.roomMap[uid], false);
  console.log('uid is ', uid);
  console.log('channel is', channel);
  if (!channel) {
    throw new Error();
  }
  try {
    channel.pushMessage('onChat', msg, cb);

  } catch (err) {
    console.log(err);
  }
}

/**
 * Get the connector server id assosiated with the uid
 */
var getSidByUid = function(uid, app) {
  var index = Number(uid) % 3;
  return index;
};

module.exports = ChatService;
