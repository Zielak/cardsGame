import { logs } from "@cardsgame/utils"

import { Bot } from "../players/bot"
import { Player } from "../players/player"
import { Room } from "../room"
import { State } from "../state/state"
import { BotNeuron } from "./botNeuron"
import { pickNeuron } from "./pickNeuron"

export class BotRunner<S extends State> {
  neuronTree: BotNeuron<S>

  constructor(private room: Room<S>) {
    this.neuronTree = {
      name: "Root",
      value: (): number => 0,
      children: room.botActivities ? [...room.botActivities] : [],
    }
  }

  onRoundStart(): void {
    logs.info("Bots:onRoundStart")

    setTimeout(() => this.runAllBots(), 0)
  }
  onAnyMessage(): void {
    logs.info("Bots:onAnyMessage")

    setTimeout(() => this.runAllBots(), 0)
  }
  onPlayerTurnStarted(currentPlayer: Player): void {
    logs.info("Bots:onPlayerTurnStarted", currentPlayer?.clientID)

    setTimeout(() => this.runAllBots(), 0)
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

  private pickGoal(bot: Bot): void {
    const goal = pickNeuron(this.neuronTree, this.room.state, bot)

    if (goal) {
      logs.notice("Bots", `${bot.clientID} chose goal: ${goal.neuron.name}`)

      bot.currentThought = goal

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
    } else {
      logs.notice("Bots", `no goals for ${bot.clientID}`)
    }
  }

  private executeThough(bot: Bot): void {
    logs.verbose("Bots.executeThough")
    const { event, neuron } = bot.currentThought

    if (!neuron.action) {
      throw new Error(
        "executeThough | given neuron doesn't have ActionTemplate!"
      )
    }

    bot.currentThought = null
    bot.currentThoughtTimer = null
    logs.verbose("\n===============[ BOT MESSAGE ]================\n")

    this.room
      .handleMessage(bot.clientID, event)
      .catch((e) =>
        logs.error(
          "Bot.act",
          `action() failed for client: "${bot.clientID}": ${e}`
        )
      )
  }
}
