import { createServer } from "https"

import certs from "@cardsgame/example-certs"
import { Server } from "@colyseus/core"
import { WebSocketTransport } from "@colyseus/ws-transport"
import express from "express"

import { exitHandler } from "./exitHandler"
import WarGame from "./game/room"

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
