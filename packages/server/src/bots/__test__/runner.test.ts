import { TestRoom } from "../../__helpers__/room.js"
import type { Room } from "../../room/base.js"
import { State } from "../../state/state.js"
import { BotRunner } from "../runner.js"

let runner: BotRunner<State>
let state: State
let room: Room<State>

beforeEach(() => {
  state = new State()
  room = new TestRoom()
  room.state = state
  runner = new BotRunner<State>(room)
})

it("doesn't run when the game is over", () => {
  state.isGameOver = true

  runner.runAllBots = jest.fn()

  runner.onRoundStart()
  expect(runner.runAllBots).not.toHaveBeenCalled()

  runner.onAnyMessage()
  expect(runner.runAllBots).not.toHaveBeenCalled()

  runner.onPlayerTurnStarted({} as any)
  expect(runner.runAllBots).not.toHaveBeenCalled()
})

it("runs all bots when the same is not yet over", () => {
  state.isGameOver = false

  runner.runAllBots = jest.fn()

  runner.onRoundStart()
  expect(runner.runAllBots).toHaveBeenCalled()

  runner.onAnyMessage()
  expect(runner.runAllBots).toHaveBeenCalled()

  runner.onPlayerTurnStarted({} as any)
  expect(runner.runAllBots).toHaveBeenCalled()
})
