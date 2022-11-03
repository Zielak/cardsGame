import { ClassicCard, Hand } from "../../entities/index.js"
import { Bot } from "../../player/index.js"
import { State } from "../../state/state.js"
import { pickNeuron } from "../pickNeuron.js"

import {
  PlayCardGoal,
  rootNeuron,
  ScreamGoal,
  ScreamNOGoal,
  ScreamYESGoal,
} from "./mockSetup.js"

let state: State, bot1: Bot, bot2: Bot, hand: Hand

beforeEach(() => {
  state = new State()

  state.players[0] = bot1 = new Bot({ clientID: "bot1", intelligence: 1 })
  state.players[1] = bot2 = new Bot({ clientID: "bot2", intelligence: 1 })

  hand = new Hand(state, { owner: bot1 })
  new ClassicCard(state, { parent: hand, rank: "2", suit: "C" })
  new ClassicCard(state, { parent: hand, rank: "3", suit: "S" })
  new ClassicCard(state, { parent: hand, rank: "4", suit: "D" })
  new ClassicCard(state, { parent: hand, rank: "5", suit: "H" })

  state.currentPlayerIdx = 0
})
test("Bot1, their turn, can pick only S and C", () => {
  const goal = pickNeuron(rootNeuron, state, bot1)
  expect(goal.neuron.name).toBe(PlayCardGoal.name)
  expect(goal.message.entityPath).toBeDefined()
})

test("Bot2, not their turn, can only scream", () => {
  const goal = pickNeuron(rootNeuron, state, bot2)
  expect(goal.neuron.name).toBe(ScreamYESGoal.name)
  expect(goal.message.messageType).toBe("scream")
  expect(goal.message.data).toBe("yes")
})
