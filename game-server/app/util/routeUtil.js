const dispatcher = require('./dispatcher');

module.exports.room = function(session /* Pomelo.FrontendSession */, msg, app, cb) {
    const roomServers = app.getServersByType('room');

    if(!roomServers || 0 == roomServers.length) {
        cb(new Error('can not find room servers.'));
        return;
    }

    const uid = session.uid;
    const roomServer = dispatcher.dispatch(uid, roomServers);

    cb(null, roomServer.id);
};
