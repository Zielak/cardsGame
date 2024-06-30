import { LabeledParent } from "__test__/helpers/labeledEntities.js"
import { TestRoom } from "__test__/helpers/room.js"

import { defineCompoundAction } from "@/actions/compound/compoundAction.js"
import { defineEntityAction } from "@/actions/entity/entityAction.js"
import { defineMessageAction } from "@/actions/message/messageAction.js"
import { GameOver } from "@/commands/gameOver.js"
import { Noop } from "@/commands/noop.js"
import { Undo } from "@/commands/undo.js"
import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import { Player } from "@/player/player.js"
import type { ServerPlayerMessage } from "@/player/serverPlayerMessage.js"
import type { Room } from "@/room/base.js"
import { State } from "@/state/state.js"
import { populatePlayerEvent } from "@/utils/populatePlayerEvent.js"

import { CommandsManager } from "../commandsManager.js"

jest.mock("@/player/player.js")

let state: State
let event: ServerPlayerMessage
let room: Room<State>
let manager: CommandsManager<State>

const clientID = "testClient"

const conditions = (): void => {}
const command = () => new Noop()
const baseMessage: ServerPlayerMessage = {
  timestamp: 123,
  messageType: ENTITY_INTERACTION,
}

const action1 = defineEntityAction<State>({
  name: "Action1",
  interaction: () => [{ type: "foo" }],
  conditions,
  command,
})
const action2 = defineEntityAction<State>({
  name: "Action2",
  interaction: () => [{ type: "bar" }],
  conditions,
  command,
})
const actionFinish = defineMessageAction<State>({
  name: "Finish",
  conditions,
  command,
  messageType: "finish",
})
const actionAbort = defineMessageAction<State>({
  name: "Abort",
  conditions,
  command,
  messageType: "abort",
})
const gameOver = defineEntityAction<State>({
  name: "GameOver",
  interaction: () => "*",
  conditions,
  command,
})
const actions = [
  defineCompoundAction({
    name: "Compound",
    actions: [action1, action2],
    finishActions: [actionFinish],
    abortActions: [actionAbort],
  }),
  gameOver,
]

let player: Player
let entityFoo: LabeledParent
let entityBar: LabeledParent

beforeEach(() => {
  state = new State()
  // event = populatePlayerEvent(state, event, clientID)
  room = new TestRoom()
  room.state = state
  room.possibleActions = actions
  manager = new CommandsManager(room)
  room.commandsManager = manager

  player = new Player({ clientID })
  state.players.push(player)

  entityFoo = new LabeledParent(state, { type: "foo" })
  entityBar = new LabeledParent(state, { type: "bar" })
})

function tap(entity: LabeledParent) {
  return populatePlayerEvent(
    state,
    {
      messageType: ENTITY_INTERACTION,
      entityPath: entity.idxPath,
      interaction: "tap",
    },
    player.clientID,
  )
}

it("sets unfinished compound action as pending", async () => {
  expect(manager.pendingActions.size).toBe(0)
  await expect(manager.handlePlayerEvent(tap(entityFoo))).resolves.toBe(true)

  expect(manager.pendingActions.size).toBe(1)
  expect(manager.pendingActions.get(player.clientID).action.name).toBe(
    "Compound",
  )
})

it("continues from pending action", async () => {
  expect(manager.pendingActions.size).toBe(0)
  manager.handlePlayerEvent(tap(entityFoo))
  await expect(manager.handlePlayerEvent(tap(entityBar))).resolves.toBe(true)
  await expect(manager.handlePlayerEvent(tap(entityFoo))).resolves.toBe(true)

  expect(manager.pendingActions.size).toBe(1)
  expect(manager.pendingActions.get(player.clientID).action.name).toBe(
    "Compound",
  )
})

it("finishes action", async () => {
  expect(manager.pendingActions.size).toBe(0)
  await expect(manager.handlePlayerEvent(tap(entityFoo))).resolves.toBe(true)

  expect(manager.pendingActions.size).toBe(1)
  expect(manager.pendingActions.get(player.clientID).action.name).toBe(
    "Compound",
  )

  await expect(
    manager.handlePlayerEvent({
      ...baseMessage,
      messageType: "finish",
      player,
    }),
  ).resolves.toBe(true)

  expect(manager.pendingActions.size).toBe(0)
})

it("aborts action", async () => {
  expect(manager.pendingActions.size).toBe(0)
  await expect(manager.handlePlayerEvent(tap(entityBar))).resolves.toBe(true)

  expect(manager.pendingActions.size).toBe(1)
  expect(manager.pendingActions.get(player.clientID).action.name).toBe(
    "Compound",
  )

  await expect(
    manager.handlePlayerEvent({
      ...baseMessage,
      messageType: "abort",
      player,
    }),
  ).resolves.toBe(true)

  expect(manager.pendingActions.size).toBe(0)
})

it("ignores other actions if got one pending", async () => {
  jest.spyOn(gameOver, "checkPrerequisites")
  jest.spyOn(gameOver, "checkConditions")
  jest.spyOn(gameOver, "getCommand")

  await manager.handlePlayerEvent(tap(entityFoo))

  expect(gameOver.checkConditions).toHaveBeenCalledTimes(1)
  expect(gameOver.checkPrerequisites).toHaveBeenCalledTimes(1)
  expect(gameOver.getCommand).toHaveBeenCalledTimes(0)

  await manager.handlePlayerEvent(tap(entityFoo))

  expect(gameOver.checkConditions).toHaveBeenCalledTimes(1)
  expect(gameOver.checkPrerequisites).toHaveBeenCalledTimes(1)
  expect(gameOver.getCommand).toHaveBeenCalledTimes(0)

  await manager.handlePlayerEvent({
    ...baseMessage,
    messageType: "abort",
    player,
  })

  expect(gameOver.checkConditions).toHaveBeenCalledTimes(1)
  expect(gameOver.checkPrerequisites).toHaveBeenCalledTimes(1)
  expect(gameOver.getCommand).toHaveBeenCalledTimes(0)

  await manager.handlePlayerEvent(tap(entityFoo))

  expect(gameOver.checkConditions).toHaveBeenCalledTimes(2)
  expect(gameOver.checkPrerequisites).toHaveBeenCalledTimes(2)
  expect(gameOver.getCommand).toHaveBeenCalledTimes(0)
})

describe("executeCommand", () => {
  it("remembers command in history", async () => {
    expect(manager.history.length).toBe(0)
    expect(state.isGameOver).toBe(false)

    const command = new GameOver(null)

    await manager.executeCommand(state, command)

    expect(state.isGameOver).toBe(true)
    expect(manager.history.length).toBe(1)
    expect(manager.history[0]).toBe(command)
  })
})

describe("undoLastCommand", () => {
  it("undoes last command, and doesn't remember Undo in history", async () => {
    expect(manager.history.length).toBe(0)
    expect(state.isGameOver).toBe(false)
    const command = new GameOver(null)

    const undo = new Undo()

    await manager.executeCommand(state, command)

    expect(state.isGameOver).toBe(true)
    expect(manager.history.length).toBe(1)
    expect(manager.history[0]).toBe(command)

    await manager.executeCommand(state, undo)

    expect(state.isGameOver).toBe(false)
    expect(manager.history.length).toBe(0)
  })

  it("doesn't throw on empty history", async () => {
    expect(manager.history.length).toBe(0)

    await expect(manager.undoLastCommand(state)).resolves.not.toThrow()

    expect(manager.history.length).toBe(0)
  })
})
