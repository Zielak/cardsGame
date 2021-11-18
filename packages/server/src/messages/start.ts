import { logs, shuffle } from "@cardsgame/utils"
import { Client } from "@colyseus/core"

import { Sequence } from "../commands"
import { Player } from "../players/player"
import { Room } from "../room"
import { State } from "../state"

export function start(this: Room<State>, client: Client, message: any): void {
  const { state } = this

  if (!this.state.isGameOver) {
    if (state.isGameStarted) {
      logs.log("handleGameStart", `Game is already started, ignoring...`)
      return
    }
    if (this.canGameStart && !this.canGameStart()) {
      logs.log(
        "handleGameStart",
        `Someone requested game start, but we can't go yet...`
      )
      return
    }

    // We can go, convert all connected clients into players
    shuffle(
      this.clients
        .map((client) => new Player({ clientID: client.sessionId }))
        .concat(this.botClients)
    ).forEach((player) => {
      state.players.push(player)
    })

    startTheGame.call(this)
  } else {
    /**
     * ON HOLD
     * When first creating the room, players give it some options.
     * How would you want to "Restart" the game?
     * Remember those options and quickly restart it or be able to re-configure the room again?
     */

    this.send(client, "message", "Game's over, start it over in some other way")
  }
}

function startTheGame(this: Room<State>): void {
  const { state } = this

  state.isGameStarted = true
  state.isGameOver = false

  const postStartCommands = this.onStartGame(state)

  const postStartup = (): void => {
    if (state.turnBased) {
      this.onPlayerTurnStarted(state.currentPlayer)
      this.botRunner.onPlayerTurnStarted(state.currentPlayer)
    }
    this.onRoundStart()
    this.botRunner.onRoundStart()
  }

  if (postStartCommands) {
    this.commandsManager
      .executeCommand(state, new Sequence("onStartGame", postStartCommands))
      .then(postStartup)
  } else {
    postStartup()
  }
}