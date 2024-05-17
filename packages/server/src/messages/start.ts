import { shuffle } from "@cardsgame/utils"
import type { Client } from "@colyseus/core"

import { Sequence } from "../commands/index.js"
import { logs } from "../logs.js"
import { Player } from "../player/player.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"
import { variantParser } from "../utils/variantParser.js"

/**
 * @param this
 * @param client
 * @param message
 * @returns
 * @ignore
 */
export function start(
  this: Room<State>,
  client?: Client,
  message?: ClientMessageTypes["start"],
): void {
  const { state, variantsConfig } = this
  let variantData = message?.variantData
  let msg = ""

  /**
   * 1. Validate if we can go with the START
   */
  if (!this.state.isGameOver) {
    if (state.isGameStarted) {
      msg = `Game is already started, ignoring...`
      logs.log("handleGameStart", msg)
      client?.send("gameInfo", { data: msg })

      return
    }
    if (this.canGameStart && !this.canGameStart()) {
      msg = `Someone requested game start, but we can't go yet...`
      logs.log("handleGameStart", msg)
      client?.send("gameWarn", { data: msg })

      return
    }

    // If variants are setup
    if (variantsConfig && variantData) {
      try {
        if (variantsConfig.parse) {
          variantData = variantsConfig.parse(variantData)
        } else {
          variantData = variantParser(variantData)
        }
      } catch (e) {
        client?.send("gameError", {
          data: "Game room setup config parsing failed. " + e.message,
        })
        return
      }

      if (variantsConfig.validate) {
        const validationResults = variantsConfig.validate?.(variantData)

        if (validationResults !== true) {
          logs.log("handleGameStart", `Variants config validation failed`)

          msg =
            "Game room setup config validation failed. " +
            (typeof validationResults === "string" ? validationResults : "")

          client?.send("gameError", { data: msg })

          return
        }
      }
    }

    // We can go, convert all connected clients into players
    shuffle(
      this.clients
        .map((entry) => new Player({ clientID: entry.sessionId }))
        .concat(this.botClients),
    ).forEach((player) => {
      state.players.push(player)
    })

    startTheGame.call(this, variantData)
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

function startTheGame(
  this: Room<State>,
  variantData?: ClientMessageTypes["start"]["variantData"],
): void {
  const { state } = this

  state.isGameStarted = true
  state.isGameOver = false

  this._executeIntegrationHook("startPre")

  if (this.variantsConfig && variantData) {
    state.populateVariantData(this.variantsConfig.defaults, variantData)
  }

  const postStartCommands = this.onStartGame()

  const postStartup = (): void => {
    this._executeIntegrationHook("startPost")
    if (state.turnBased) {
      this.onPlayerTurnStarted(state.currentPlayer)
      this.botRunner?.onPlayerTurnStarted(state.currentPlayer)
    }
    this.onRoundStart()
    this.botRunner?.onRoundStart()
  }

  if (postStartCommands) {
    this.commandsManager
      .executeCommand(state, new Sequence("onStartGame", postStartCommands))
      .then(postStartup)
  } else {
    postStartup()
  }
}
