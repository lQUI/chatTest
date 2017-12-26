var ChatService = function(app) {
  this.app = app;
  this.roomMap = {};
};

/**
 * Add player into the channel
 *
 * @param {String} uid         user id
 * @param {String} sid         session id
 * @param {String} playerName  player's role name
 * @param {String} channelName channel name
 * @return {Number} see code.js
 */
ChatService.prototype.add = function(uid, sid, userName, channelName) {
  console.log('sid is', sid);
  var channel = this.app.get('channelService').getChannel(channelName, true);
  if (!channel) {
    return 1003
  }
  if (channel.state == 'start') {
    var result = {
      retCode: 1001
    };
    return result;
  }
  //add uid,channelName to roomMap
  this.roomMap[uid] = {
    channelName: channelName,
    userName: userName
  };
  channel.add(uid, sid);
  var result = {
    userName: userName,
    numUsers: channel.userAmount,
    retCode: 1000
  }
  channel.pushMessage('user joined', result, function(err) {
    console.log(err);
  });
  if (channel.userAmount == 2) {
    channel.pushMessage('ready', 'The game will start soon!', function(err) {
      setTimeout(function() {
        channel.pushMessage('start', 'The game start!');
        channel.state = 'start';
      }, 5000);
      setTimeout(function() {
        channel.pushMessage('end', 'The game end!');
        channel.state = null;
      }, 30000);
    });
  }
  return result;
};

ChatService.prototype.leave = function(uid, sid, channelName) {
  var channel = this.app.get('channelService').getChannel(this.roomMap[uid].channelName, false);
  if (!channel) {
    throw new Error();
  }
  channel.leve(uid, sid);
  if (channel.getMembers.length == 0) {
    console.log(this.roomMap[uid].channelName, ' is destory');
    channel.destory();
  }
  msg = {
    userName: this.roomMap[uid].userName || 'none',
  }
  channel.pushMessage('onLeave', msg, cb);
};

ChatService.prototype.pushMsgByChannel = function(data, uid, cb) {
  var channel = this.app.get('channelService').getChannel(this.roomMap[uid].channelName, false);
  console.log('uid is ', uid);
  console.log('channel is', channel);

  if (!channel) {
    throw new Error();
  }
  msg = {
    userName: this.roomMap[uid].userName || 'none',
    message: data
  }
  channel.pushMessage('onChat', msg, cb);
}

/**
 * Get the connector server id assosiated with the uid
 */
var getSidByUid = function(uid, app) {
  var index = Number(uid) % 3;
  return index;
};

module.exports = ChatService;
