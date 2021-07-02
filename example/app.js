const { createServer } = require("https")

const { Server } = require("@cardsgame/server")
const express = require("express")

const exitHandler = require("./exitHandler")
const { WarGame } = require("./game/room")
const { key, cert } = require("./genCerts")() // Generate certificates if needed

// Prepare Express app
const app = express()
app.use(express.json())
app.use(express.static(__dirname + "/client"))
app.use(express.static(__dirname + "/dist"))

// Prepare HTTPS server
const secureServer = createServer({ key, cert }, app)

// Boot up the game
const gameServer = new Server({
  server: secureServer,
  express: app,
})
gameServer.define("war", WarGame)
gameServer.listen(443)

// Don't leave out any process running after closing terminal
exitHandler(() => {
  gameServer.gracefullyShutdown()
  secureServer.close()
})
