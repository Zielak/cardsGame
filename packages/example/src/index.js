const { Game, Room } = require("@cardsgame/client")

const EL = {
  start_btn: document.getElementById("start_btn"),
  player: {
    container: document.getElementById("player"),
    clientID: document.querySelector("#player .clientID"),
    pile: document.querySelector("#player .pile"),
    deck: document.querySelector("#player .deck"),
    deckCount: document.querySelector("#player .deck__cardsCount")
  },
  opponent: {
    container: document.getElementById("opponent"),
    clientID: document.querySelector("#opponent .clientID"),
    pile: document.querySelector("#opponent .pile"),
    deck: document.querySelector("#opponent .deck"),
    deckCount: document.querySelector("#opponent .deck__cardsCount")
  }
}

const UI = {
  clientJoined: (isPlayer, id) => {
    EL[isPlayer ? "player" : "opponent"].container.classList.remove(
      "playerContainer--disconnected"
    )
    EL[isPlayer ? "player" : "opponent"].clientID.innerHTML = id
  },
  clientLeft: isPlayer => {
    EL[isPlayer ? "player" : "opponent"].container.classList.add(
      "playerContainer--disconnected"
    )
    EL[isPlayer ? "player" : "opponent"].clientID.innerHTML = ""
  }
}

/**
 * @property {Room} room
 * @property {Game} game
 */
class GameHandler {
  constructor() {
    this.game = new Game({
      wss: {
        port: 443
      }
    })

    this.game.joinOrCreate("war").then(room => {
      this.room = room
      this.start()
    })
  }

  start() {
    // We're connected to the server
    // and we're inside a game room!

    EL.start_btn.addEventListener("click", () => {
      this.game.send({ data: "start" })
    })

    this.roomListeners()
  }

  roomListeners() {
    const { room } = this

    room.state.clients.onAdd = (client, key) => {
      console.log("client added", client, key)

      UI.clientJoined(client === room.sessionID, client)
    }
    room.state.clients.onRemove = (client, key) => {
      console.log("client removed", client, key)

      UI.clientJoined(client === room.sessionID, client)
    }
  }
}

const gameHandler = new GameHandler()
