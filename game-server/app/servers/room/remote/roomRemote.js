module.exports = function(app) {
  return new Handler(app);
};

const Handler = function(app) {
  this.app = app;
};

Handler.prototype.joinSync = function(uid, cb) {
  const msg = {
    content: "Player " + uid + " has joined."
  };
  cb(msg);
};
