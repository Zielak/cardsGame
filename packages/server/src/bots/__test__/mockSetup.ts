import { defineEntityAction } from "../../actions/entity/entityAction.js"
import { defineMessageAction } from "../../actions/message/messageAction.js"
import { commands } from "../../index.js"
import type { State } from "../../state/state.js"
import type { BotNeuron } from "../botNeuron.js"

const ScreamAction = defineMessageAction({
  name: "ScreamNO",
  messageType: "scream",
  conditions: (test) => {
    test("data").is.defined()
  },
  command: (event) => new commands.Broadcast(event.messageType, event.data),
})

const PlayCardAction = defineEntityAction({
  name: "PlayCard",
  interaction: ({ player }) => [{ type: "classicCard", owner: player }],
  conditions: (test) => {
    test().itsPlayersTurn()
  },
  command: () => new commands.NextPlayer(),
})

const DoNothingAction = defineEntityAction({
  name: "DoNothingAction",
  interaction: () => [{ type: "classicCard" }],
  conditions: (test) => {
    test().itsPlayersTurn()
  },
  command: () => new commands.Noop(),
})

export const PlayCardGoal: BotNeuron<State> = {
  name: "PlayCardGoal",
  description: `
  Bot goal
  - with conditions
  - action of entities
  - aux filter on suits S and C
  - single action
  `,
  conditions: (test) => {
    test().itsPlayersTurn()
  },
  entitiesFilter: [{ suit: ["S", "C"] }],
  value: ({ state }) => {
    return 10 - state.players.length
  },
  action: PlayCardAction,
}

export const ScreamNOGoal: BotNeuron<State> = {
  name: "ScreamNOGoal",
  value: () => -10,
  playerEventData: () => "no",
  action: ScreamAction,
}
export const ScreamYESGoal: BotNeuron<State> = {
  name: "ScreamYESGoal",
  value: () => 10,
  playerEventData: () => "yes",
  action: ScreamAction,
}

export const ScreamGoal: BotNeuron<State> = {
  name: "ScreamGoal",
  description: `
  Bot goal
  - action of event
  - child neurons
  `,
  value: () => {
    return 5
  },
  children: [ScreamNOGoal, ScreamYESGoal],
}

export const FailedConditions: BotNeuron<State> = {
  name: "FailedConditions",
  conditions: (test) => test().set("test").is.undefined(),
  value: () => {
    throw new Error("Should fail at `conditions` first!")
  },
  action: DoNothingAction,
}

export const UnachievableGoal: BotNeuron<State> = {
  name: "UnachievableGoal",
  description: "All of its sub goals are impossible to achieve",
  value: () => 50,
  children: [
    FailedConditions,
    {
      name: "FailedEntitiesFilter",
      value: () => 50,
      entitiesFilter: (test) => test().its("rank").equals("NOPE"),
      action: DoNothingAction,
    } as BotNeuron<State>,
  ],
}

export const AllConditionsFailGoal: BotNeuron<State> = {
  name: "AllConditionsFailGoal",
  description: "All of its children has failing conditions",
  value: () => 50,
  children: [FailedConditions, FailedConditions],
}

export const rootNeuron: BotNeuron<State> = {
  name: "Root",
  value: () => Infinity,
  children: [PlayCardGoal, ScreamGoal, UnachievableGoal, AllConditionsFailGoal],
}
