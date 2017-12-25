module.exports = function(app) {
  return new ChatRemote(app, app.get('chatService'));
};

var ChatRemote = function(app, chatService) {
  this.app = app;
  this.chatService = chatService;
};

ChatRemote.prototype.send = function(msg, next) {
  var uid = session.uid;
  var code = 1001;
  this.chatService.pushMsgByChannel(msg, uid, function(err) {
    code = 1000;
  });
  next(null, code);
};

ChatRemote.prototype.add = function(playerName, roomName, next) {
  var uid = generatePlayerId();
  var retCode = this.chatService.add(uid, playerName, roomName);
  next(null, retCode);
}

ChatRemote.prototype.leave = function(playerName, roomName, next) {
  var uid = generatePlayerId();
  var retCode = this.chatService.leave(uid, playerName, roomName);
  next(null, retCode);
}

const generatePlayerId = function() {
  const playerId = Math.ceil(Math.random() * 1000);
  return playerId;
}
