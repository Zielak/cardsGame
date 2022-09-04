import { ActionTemplate, BotNeuron, commands, State } from "../../src"

const ScreamAction: ActionTemplate<State> = {
  name: "ScreamNO",
  messageType: "scream",
  conditions: (con) => {
    con("data").is.defined()
  },
  command: (state, event) =>
    new commands.Broadcast(event.messageType, event.data),
}

const PlayCardAction: ActionTemplate<State> = {
  name: "PlayCard",
  interaction: (player) => [{ type: "classicCard", owner: player }],
  conditions: (con) => {
    con().itsPlayersTurn()
  },
  command: (state, room) => new commands.NextPlayer(),
}

const DoNothingAction: ActionTemplate<State> = {
  name: "DoNothingAction",
  interaction: () => [{ type: "classicCard" }],
  conditions: (con) => {
    con().itsPlayersTurn()
  },
  command: (state, room) => new commands.Noop(),
}

export const PlayCardGoal: BotNeuron<State> = {
  name: "PlayCardGoal",
  description: `
  Bot goal
  - with conditions
  - action of entities
  - aux filter on suits S and C
  - single action
  `,
  conditions: (con) => {
    con().itsPlayersTurn()
  },
  entitiesFilter: [{ suit: ["S", "C"] }],
  value: (state) => {
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
  value: (state) => {
    return 5
  },
  children: [ScreamNOGoal, ScreamYESGoal],
}

export const FailedConditions: BotNeuron<State> = {
  name: "FailedConditions",
  conditions: (con) => con().set("test").is.undefined(),
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
      entitiesFilter: (con) => con().its("rank").equals("NOPE"),
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
