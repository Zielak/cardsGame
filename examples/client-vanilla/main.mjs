import { Game, makeChildrenCollection, Room } from "@cardsgame/client"

const EL = {
  gameView: document.querySelector(".gameView"),
  start_btn: document.getElementById("start_btn"),
  addBot_btn: document.getElementById("addBot_btn"),
  variantFields: {
    anteStart: document.getElementsByName("variant_anteStart")[0],
    anteRatio: document.getElementsByName("variant_anteRatio")[0],
  },
  quickJoin_btn: document.getElementById("quickJoin_btn"),
  player: {
    container: document.getElementById("player"),
    clientID: document.querySelector("#player .clientID"),
    playerPlayed: document.querySelector("#player .playerPlayed"),
    pile: document.querySelector("#player .pile"),
    deck: document.querySelector("#player .deck"),
    deckCount: document.querySelector("#player .deck__cardsCount"),
  },
  opponent: {
    container: document.getElementById("opponent"),
    clientID: document.querySelector("#opponent .clientID"),
    playerPlayed: document.querySelector("#opponent .playerPlayed"),
    pile: document.querySelector("#opponent .pile"),
    deck: document.querySelector("#opponent .deck"),
    deckCount: document.querySelector("#opponent .deck__cardsCount"),
  },
  round: document.getElementById("roundText"),
  ante: document.getElementById("anteText"),
  endScreen: document.getElementById("endScreen"),
}

const UI = {
  updateStartButton: (state) => {
    if (state.isGameStarted) {
      EL.start_btn.disabled = true
    } else if (state.clients.length === 2) {
      EL.start_btn.disabled = false
    } else {
      EL.start_btn.disabled = true
    }
  },
  clientJoined: (isPlayer, id) => {
    const key = isPlayer ? "player" : "opponent"
    EL[key].container.classList.remove("playerContainer--disconnected")
    EL[key].clientID.innerHTML = id

    if (isPlayer) {
      EL.quickJoin_btn.disabled = true
      EL.addBot_btn.disabled = false
    }
  },
  clientLeft: (isPlayer) => {
    const which = isPlayer ? "player" : "opponent"
    EL[which].container.classList.add("playerContainer--disconnected")
    EL[which].clientID.innerHTML = ""
  },
  gameStarted: () => {
    console.log("isGameStarted = true")
    EL.addBot_btn.disabled = true
    EL.start_btn.disabled = true

    EL.variantFields.anteStart.disabled = true
    EL.variantFields.anteRatio.disabled = true
  },
  deckCountUpdated: (isPlayer, cardsCount) => {
    EL[isPlayer ? "player" : "opponent"].deckCount.innerHTML = cardsCount
  },
  pileAddedCard: (isPlayer, card) => {
    const elem = document.createElement("div")

    elem.classList.add("card")
    elem.classList.add("card" + card.suit + card.rank)
    if (!card.faceUp) elem.classList.add("card--faceDown")

    elem.innerHTML = `<div class="card__suit">${card.suit}</div><div class="card__rank">${card.rank}</div>`

    elem.style.setProperty("--angle", `${(Math.random() - 0.5) * 10}deg`)

    EL[isPlayer ? "player" : "opponent"].pile.appendChild(elem)
  },
  pileRemovedCard: (isPlayer, card) => {
    const parent = EL[isPlayer ? "player" : "opponent"].pile
    const elem = parent.querySelector(".card" + card.suit + card.rank)

    parent.removeChild(elem)
  },
  playerLost: (isPlayer) => {
    const container = EL[isPlayer ? "player" : "opponent"].container

    container.classList.add("playerContainer--loser")

    setTimeout(() => {
      container.classList.remove("playerContainer--loser")
    }, 1000)
  },
  playersTie: () => {
    EL.gameView.classList.add("playerContainer--tie")

    setTimeout(() => {
      EL.gameView.classList.remove("playerContainer--tie")
    }, 1000)
  },
  updatePlayerPlayed: (isPlayer, value) => {
    EL[isPlayer ? "player" : "opponent"].playerPlayed.innerHTML = value
      ? "played"
      : "THINKING"
  },
  updateGameInfo: (state) => {
    EL.ante.innerHTML = state.ante
    EL.round.innerHTML = state.round
  },
  gameOver: ({ winner }) => {
    EL.endScreen.style.display = "flex"
    EL.endScreen.innerHTML = `<h1>GAME OVER</h1><p>Player ${winner} is the winner!</p>`
  },
}

/**
 * @property {import("@cardsgame/client").Room} room
 * @property {Game} game
 * @property {boolean} joined
 */
class GameHandler {
  /** @type {import("@cardsgame/client").Room} */
  room = undefined

  constructor() {
    this.joined = false
    this.game = new Game({
      wss: {
        port: 3033,
      },
    })

    EL.quickJoin_btn.addEventListener("click", () => {
      this.game.joinOrCreate("war").then((room) => {
        this.joined = true
        this.room = room
        this.roomListeners()
      })
    })
  }

  roomListeners() {
    const { room } = this
    const { state } = room
    const clientID = room.sessionID

    EL.start_btn.addEventListener("click", () => {
      room.send("start", {
        variantData: {
          anteStart: Number(EL.variantFields.anteStart.value),
          anteRatio: Number(EL.variantFields.anteRatio.value),
        },
      })
    })

    EL.addBot_btn.addEventListener("click", () => {
      room.send("bot_add")
    })

    room.onMessage("gameOver", (message) => UI.gameOver(message))
    room.onMessage("battleResult", (message) => {
      if (message.outcome === "tie") {
        UI.playersTie()
      } else {
        UI.playerLost(message.loser === clientID)
      }
    })
    room.onMessage("*", (message) => {
      console.log("Unknown message:", message)
    })

    room.onStateChange = (state) => {
      UI.updateStartButton(state)
      UI.updateGameInfo(state)
    }

    room.state.clients.onAdd = (client, key) => {
      console.log("client added", client, key)

      UI.clientJoined(client === clientID, client)
      UI.updateStartButton(room.state)
    }
    room.state.clients.onRemove = (client, key) => {
      console.log("client removed", client, key)

      UI.clientLeft(client === clientID, client)
      UI.updateStartButton(room.state)
    }

    room.state.childrenContainer.onAdd = (container) => {
      console.log(`Player's container added!`, container)
      const children = makeChildrenCollection(container)
      const deck = children.find((child) => child.type === "deck")
      const pile = children.find((child) => child.type === "pile")

      const isPlayer = container.ownerID === clientID
      const target = isPlayer ? "player" : "opponent"
      EL[target].container.dataset["idxPath"] = container.idx
      EL[target].deck.dataset["idxPath"] = [container.idx, 0].join(",")

      UI.deckCountUpdated(isPlayer, deck.childCount)

      deck.onChange = () => {
        UI.deckCountUpdated(isPlayer, deck.childCount)
      }

      pile.childrenClassicCard.onAdd = (card) => {
        console.log("card added on pile", card.name)
        UI.pileAddedCard(isPlayer, card)
      }
      pile.childrenClassicCard.onRemove = (card) => {
        UI.pileRemovedCard(isPlayer, card)
      }
    }

    room.state.playersPlayed.onChange = (value, key) => {
      const isPlayer = room.state.clients[key] === clientID
      UI.updatePlayerPlayed(isPlayer, value)
    }

    room.state.onChange = (changes) => {
      changes.forEach(({ field, value, previousValue }) => {
        if (field === "round") {
          EL.player.container.classList.remove("playerContainer--loser")
          EL.opponent.container.classList.remove("playerContainer--loser")
        } else if (field === "isGameStarted" && value === true) {
          UI.gameStarted()

          EL.player.deck.addEventListener("click", (event) => {
            const idxPath = event.currentTarget.dataset["idxPath"].split(",")
            console.log(`room.sendInteraction(tap, ${idxPath})`)
            room.sendInteraction("tap", idxPath)
          })
        }
      })
    }
  }

  destroy() {
    this.room = undefined
  }
}

const gameHandler = new GameHandler()
window.game = gameHandler
