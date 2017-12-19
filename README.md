# Base Directory

You're reading `<proj-root>/README.md`.

# Operating System

This project is assumed to be running on Ubuntu14.04 or CentOS7.

# Installing NodeJs

The recommended practice is to first install [nvm by script](https://nodejs.org/en/download/package-manager/#nvm), and then use for example `nvm install 8` to install NodeJs version 8.


# Initialization
## Download Dependencies
```
user@proj-root> sh npm-install.sh
```

## Create Config Files for Game-server

Invoke

```
user@proj-root> sh init-game-server-configs.sh 
```

and follow the hint to fill in arguments.

## Necessary Config Files to Customize
```
user@proj-root> vim game-server/config/nonPomeloRpc.iml 
```

# Testing & Development Mode and Foreground
```
user@proj-root> ./start-game-server [test | development] 
user@proj-root> ./start-web-server [test | development]   
```

To stop just emit `ctrl-c` to the foreground shell sessions.
 

# Production Mode and Background
To start.
```
user@proj-root> ./start-game-server production 
user@proj-root> ./start-web-server production   
```

To stop.
```
user@proj-root> ./stop-game-server 
user@proj-root> ./stop-web-server 
```


# Testing with Playerbots
Please note that there're existing scripts for automated testing located at `<proj-root>/game-server/playerbots_test/*` whose designed purposes were mostly self-explanatory from the names.


# Auto-reconnection of Client
It's strongly recommended that implicit auto-reconnection of client, e.g. [that of sio client](https://socket.io/docs/client-api/), is turned off.

Some explicit reconnection examples using an sio-client whose implicit auto-reconnection is turned off by `<proj-root>/game-server/playerbots_test/pomeloclient.js` are given under `<proj-root>/game-server/playerbots_test/` . 
