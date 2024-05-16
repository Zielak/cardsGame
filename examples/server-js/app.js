const { createServer } = require("https")

const { key, cert } = require("@cardsgame/example-certs")() // Generate certificates if needed
const { Server } = require("@colyseus/core")
const { WebSocketTransport } = require("@colyseus/ws-transport")
const express = require("express")

const exitHandler = require("./exitHandler")
const { WarGame } = require("./game/room")

// Prepare Express app
const app = express()
app.use(express.json())
app.listen(8448)

// Prepare HTTPS server
const secureServer = createServer({ key, cert }, app)

// Boot up the game
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: secureServer,
  }),
})
gameServer.define("war", WarGame)
gameServer.listen(3033, "0.0.0.0")

// Don't leave out any process running after closing terminal
exitHandler(() => {
  gameServer.gracefullyShutdown()
  secureServer.close()
})
