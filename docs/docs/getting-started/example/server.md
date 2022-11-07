---
sidebar_position: 2
---

# Server app

You can inspect [contents of `@cardsgame/example-server-ts`](https://github.com/Zielak/cardsGame/tree/development/examples/server-ts) for a fully working example. In this document I'll highlight only the most important bits.

## Install

Prepare your Node.js with basic dependencies.

```
npm i --save express @cardsgame/server @cardsgame/utils @colyseus/core @colyseus/ws-transport
```

- [`@cardsgame/server`](/api/server/) - the core functionalities
- [`@cardsgame/utils`](/api/utils/) - set of utility functions which may come in handy
- `@colyseus/core` and `@colyseus/ws-transport` - peer dependencies from [Colyseus](https://docs.colyseus.io/colyseus/)

For `devDependencies` we also include:

```
npm i --save-dev @cardsgame/types @cardsgame/example-certs
```

- `@cardsgame/types` - if you're building in TypeScript (which I highly recommend!). Contains types for message objects, some utility types etc.
- `@cardsgame/example-certs` - creates self-signed SSL certificate for testing on your local machine. Don't use these certificates outside! You can still create your own though.

:::note

`@cardsgame/server` is powered by Colyseus, [check their documentation](https://docs.colyseus.io/colyseus/server/api/) for more details around Match-making, Presence and many more.

:::

### Entry point

In this tutorial let's focus on setting up the game on your local machine. Some steps may differ when you decide to deploy it externally, but that is outside the scope of this document.

```ts title="/src/app.ts"
import { createServer } from "https"

import certs from "@cardsgame/example-certs"
import { Server } from "@colyseus/core"
import { WebSocketTransport } from "@colyseus/ws-transport"
import express from "express"

import { exitHandler } from "./exitHandler"
import { WarGame } from "./game/room"

// Grab self-signed certificates.
const { key, cert } = certs()

// Prepare Express app
const app = express()
app.use(express.json())

// Prepare HTTPS server
const secureServer = createServer({ key, cert }, app)

// Boot up the game
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: secureServer,
  }),
})
gameServer.define("war", WarGame)
gameServer.listen(443)

// Don't leave out any process running after closing terminal
exitHandler(() => {
  gameServer.gracefullyShutdown()
  secureServer.close()
})
```

**Exit handler** is there to kill every related process during development, either on crash or on force kill (`CTRL` + `C`). Check its implementation in the repo: [/examples/server-js/exitHandler.js](https://github.com/Zielak/cardsGame/blob/development/examples/server-ts/src/exitHandler.ts)

Let's focus on `gameServer`:

```ts
import { Server, WebSocketTransport } from "@cardsgame/server"
import { WarGame } from "./game/room"
// ...
// Boot up the game
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: secureServer,
  }),
})
gameServer.define("war", WarGame)
gameServer.listen(443)
```

We're creating the game server, setting up WebSocket connection, binding it to port 443 and **defining** new type of game room called `"war"`. This is the name players will use to join this game.

:::tip

You can define **multiple game rooms** on one game server:

```ts
gameServer.define("war", WarGame)
gameServer.define("poker", PokerGame)
gameServer.define("test", TestGame)
```

:::

## Game room
