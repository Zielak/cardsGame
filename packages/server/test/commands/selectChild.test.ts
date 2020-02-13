import { State } from "../../src/state"
import {
  Select,
  Deselect,
  ToggleSelection
} from "../../src/commands/selectChild"
import { Hand } from "../../src/entities/hand"
import { ClassicCard } from "../../src/entities/classicCard"
import { RoomMock } from "../helpers/roomMock"
import { Room } from "../../src/room"

let state: State
let room: Room<any>
let hand: Hand

beforeEach(() => {
  state = new State()
  room = new RoomMock()
  hand = new Hand(state)
  new ClassicCard(state, { parent: hand })
  new ClassicCard(state, { parent: hand })
  new ClassicCard(state, { parent: hand })
  new ClassicCard(state, { parent: hand })
})

describe("Select", () => {
  test("single", () => {
    const cmd = new Select(hand, 1)

    cmd.execute(state, room)
    expect(hand.isChildSelected(1)).toBe(true)

    cmd.undo(state, room)
    expect(hand.isChildSelected(1)).toBe(false)
  })

  test("multiple", () => {
    const cmd = new Select(hand, [0, 2, 3])

    cmd.execute(state, room)
    expect(hand.isChildSelected(0)).toBe(true)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.isChildSelected(2)).toBe(true)
    expect(hand.isChildSelected(3)).toBe(true)

    cmd.undo(state, room)
    expect(hand.isChildSelected(0)).toBe(false)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.isChildSelected(2)).toBe(false)
    expect(hand.isChildSelected(3)).toBe(false)
  })

  test("all", () => {
    const cmd = new Select(hand)

    cmd.execute(state, room)
    expect(hand.isChildSelected(0)).toBe(true)
    expect(hand.isChildSelected(1)).toBe(true)
    expect(hand.isChildSelected(2)).toBe(true)
    expect(hand.isChildSelected(3)).toBe(true)

    cmd.undo(state, room)
    expect(hand.isChildSelected(0)).toBe(false)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.isChildSelected(2)).toBe(false)
    expect(hand.isChildSelected(3)).toBe(false)
  })
})

describe("Deselect", () => {
  describe("where all is initially selected", () => {
    beforeEach(() => {
      hand.selectChildAt(0)
      hand.selectChildAt(1)
      hand.selectChildAt(2)
      hand.selectChildAt(3)
    })

    test("single", () => {
      const cmd = new Deselect(hand, 1)

      cmd.execute(state, room)
      expect(hand.isChildSelected(1)).toBe(false)

      cmd.undo(state, room)
      expect(hand.isChildSelected(1)).toBe(true)
    })

    test("multiple", () => {
      const cmd = new Deselect(hand, [0, 2, 3])

      cmd.execute(state, room)
      expect(hand.isChildSelected(0)).toBe(false)
      expect(hand.isChildSelected(1)).toBe(true)
      expect(hand.isChildSelected(2)).toBe(false)
      expect(hand.isChildSelected(3)).toBe(false)

      cmd.undo(state, room)
      expect(hand.isChildSelected(0)).toBe(true)
      expect(hand.isChildSelected(1)).toBe(true)
      expect(hand.isChildSelected(2)).toBe(true)
      expect(hand.isChildSelected(3)).toBe(true)
    })

    test("all", () => {
      const cmd = new Deselect(hand)

      cmd.execute(state, room)
      expect(hand.isChildSelected(0)).toBe(false)
      expect(hand.isChildSelected(1)).toBe(false)
      expect(hand.isChildSelected(2)).toBe(false)
      expect(hand.isChildSelected(3)).toBe(false)

      cmd.undo(state, room)
      expect(hand.isChildSelected(0)).toBe(true)
      expect(hand.isChildSelected(1)).toBe(true)
      expect(hand.isChildSelected(2)).toBe(true)
      expect(hand.isChildSelected(3)).toBe(true)
    })
  })

  describe("where some is initially selected", () => {
    beforeEach(() => {
      hand.selectChildAt(0)
      hand.selectChildAt(1)
      hand.selectChildAt(3)
    })
    test("all # case, where not everything is selected", () => {
      const cmd = new Deselect(hand)

      expect(hand.selectedChildren.length).toBe(3)

      cmd.execute(state, room)
      expect(hand.isChildSelected(0)).toBe(false)
      expect(hand.isChildSelected(1)).toBe(false)
      expect(hand.isChildSelected(2)).toBe(false)
      expect(hand.isChildSelected(3)).toBe(false)
      expect(hand.selectedChildren.length).toBe(0)

      cmd.undo(state, room)
      expect(hand.isChildSelected(0)).toBe(true)
      expect(hand.isChildSelected(1)).toBe(true)
      expect(hand.isChildSelected(2)).toBe(false)
      expect(hand.isChildSelected(3)).toBe(true)
      expect(hand.selectedChildren.length).toBe(3)
    })
  })
})

describe("Toggle", () => {
  test("single", () => {
    const cmd = new ToggleSelection(hand, 1)

    cmd.execute(state, room)
    expect(hand.isChildSelected(1)).toBe(true)

    cmd.undo(state, room)
    expect(hand.isChildSelected(1)).toBe(false)
  })

  test("twice", () => {
    new ToggleSelection(hand, 1).execute(state, room)
    new ToggleSelection(hand, 1).execute(state, room)

    expect(hand.isChildSelected(1)).toBe(false)
  })

  test("multiple", () => {
    const cmd = new ToggleSelection(hand, [0, 2, 3])

    cmd.execute(state, room)
    expect(hand.isChildSelected(0)).toBe(true)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.isChildSelected(2)).toBe(true)
    expect(hand.isChildSelected(3)).toBe(true)

    cmd.undo(state, room)
    expect(hand.isChildSelected(0)).toBe(false)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.isChildSelected(2)).toBe(false)
    expect(hand.isChildSelected(3)).toBe(false)
  })

  test("all", () => {
    const cmd = new ToggleSelection(hand)

    cmd.execute(state, room)
    expect(hand.isChildSelected(0)).toBe(true)
    expect(hand.isChildSelected(1)).toBe(true)
    expect(hand.isChildSelected(2)).toBe(true)
    expect(hand.isChildSelected(3)).toBe(true)

    cmd.undo(state, room)
    expect(hand.isChildSelected(0)).toBe(false)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.isChildSelected(2)).toBe(false)
    expect(hand.isChildSelected(3)).toBe(false)
  })
})

describe("Select/Deselect multiple commands", () => {
  test("single", () => {
    new Select(hand, 1).execute(state, room)
    expect(hand.countSelectedChildren()).toBe(1)
    expect(hand.isChildSelected(1)).toBe(true)
    expect(hand.getSelectionIndex(1)).toBe(0)

    new Select(hand, 3).execute(state, room)
    expect(hand.countSelectedChildren()).toBe(2)
    expect(hand.isChildSelected(3)).toBe(true)
    expect(hand.getSelectionIndex(3)).toBe(1)

    new Deselect(hand, 1).execute(state, room)
    expect(hand.countSelectedChildren()).toBe(1)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.getSelectionIndex(3)).toBe(0)

    new Deselect(hand, 3).execute(state, room)
    expect(hand.countSelectedChildren()).toBe(0)
    expect(hand.isChildSelected(3)).toBe(false)
  })

  test("multiple", () => {
    new Select(hand, [1, 2, 3]).execute(state, room)
    expect(hand.countSelectedChildren()).toBe(3)
    expect(hand.isChildSelected(0)).toBe(false)
    expect(hand.isChildSelected(1)).toBe(true)
    expect(hand.isChildSelected(2)).toBe(true)
    expect(hand.isChildSelected(3)).toBe(true)

    new Deselect(hand, [1, 3]).execute(state, room)
    expect(hand.countSelectedChildren()).toBe(1)
    expect(hand.isChildSelected(0)).toBe(false)
    expect(hand.isChildSelected(1)).toBe(false)
    expect(hand.isChildSelected(2)).toBe(true)
    expect(hand.isChildSelected(3)).toBe(false)
  })
})
