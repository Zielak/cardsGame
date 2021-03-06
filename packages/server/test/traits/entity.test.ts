import { State } from "../../src/state/state"
import { applyTraitsMixins, Entity } from "../../src/traits/entity"

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

    expect((HookTestTrait as any).hooks.postConstructor).toBeCalledTimes(1)
    expect((HookTestTrait as any).hooks.postConstructor.mock.calls[0][0]).toBe(
      state
    )
  })
})
