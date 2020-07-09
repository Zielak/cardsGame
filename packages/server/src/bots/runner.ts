import { logs } from "@cardsgame/utils"

import {
  EntitiesActionTemplate,
  EventActionTemplate,
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "../actionTemplate"
import { Conditions } from "../conditions"
import { filterActionsByConditions } from "../interaction"
import { Bot } from "../players/bot"
import { Player } from "../players/player"
import { QuerableProps, queryRunner } from "../queryRunner"
import { Room } from "../room"
import { State } from "../state/state"
import { ChildTrait } from "../traits/child"
import { populatePlayerEvent } from "../utils"
import { BotNeuron } from "./botNeuron"
import { pickNeuron } from "./pickNeuron"
import { EntitySubject } from "./utils"

export class BotRunner<S extends State> {
  neuronTree: BotNeuron<S>[]

  constructor(private room: Room<S>) {
    this.neuronTree = room.botActivities ? [...room.botActivities] : []
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
    const goal = pickNeuron(this.neuronTree, this.room.state, bot)

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
   * If bot was already planning to execute other action,
   * we'll just change its mind without resetting its timer.
   *
   * Use case: someone interrupted me and I should probably reassess my choice.
   */
  makeUpMyMind(bot: Bot, neuron: BotNeuron<S>): void {
    logs.notice("Bots.makeUpMyMind", bot.clientID, neuron.name)

    bot.currentThought = neuron
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
    const neuron = bot.currentThought

    if (Array.isArray(neuron.action)) {
      throw new Error(
        "executeThough | given neuron has children instead of target ActionTemplate"
      )
    }

    const { action } = neuron

    const clientEvent = isInteractionOfEntities(action)
      ? this.prepareBotInteraction(action, neuron, bot)
      : isInteractionOfEvent(action)
      ? this.prepareBotEvent(action, neuron, bot)
      : {}

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

  prepareBotInteraction(
    action: EntitiesActionTemplate<S>,
    neuron: BotNeuron<S>,
    bot: Bot
  ): ClientPlayerEvent {
    const state = this.room.state
    const { entitiesFilter } = neuron

    // Grab all entities from INTERACTIONS
    let entities = action
      .interaction(bot)
      .reduce(
        (all, query) => all.push(query) && all,
        new Array<QuerableProps>()
      )
      .map((query) => state.queryAll(query))
      .reduce((all, entities) => all.concat(entities), new Array<ChildTrait>())

    if (Array.isArray(entitiesFilter)) {
      entities = entities.filter(queryRunner(entitiesFilter))
    } else if (typeof entitiesFilter === "function") {
      entities = entities.filter((entity) => {
        const con = new Conditions<S, EntitySubject>(
          state,
          { entity },
          "entity"
        )
        try {
          entitiesFilter(con)
        } catch (e) {
          return false
        }
        return true
      })
    }

    // Filter out only actionable entities
    const allowedEntities = entities.filter((entity) => {
      const event = populatePlayerEvent(
        state,
        { entityPath: entity.idxPath },
        bot
      )
      return filterActionsByConditions(state, event)(action)
    })

    return {
      entityPath: allowedEntities[0].idxPath,
    }
  }

  prepareBotEvent(
    action: EventActionTemplate<S>,
    neuron: BotNeuron<S>,
    bot: Bot
  ): ClientPlayerEvent {
    const state = this.room.state
    const playerEvent = action.interaction

    return {
      command: playerEvent,
      data: neuron.playerEventData || neuron.playerEventData(state, bot),
    }
  }
}
