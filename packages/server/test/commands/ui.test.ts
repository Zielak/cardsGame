import { Player, Room } from "../../src"
import { RevealUI, HideUI } from "../../src/commands/ui"
import { State } from "../../src/state/state"
import { RoomMock } from "../helpers/roomMock"

let state: State
let room: Room<any>

const UI_KEY1 = "uiKey1"
const UI_KEY2 = "uiKey2"

beforeEach(() => {
  state = new State()
  state.players.push(
    new Player({ clientID: "current" }),
    new Player({ clientID: "other" })
  )
  state.ui.set(UI_KEY1, "")
  state.ui.set(UI_KEY2, "")
  room = new RoomMock()
})

describe("RevealUI", () => {
  test("current player", () => {
    const cmd = new RevealUI(UI_KEY1)

    cmd.execute(state, room)

    expect(state.ui.get(UI_KEY1)).toBe("current")
    expect(state.ui.get(UI_KEY2)).toBe("")

    cmd.undo(state, room)

    expect(state.ui.get(UI_KEY1)).toBe("")
    expect(state.ui.get(UI_KEY2)).toBe("")
  })

  test("specific player", () => {
    const cmd = new RevealUI(UI_KEY1, "other")

    cmd.execute(state, room)

    expect(state.ui.get(UI_KEY1)).toBe("other")
    expect(state.ui.get(UI_KEY2)).toBe("")

    cmd.undo(state, room)

    expect(state.ui.get(UI_KEY1)).toBe("")
    expect(state.ui.get(UI_KEY2)).toBe("")
  })
})

describe("HideUI", () => {
  test("current player", () => {
    state.ui.set(UI_KEY1, "current")
    state.ui.set(UI_KEY2, "other")

    const cmd = new HideUI(UI_KEY1)

    cmd.execute(state, room)

    expect(state.ui.get(UI_KEY1)).toBe("")
    expect(state.ui.get(UI_KEY2)).toBe("other")

    cmd.undo(state, room)

    expect(state.ui.get(UI_KEY1)).toBe("current")
    expect(state.ui.get(UI_KEY2)).toBe("other")
  })
})
