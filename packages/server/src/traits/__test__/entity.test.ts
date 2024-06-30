import { State } from "@/state/state.js"

import { applyTraitsMixins, Entity } from "../entity.js"

let state: State

beforeEach(() => {
  state = new State()
})

describe("hooks", () => {
  it("calls postConstructor hook with state reference", () => {
    class HookTestTrait {}
    ;(HookTestTrait as any).hooks = {
      postConstructor: jest.fn(),
    }
    class HookTestEntity extends Entity<any> {}

    applyTraitsMixins([HookTestTrait])(HookTestEntity)

    new HookTestEntity(state)

    expect((HookTestTrait as any).hooks.postConstructor).toHaveBeenCalledTimes(
      1,
    )
    expect((HookTestTrait as any).hooks.postConstructor.mock.calls[0][0]).toBe(
      state,
    )
  })
})
