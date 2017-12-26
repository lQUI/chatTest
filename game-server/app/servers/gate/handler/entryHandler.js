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
  if (session.uid == null) {
    const instance = this;
    const onSessionBound = function(err) {
      const cb = function(msg) {
        next(null, msg);
      };
      instance.app.rpc.room.roomRemote.joinSync(session, session.uid, cb);
    };
    const uid = generatePlayerId();
    session.uid = uid;
    session.bind(uid, onSessionBound);
  }
};

Handler.prototype.send = function(data, session, next) {
  var uid = session.uid;
  console.log(uid);
  var code = 1001;
  this.chatService.pushMsgByChannel(data, uid, function(err, res) {
    console.log('the send msg error', err, res);
    if (!err)
      code = 1000;
    next(null, code);
  });
};

Handler.prototype.add = function(msg, session, next) {
  console.log('session is ', session);
  session.username = msg.userName;
  var result = this.chatService.add(session.uid, session.frontendId, msg.userName, msg.roomName);
  next(null, result);
}

Handler.prototype.leave = function(msg, session, next) {
  console.log(session.uid, 'leave');
  var retCode = this.chatService.leave(session.uid, msg.roomName);
  next(null, retCode);
}

const generatePlayerId = function() {
  const playerId = Math.ceil(Math.random() * 1000);
  return playerId;
}
