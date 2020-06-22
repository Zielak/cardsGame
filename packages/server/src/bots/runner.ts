import { logs } from "@cardsgame/utils"

import { Bot } from "../players/bot"
import { Player } from "../players/player"
import { Room } from "../room"
import { State } from "../state/state"
import { ChildTrait } from "../traits/child"
import { BotGoal } from "./goal"
import { pickAction } from "./pickAction"
import { pickGoal } from "./pickGoal"

export class BotRunner<S extends State> {
  activities: BotGoal<S>[]

  constructor(private room: Room<S>) {
    this.activities = room.botActivities ? [...room.botActivities] : []
  }

  onRoundStart(): void {
    logs.info("Bots:onRoundStart")

    this.runAllBots()
  }
  onAnyMessage(): void {
    logs.info("Bots:onAnyMessage")

    this.runAllBots()
  }
  onPlayerTurnStarted(currentPlayer: Player): void {
    logs.info("Bots:onPlayerTurnStarted", currentPlayer?.clientID)

    this.runAllBots()
  }

  runAllBots(): void {
    if (this.room.botClients.length === 0) {
      logs.verbose("Bots", "nobody is listening...")
      return
    }

    this.room.botClients.forEach((bot) => {
      this.pickGoal(bot)
    })
  }

  pickGoal(bot: Bot): void {
    const goal = pickGoal(this.activities, this.room.state, bot)

    if (goal) {
      logs.notice("Bots", `${bot.clientID} chose goal: ${goal.name}`)

      this.makeUpMyMind(bot, goal)
    } else {
      logs.notice("Bots", `no goals for ${bot.clientID}`)
    }
  }

  /**
   * Makes the bot pick an action to execute.
   * Sets bot to execute that action after some delay.
   * If bot was already planning to execute some action,
   * we'll just change its mind without resetting its timer.
   */
  makeUpMyMind(bot: Bot, goal: BotGoal<S>): void {
    logs.notice("Bots.act", bot.clientID, goal.name)
    if (!goal) {
      logs.notice(
        "Bots.act",
        `for bot:${bot.clientID}, ignoring - no goal to execute`
      )
      return
    }

    const action = pickAction(this.room.state, bot, goal)
    if (!action) {
      logs.info("Bots.act", `no more actions at "${goal.name}" goal!`)
      return
    }

    bot.currentThought = action
    if (!bot.currentThoughtTimer) {
      const delay =
        typeof bot.actionDelay === "number"
          ? bot.actionDelay
          : bot.actionDelay()
      logs.verbose("Bots", `setting up thought timer: ${delay} sec`)
      bot.currentThoughtTimer = setTimeout(() => {
        this.executeThough(bot)
      }, delay * 1000)
    }
  }

  executeThough(bot: Bot): void {
    logs.verbose("Bots.executeThough")
    const action = bot.currentThought
    const botEvent = action.event(this.room.state, bot)
    const clientEvent: ClientPlayerEvent = {}

    if (botEvent.entity) {
      clientEvent.entityPath = (botEvent.entity as ChildTrait).idxPath
    }
    if (botEvent.command) {
      clientEvent.command = botEvent.command
    }
    if (botEvent.data) {
      clientEvent.data = botEvent.data
    }
    if (botEvent.event) {
      clientEvent.event = botEvent.event
    }

    bot.currentThought = undefined
    bot.currentThoughtTimer = undefined

    logs.verbose("\n===============[ BOT MESSAGE ]================\n")

    this.room
      .handleMessage(bot.clientID, clientEvent)
      .catch((e) =>
        logs.error(
          "Bot.act",
          `action() failed for client: "${bot.clientID}": ${e}`
        )
      )
  }
}
