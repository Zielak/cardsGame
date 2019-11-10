const { Game, Room } = require("@cardsgame/client")

const EL = {
  start_btn: document.getElementById("start_btn"),
  quickJoin_btn: document.getElementById("quickJoin_btn"),
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
  updateStartButton: state => {
    if (state.isGameStarted) {
      EL.start_btn.disabled = true
    } else if (Object.keys(state.clients).length === 2) {
      EL.start_btn.disabled = false
    } else {
      EL.start_btn.disabled = true
    }
  },
  clientJoined: (isPlayer, id) => {
    EL[isPlayer ? "player" : "opponent"].container.classList.remove(
      "playerContainer--disconnected"
    )
    EL[isPlayer ? "player" : "opponent"].clientID.innerHTML = id
  },
  clientLeft: isPlayer => {
    const which = isPlayer ? "player" : "opponent"
    EL[which].container.classList.add("playerContainer--disconnected")
    EL[which].clientID.innerHTML = ""
  },
  deckCountUpdated: (isPlayer, cardsCount) => {
    EL[isPlayer ? "player" : "opponent"].deckCount.innerHTML = cardsCount
  },
  pileAddedeCard: (isPlayer, card) => {
    const elem = document.createElement("div")

    elem.innerHTML = `<div class="card__suit">${card.suit}</div><div class="card__rank">${card.rank}</div>`
    elem.classList.add("card")
    if (!card.faceUp) em.classList.add("card--faceDown")
    elem.style.setProperty("--angle", `${Math.random()}deg`)

    EL[isPlayer ? "player" : "opponent"].pile.appendChild(elem)
  },
  pileCleared: isPlayer => {
    EL[isPlayer ? "player" : "opponent"].pile.innerHTM = ""
  },
  playerLost: isPlayer => {
    EL[isPlayer ? "player" : "opponent"].container.classList.add(
      "playerContainer--loser"
    )
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

    EL.quickJoin_btn.addEventListener("click", () => {
      this.game.joinOrCreate("war").then(room => {
        this.room = room
        this.roomListeners()
      })
    })
  }

  roomListeners() {
    const { room } = this

    EL.start_btn.addEventListener("click", () => {
      room.send({ data: "start" })
    })

    EL.player.deck.addEventListener("click", event => {
      const idxPath = event.currentTarget.dataset["idxPath"]
      console.log("room.sendInteraction(", event, idxPath, ")")
      room.sendInteraction(event, idxPath)
    })

    room.onMessage = message => {
      console.log("MSG:", message.type, message.data)
    }

    room.onStateChange = state => {
      UI.updateStartButton(state)
    }

    room.state.clients.onAdd = (client, key) => {
      console.log("client added", client, key)

      UI.clientJoined(client === room.sessionID, client)
      UI.updateStartButton(room.state)
    }
    room.state.clients.onRemove = (client, key) => {
      console.log("client removed", client, key)

      UI.clientLeft(client === room.sessionID, client)
      UI.updateStartButton(room.state)
    }

    room.state.childrenContainer.onAdd = container => {
      console.log(`Player's container added!`, container)
      const deck = container.childrenDeck[0]
      const pile = container.childrenPile[0]

      const isPlayer = container.ownerID === room.sessionID
      const target = isPlayer ? "player" : "opponent"
      EL[target].container.dataset["idxPath"] = container.idx
      EL[target].deck.dataset["idxPath"] = [container.idx, 0].join(",")

      UI.deckCountUpdated(isPlayer, deck.childCount)

      deck.onChange = () => {
        UI.deckCountUpdated(isPlayer, deck.childCount)
      }

      pile.childrenClassicCard.onAdd = card => {
        UI.pileAddedeCard(isPlayer, card)
      }
    }

    room.state.onChange = changes => {
      changes.forEach(({ field, value, previousValue }) => {
        if (field === "round") {
          EL.player.container.classList.remove("playerContainer--loser")
          EL.opponent.container.classList.remove("playerContainer--loser")
        }
      })
    }
  }

  destroy() {
    this.room = undefined
  }
}

const gameHandler = new GameHandler()
