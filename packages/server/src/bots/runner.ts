import type { Bot } from "@/player/bot.js"
import type { Player } from "@/player/player.js"
import type { Room } from "@/room/base.js"
import type { State } from "@/state/state.js"
import { populatePlayerEvent } from "@/utils/populatePlayerEvent.js"

import { logs } from "../logs.js"

import type { BotNeuron } from "./botNeuron.js"
import { pickNeuron } from "./pickNeuron/pickNeuron.js"

export class BotRunner<S extends State> {
  neuronTree: BotNeuron<S>
  private readonly room: Room<S>

  get canRun(): boolean {
    return !this.room.state.isGameOver
  }

  constructor(room: Room<S>) {
    this.neuronTree = {
      name: "Root",
      value: (): number => 0,
      children: room.botActivities ? [...room.botActivities] : [],
    }

    this.room = room
  }

  onRoundStart(): void {
    logs.info("Bots:onRoundStart")

    if (this.canRun) {
      this.runAllBots()
    }
  }
  onAnyMessage(): void {
    logs.info("Bots:onAnyMessage")

    if (this.canRun) {
      this.runAllBots()
    }
  }
  onPlayerTurnStarted(currentPlayer: Player): void {
    logs.info("Bots:onPlayerTurnStarted", currentPlayer?.clientID)

    if (this.canRun) {
      this.runAllBots()
    }
  }

  runAllBots(): void {
    if (this.room.botClients.length === 0) {
      logs.debug("Bots", "nobody is listening...")
      return
    }

    this.room.botClients.forEach((bot) => {
      this.pickGoal(bot)
    })
  }

  private pickGoal(bot: Bot): void {
    const goal = pickNeuron(this.neuronTree, this.room.state, bot)

    if (goal) {
      logs.log("Bots", `${bot.clientID} chose goal: ${goal.neuron.name}`)

      bot.currentThought = goal

      if (!bot.currentThoughtTimer) {
        const delay =
          typeof bot.actionDelay === "number"
            ? bot.actionDelay
            : bot.actionDelay()
        logs.debug("Bots", `setting up thought timer: ${delay} sec`)
        bot.currentThoughtTimer = setTimeout(
          () => {
            this.executeThough(bot)
          },
          delay * 1000 * (goal.neuron.thinkScale || 1),
        )
      }
    } else {
      logs.log("Bots", `no goals for ${bot.clientID}`)
    }
  }

  private executeThough(bot: Bot): void {
    logs.debug("Bots.executeThough")
    const { message, neuron } = bot.currentThought

    if (!neuron.action) {
      throw new Error(
        "executeThough | given neuron doesn't have ActionTemplate!",
      )
    }

    bot.currentThought = null
    bot.currentThoughtTimer = null
    logs.debug("\n===============[ BOT MESSAGE ]================\n")

    const newMessage = populatePlayerEvent(this.room.state, message, bot)

    this.room
      .handleMessage(newMessage)
      .catch((e) =>
        logs.error(
          "Bot.act",
          `action() failed for client: "${bot.clientID}": ${e}`,
        ),
      )
  }
}
