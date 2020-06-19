import { decimal, logs } from "@cardsgame/utils"

import { BotConditions } from "../conditions/bot"
import { Bot, isBot } from "../players/bot"
import { Player, ServerPlayerEvent } from "../players/player"
import { Room } from "../room"
import { State } from "../state/state"
import { BotAction } from "./action"
import { BotGoal } from "./goal"

const STUPIDITY_RANGE = 50

const botsValueError = (bot: Bot) => {
  if (bot.intelligence === 0) {
    return Math.random() * 1000 - 500
  }

  return decimal(
    (Math.random() * STUPIDITY_RANGE - STUPIDITY_RANGE / 2) *
      (1 - bot.intelligence)
  )
}

export class BotRunner<S extends State> {
  activities: BotGoal<S>[]

  constructor(private room: Room<S>) {
    this.activities = room.botActivities ? [...room.botActivities] : []
  }

  onRoundStart() {
    const { room } = this
    const { state } = room

    if (room.botClients.length > 0) {
      if (state.turnBased && isBot(state.currentPlayer)) {
        logs.info(
          "Bots:onRoundStart",
          "turn-based game, poking only current player/bot"
        )
        this.thinkForPlayer(state.currentPlayer)
      }
      if (!state.turnBased) {
        logs.info("Bots:onRoundStart", "non-turn-based game, poking every bot")
        room.botClients.forEach((bot) => {
          this.thinkForPlayer(bot)
        })
      }
    }
  }
  onAnyMessage() {
    // Probably just check all parallel goals
    // if (this.room.botClients.length > 0) {
    //   logs.info(
    //     "Bots:onAnyMessage",
    //     "letting bots know, if they wish to interrupt"
    //   )
    //   this.room.botClients.forEach((bot) => {
    //     this.thinkForPlayer(bot)
    //   })
    // }
  }

  onPlayerTurnStarted(player: Player) {
    logs.info("Bots:onPlayerTurnStarted", player?.clientID)

    if (isBot(player)) {
      this.thinkForPlayer(player)
    }
  }

  thinkForPlayer(bot: Bot): void {
    logs.notice("thinkForPlayer", bot?.clientID)

    const { state } = this.room

    const goal = this.pickGoal(state, bot)
    if (!goal) {
      logs.notice("Bots", `found no goal to act...`)
      return
    }
    logs.notice("Bots", `chosen goal: ${goal.name}`)

    this.act(state, bot, goal)
      .then(() => {
        // Verify round ended.
        logs.notice("Bots", "finished acting")
        // if (state.currentPlayer === bot) {
        //   throw new Error('Bots, ')
        // }
      })
      .catch(() => {})
  }

  /**
   * Make Bot run its action.
   * Wait for the game server (CommandsManager) to respond.
   * Rejects if some action failed to be executed.
   */
  act(state: S, bot: Bot, goal: BotGoal<S>): Promise<boolean> {
    logs.info("act", bot.clientID, goal.name)
    return new Promise((resolve, reject) => {
      const keepActing = (): void => {
        logs.notice("keepActing")
        const action = this.pickAction(state, bot, goal)

        logs.notice("- action", action?.name)

        if (!action) {
          logs.info("Bots", `no more actions at "${goal.name}" goal!`)
          resolve()
          return
        }

        const delay =
          (typeof bot.actionDelay === "number"
            ? bot.actionDelay
            : bot.actionDelay()) * 1000
        logs.notice("- delay", delay)

        setTimeout(() => {
          const event: ServerPlayerEvent = {
            ...action.event(state, bot),
            player: bot,
          }
          this.room
            .handleMessage(event)
            .then((result) => {
              if (result) {
                keepActing()
              } else {
                logs.info(
                  "Bots",
                  `Couldn't execute last action "${action.name}" from goal "${goal.name}".`
                )
                resolve()
              }
            })
            .catch(reject)
        }, delay)
      }

      keepActing()
    })
  }

  pickGoal(state: S, bot: Bot): BotGoal<S> {
    // Grab all non-parallel and possible goals
    const availableGoals = this.activities
      .filter((goal) => !goal.parallel)
      .filter((goal) => {
        if (goal.condition) {
          const conditions = new BotConditions<S>(state, bot)
          try {
            goal.condition(conditions)
          } catch (e) {
            return false
          }
        }
        return true
      })

    // Calculate values of each goal
    const goalValues = new Map<BotGoal<S>, number>()
    availableGoals.forEach((goal) =>
      goalValues.set(goal, goal.value(state, bot) + botsValueError(bot))
    )

    // Pick the most valuable goal
    const mostValuable: [BotGoal<S>, number] = [null, -Infinity]
    goalValues.forEach((value, goal) => {
      if (value > mostValuable[1]) {
        mostValuable[0] = goal
        mostValuable[1] = value
      }
    })

    return mostValuable[0]
  }

  pickAction(state: S, bot: Bot, goal: BotGoal<S>): BotAction<S> {
    const actions = [...goal.actions]

    // Grab all currently possible actions
    const availableActions = actions.filter((action) => {
      if (action.condition) {
        const conditions = new BotConditions<S>(state, bot)
        try {
          action.condition(conditions)
        } catch (e) {
          return false
        }
      }
      return true
    })

    // Calculate values of each action
    const actionValues = new Map<BotAction<S>, number>()
    availableActions.forEach((action) => {
      const value = action.value ? action.value(state, bot) : 0
      actionValues.set(action, value + botsValueError(bot))
    })

    // Pick the most valuable action
    const mostValuable: [BotAction<S>, number] = [null, -Infinity]
    actionValues.forEach((value, action) => {
      if (value > mostValuable[1]) {
        mostValuable[0] = action
        mostValuable[1] = value
      }
    })

    return mostValuable[0]
  }
}
