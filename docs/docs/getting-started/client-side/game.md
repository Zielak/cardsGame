---
sidebar_position: 1
---

# Game

```ts
const game = new Game({
  wss: {
    port: 443,
  },
})

game.joinOrCreate("myGameRoom").then((room) => {
  joined = true
  roomListeners(room)
})
```

## Properties

### `sessionID: string`

If connected to game room, will return its session ID
