import { Command } from "../src/command"

class DummieCommand extends Command {
  execute = jest.fn()
  undo = jest.fn()
}
class SmarterCommand extends Command {
  constructor(public testCommand) {
    super()
  }
  async execute(state, room) {
    this.subExecute(state, room, this.testCommand)
  }
}

const state = {} as any
const room = {} as any

describe("constructor", () => {
  it(`figures out the name`, () => {
    expect(new DummieCommand().name).toBe("DummieCommand")
  })

  it(`remembers passed name`, () => {
    expect(new DummieCommand("testCommand").name).toBe("testCommand")
  })
})

describe("extended Command", () => {
  it(`executed injected sub commands`, async () => {
    const subCommand = new DummieCommand()
    const command = new SmarterCommand(subCommand)

    expect(subCommand.execute).not.toHaveBeenCalled()
    await command.execute(state, room)
    expect(subCommand.execute).toHaveBeenCalled()

    expect(subCommand.undo).not.toHaveBeenCalled()
    await command.undo(state, room)
    expect(subCommand.undo).toHaveBeenCalled()
  })
})
