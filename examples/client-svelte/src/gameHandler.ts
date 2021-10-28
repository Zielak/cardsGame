import { Game, Room } from "@cardsgame/client"
import { get, writable } from "svelte/store"

import {
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
      port: 443,
    },
  })
  room: Room<WarState>

  quickJoin() {
    this.game.joinOrCreate("war").then((room: Room<WarState>) => {
      clientJoined.set(true)
      this.room = room
      this.roomListeners()
    })
  }

  roomListeners() {
    const { room } = this
    let outcomeTimer

    sessionID.set(room.sessionID)

    room.onMessage<WarMessage>("battleResult", ({ data }) => {
      console.log("BATTLE RESULT", { ...data })
      if (data.outcome === "tie") {
        battleOutcome.set("tie")
      } else {
        battleOutcome.set(data.winner)
      }

      if (outcomeTimer) clearTimeout(outcomeTimer)
      outcomeTimer = setTimeout(() => battleOutcome.set(""), 750)
    })

    room.onMessage<WarMessage>("gameOver", ({ data }) => {
      winner.set(data.winner)
    })

    room.onMessage("*", (message) => {
      console.log("Unknown message:", message)
    })

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

    room.state.childrenContainer.onAdd = (container) => {
      console.log(`Player's container added!`, container)
      const deck = container.childrenDeck[0]
      const pile = container.childrenPile[0]

      const { ownerID } = container

      players.update((storeValue) => {
        storeValue.get(ownerID).update((value) => ({
          ...value,
          idx: container.idx,
          deckCount: deck.childCount,
        }))

        return storeValue
      })

      deck.onChange = () => {
        players.update((storeValue) => {
          storeValue.get(ownerID).update((value) => ({
            ...value,
            deckCount: deck.childCount,
          }))
          return storeValue
        })
      }

      pile.childrenClassicCard.onAdd = (card, key) => {
        console.log(pile.name, "added card", card.suit, card.rank)
        players.update((storeValue) => {
          storeValue.get(ownerID).update((value) => {
            value.pile.set(key, card)
            return value
          })

          return storeValue
        })
      }
      pile.childrenClassicCard.onRemove = (card, key) => {
        console.log(pile.name, "removed card", card.suit, card.rank)
        players.update((storeValue) => {
          storeValue.get(ownerID).update((value) => {
            value.pile.delete(key)
            return value
          })
          return storeValue
        })
      }
    }

    room.state.playersPlayed.onChange = (played, key) => {
      players.update((storeValue) => {
        storeValue.get(key).update((value) => {
          value.played = played
          return value
        })
        return storeValue
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
  }

  handleGameStarted() {
    console.log("game starting, setting up players")

    players.update((value) => {
      get(clients).forEach((clientID) => {
        value.set(
          clientID,
          writable({
            connected: true,
            played: false,
            deckCount: undefined,
            idx: undefined,
            pile: new Map(),
          })
        )
      })

      console.log("players:", value)

      return value
    })
  }

  destroy() {
    this.room = undefined
  }
}

export const game = new GameHandler()
window["game"] = game
