import { Game, Room } from "@cardsgame/client"
import { get } from "svelte/store"

import {
  ante,
  battleOutcome,
  clientJoined,
  clients,
  gameOver,
  gameStarted,
  players,
  round,
  sessionID,
  winner,
} from "./stores"

export class GameHandler {
  game = new Game({
    wss: {
      port: 3033,
    },
  })
  room: Room<WarState, WarMessageTypes>

  quickJoin() {
    this.game.joinOrCreate("war").then((room: Room<WarState>) => {
      clientJoined.set(true)
      sessionID.set(room.sessionID)

      this.room = room
      this.messageListeners()
      this.stateDataListeners()
      this.containerListeners()
    })
  }

  messageListeners() {
    const { room } = this
    let outcomeTimer

    room.onMessage("battleResult", ({ data }) => {
      console.log("BATTLE RESULT", { ...data })
      if (data.outcome === "tie") {
        battleOutcome.set("tie")
      } else {
        battleOutcome.set(data.winner)
      }

      if (outcomeTimer) clearTimeout(outcomeTimer)
      outcomeTimer = setTimeout(() => battleOutcome.set(""), 1000)
    })

    room.onMessage("gameOver", ({ data }) => {
      winner.set(data.winner)
    })

    room.onMessage("*", (message) => {
      console.log("Unknown message:", message)
    })
  }

  stateDataListeners() {
    const { room } = this

    room.state.clients.onAdd = (client, key) => {
      console.log("client added", client, key)

      clients.update((value) => {
        value.push(client)
        return value
      })
    }
    room.state.clients.onRemove = (client, key) => {
      console.log("client removed", client, key)

      clients.update((value) => {
        return value.filter((entry) => entry !== client)
      })
    }
    room.state.playersPlayed.onChange = (played, key) => {
      players.update(($players) => {
        const player = $players.get(key)
        player.played = played

        return $players
      })
    }
    room.state.listen("round", (value) => {
      round.set(value)
    })
    room.state.listen("isGameStarted", (value) => {
      if (value) {
        this.handleGameStarted()
      }
      gameStarted.set(value)
    })
    room.state.listen("isGameOver", (value) => {
      gameOver.set(value)
    })
    room.state.listen("ante", (value) => {
      ante.set(value)
    })
  }

  containerListeners() {
    const { room } = this

    room.state.childrenContainer.onAdd = (container) => {
      console.log(`Player's container added!`, container)
      const deck = container.childrenDeck[0]
      const pile = container.childrenPile[0]

      const { ownerID } = container

      players.update(($players) => {
        const player = $players.get(ownerID)
        player.idx = container.idx
        player.deckCount = deck.childCount

        return $players
      })

      deck.onChange = () => {
        players.update(($players) => {
          const player = $players.get(ownerID)
          player.deckCount = deck.childCount

          return $players
        })
      }

      pile.childrenClassicCard.onAdd = (card, key) => {
        console.log(pile.name, "added card", card.suit, card.rank)
        players.update(($players) => {
          const player = $players.get(ownerID)
          player.pile.set(key, card)

          return $players
        })
        card.onChange = (changes) => {
          changes.forEach((change) => {
            console.log(
              "Card updated post-creation:",
              change.field,
              change.value,
            )
            players.update(($players) => {
              const player = $players.get(ownerID)
              const cardSaved = player.pile.get(key)
              cardSaved[change.field] = change.value

              return $players
            })
          })
        }
      }
      pile.childrenClassicCard.onRemove = (card, key) => {
        console.log(pile.name, "removed card", card.suit, card.rank)
        players.update(($players) => {
          const player = $players.get(ownerID)
          player.pile.delete(key)

          return $players
        })
      }
    }
  }

  handleGameStarted() {
    console.log("game starting, setting up players")

    players.update(($players) => {
      get(clients).forEach((clientID) => {
        $players.set(clientID, {
          connected: true,
          played: false,
          deckCount: undefined,
          idx: undefined,
          pile: new Map(),
        })
      })

      console.log("players:", $players)

      return $players
    })
  }

  destroy() {
    this.room = undefined
  }
}

export const game = new GameHandler()
window["game"] = game
