import { noop } from "@cardsgame/utils"

import { CommandsManager } from "@/commandsManager/commandsManager.js"
import { isBot } from "@/player/bot.js"
import { Room } from "@/room/base.js"
import { State } from "@/state/state.js"

import { start } from "../start.js"

let roomMock: Room<State>
let state: State
const client = { sessionId: "A" }

jest.mock("@/state/state.js")

beforeEach(() => {
  const clients = [{ sessionId: "A" }, { sessionId: "B" }, { sessionId: "C" }]

  state = new State()
  // @ts-expect-error testing
  state.clients = clients.map((c) => ({
    id: c.sessionId,
    ready: true,
    isBot: false,
  }))

  roomMock = {
    clients,
    botClients: [],
    clientSend: jest.fn(),
    canGameStart: undefined,
    readyClientsCount: 3,
    state,

    _executeIntegrationHook: jest.fn(),
    variantsConfig: undefined,
    onStartGame: jest.fn(),
    onPlayerTurnStarted: jest.fn(),
    onRoundStart: jest.fn(),

    botRunner: undefined,
    commandsManager: {
      executeCommand: jest.fn().mockImplementation(() => new Promise(noop)),
    },
  } as unknown as Room<State>
})

it("halts when the game is already running", () => {
  state.isGameStarted = true

  start.call(roomMock, client)

  expect(roomMock.onRoundStart).not.toHaveBeenCalled()
  expect(roomMock.clientSend).toHaveBeenCalledWith(
    client,
    "gameInfo",
    `Game is already started, ignoring...`,
  )
})

it("halts when canGameStart() returns false", () => {
  roomMock.canGameStart = jest.fn().mockImplementation(() => false)

  start.call(roomMock, client)

  expect(roomMock.canGameStart).toHaveBeenCalled()
  expect(roomMock.onRoundStart).not.toHaveBeenCalled()
  expect(roomMock.clientSend).toHaveBeenCalled()
})

it("halts when not enhough players are ready", () => {
  roomMock.playersCount = {
    min: 3,
    max: 10,
  }
  // @ts-expect-error testing
  roomMock.readyClientsCount = 2

  start.call(roomMock, client)

  expect(roomMock.onRoundStart).not.toHaveBeenCalled()
  expect(roomMock.clientSend).toHaveBeenCalled()
})
