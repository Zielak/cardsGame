import { State } from "@/state/state.js"

import { Room } from "../base.js"
import { defineRoom } from "../defineRoom.js"

const TestVariantRoom = defineRoom("TestVariantRoom", {
  variantsConfig: {
    defaults: {
      foo: "bar",
    },
  },
})

let room: Room<State>

beforeEach(() => {
  room = new TestVariantRoom()
  room.setPatchRate(0)
  room.clients = []
  room.state = new State()
  room.stateConstructor = State
})

describe("onCreate", () => {
  it("applies variant defaults into state", () => {
    room.onCreate()
    expect(room.state.variantData["foo"]).toBe(
      room.variantsConfig.defaults["foo"],
    )
  })
})
