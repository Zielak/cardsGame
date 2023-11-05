import { defineRoom, Room, State } from "@cardsgame/server"

import { Reset, reset, resetSetup } from "../reset"

import { TestState } from "./helpers"

const onInitGameMock = jest.fn()
const stateConstructor = TestState
const roomConstructor = defineRoom("TestingRoom", {
  onInitGame: onInitGameMock,
  stateConstructor,
})

let state: State
let room: Room<State>
let resetInner: Reset<State, Room<State>>
const callback = jest.fn((resetRoom, resetState) => {
  room = resetRoom
  state = resetState
})

beforeEach(() => {
  resetInner = resetSetup(callback, roomConstructor)

  onInitGameMock.mockReset()
})

describe("resetSetup", () => {
  it("makes it call callback with room and new state", () => {
    resetInner()

    expect(callback).toHaveBeenCalledWith(room, state)
  })

  it("uses correct room constructor", () => {
    resetInner()

    expect(room instanceof roomConstructor).toBe(true)

    resetInner = resetSetup(callback)
    resetInner()

    expect(room instanceof roomConstructor).toBe(false)
  })

  it("uses correct state constructor", () => {
    resetInner()

    expect(state instanceof TestState).toBe(true)
    expect(state.name).toBe("CustomTestState")

    resetInner = resetSetup(callback)
    resetInner()

    expect(state instanceof TestState).toBe(false)
    expect(state instanceof State).toBe(true)
    expect(state.name).toBe("Unnamed")
  })
})

describe("reset", () => {})

describe("callOnInitGame", () => {
  it("overwrites room.onInitGame", () => {
    resetInner({ callOnInitGame: false })
    expect(onInitGameMock).not.toHaveBeenCalled()
  })
  it("allows to call original room.onInitGame", () => {
    resetInner({ callOnInitGame: true })
    expect(onInitGameMock).toHaveBeenCalled()
  })
})
