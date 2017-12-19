# Case 1

## Starting game-server in TESTING mode
```
proj-root> ./start-game-server test
```

## Starting a pingpong check.
```
proj-root> ./game-server/playerbots_test/start_gate_pingpong_bot test
```

## Starting a daemonized pingpong check.
```
proj-root> ./game-server/playerbots_test/start_gate_pingpong_bot test --daemon 
```

## Viewing the log of daemonized playerbots.
```
proj-root> tail -f ./game-server/logs/playerbot.log 
```

## Stopping any daemonized pingpong check.
proj-root> ./game-server/playerbots_test/stop_gate_pingpong_bot 
