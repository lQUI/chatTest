module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
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
  const instance = this;
  const onSessionBound = function(err) {
    const cb = function(msg) {
      next(null, msg);
    };
    instance.app.rpc.room.roomRemote.joinSync(session, session.uid, cb); 
  };
  const uid = "aaaaaaaaa"; // Hardcoded temporarily for demonstration only.
  session.bind(uid, onSessionBound);
};
