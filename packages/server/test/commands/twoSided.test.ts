import type { Room } from "../../src"
import { FaceDown, FaceUp, Flip } from "../../src/commands/twoSided"
import { ClassicCard } from "../../src/entities"
import { State } from "../../src/state"
import { RoomMock } from "../helpers/roomMock"

let state: State
let room: Room<any>
let cards: ClassicCard[]

beforeEach(() => {
  state = new State()
  room = new RoomMock()
  cards = [
    new ClassicCard(state),
    new ClassicCard(state),
    new ClassicCard(state),
  ]
})

describe("FaceUp", () => {
  test("single card", () => {
    const cmd = new FaceUp(cards[0])

    cmd.execute(state, room)

    expect(cards[0].faceUp).toBeTruthy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()

    cmd.undo(state, room)

    expect(cards[0].faceUp).toBeFalsy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()
  })

  test("multiple cards", () => {
    const cmd = new FaceUp([cards[0], cards[2]])

    cmd.execute(state, room)

    expect(cards[0].faceUp).toBeTruthy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeTruthy()

    cmd.undo(state, room)

    expect(cards[0].faceUp).toBeFalsy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()
  })
})

describe("FaceDown", () => {
  test("single card", () => {
    const cmd = new FaceDown(cards[0])
    cards[0].faceUp = true

    cmd.execute(state, room)

    expect(cards[0].faceUp).toBeFalsy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()

    cmd.undo(state, room)

    expect(cards[0].faceUp).toBeTruthy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()
  })

  test("multiple cards", () => {
    const cmd = new FaceDown([cards[0], cards[2]])
    cards[0].faceUp = true
    cards[2].faceUp = true

    cmd.execute(state, room)

    expect(cards[0].faceUp).toBeFalsy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()

    cmd.undo(state, room)

    expect(cards[0].faceUp).toBeTruthy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeTruthy()
  })
})

describe("Flip", () => {
  test("single card", () => {
    const cmd = new Flip(cards[0])

    cmd.execute(state, room)

    expect(cards[0].faceUp).toBeTruthy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()

    cmd.undo(state, room)

    expect(cards[0].faceUp).toBeFalsy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeFalsy()
  })

  test("multiple cards", () => {
    const cmd = new Flip(cards)
    cards[0].faceUp = true
    cards[1].faceUp = false
    cards[2].faceUp = true

    cmd.execute(state, room)

    expect(cards[0].faceUp).toBeFalsy()
    expect(cards[1].faceUp).toBeTruthy()
    expect(cards[2].faceUp).toBeFalsy()

    cmd.undo(state, room)

    expect(cards[0].faceUp).toBeTruthy()
    expect(cards[1].faceUp).toBeFalsy()
    expect(cards[2].faceUp).toBeTruthy()
  })
})
