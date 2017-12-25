module.exports = function(app) {
  return new Handler(app, app.get('chatService'));
};

var Handler = function(app, chatService) {
  this.app = app;
  this.chatService = chatService;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
  console.log(msg);
  const instance = this;
  const onSessionBound = function(err) {
    const cb = function(msg) {
      next(null, msg);
    };
    instance.app.rpc.room.roomRemote.joinSync(session, session.uid, cb);
  };
  const uid = "aaaaaaaaa"; // Hardcoded temporarily for demonstration only.
  session.uid = uid;
  session.bind(uid, onSessionBound);
};

Handler.prototype.send = function(msg, session, next) {
  var uid = session.uid;
  console.log(uid);
  var code = 1000;
  this.chatService.pushMsgByChannel(msg, uid, function(err, res) {
    console.log('the send msg error', err, res);
    if (!err)
      code = 1001;
    next(null, code);
  });
};

Handler.prototype.add = function(msg, session, next) {
  console.log('session is ', session);
  var retCode = this.chatService.add(session.uid, session.frontendId, msg.rid);
  next(null, retCode);
}

Handler.prototype.leave = function(msg, session, next) {
  var retCode = this.chatService.leave(uid, playerName, roomName);
  next(null, retCode);
}

const generatePlayerId = function() {
  const playerId = Math.ceil(Math.random() * 1000);
  return playerId;
}
