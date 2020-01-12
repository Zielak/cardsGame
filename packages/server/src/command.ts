import { logs } from "@cardsgame/utils"

import { State } from "./state"
import { Room } from "./room"

export interface Command {
  execute(state: State, room: Room<any>): Promise<void | Command>
}

export class Command {
  private _subCommands: Command[]
  private _name: string
  get name(): string {
    return this._name
  }

  /**
   * @param name provide only if you're using `new Command()` syntax. If you're extending command, just leave it empty - the name will be grabbed from class name.
   * @param subCommands
   */
  constructor(name?: string, subCommands?: Command[]) {
    this._name = name || this.constructor.name

    this._subCommands = subCommands
      ? subCommands.filter(c => typeof c === "object")
      : []
  }

  /**
   * Run only registered sub commands.
   * Commands extending from this class should override
   * this function and NOT call super() to here.
   * @param state
   * @param room
   */
  async execute(state: State, room: Room<any>): Promise<void> {
    if (!this._subCommands) {
      return
    }

    logs.group(`Commands group: ${this.name}._executeSubCommands()`)
    for (let i = 0; i < this._subCommands.length; i++) {
      const command = this._subCommands[i]

      logs.notice(`- ${command.name}: executing`)

      await command.execute(state, room)
    }
    logs.groupEnd()
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    if (this._subCommands.length === 0) {
      logs.verbose(`${this.name}, nothing to undo.`)
      return
    }

    logs.group(`Commands group: ${this.name}.undo()`)
    for (let i = this._subCommands.length - 1; i >= 0; i--) {
      const command = this._subCommands[i]
      if (command.undo) {
        logs.notice(`- ${command.name}: undoing`)
        await command.undo(state, room)
      } else {
        logs.warn(`- ${command.name} doesn't have undo()!`)
      }
    }
    logs.groupEnd()
  }

  /**
   * Execute a sub command.
   * Call ONLY during your commands `execute` method.
   * Will also remember it internally for undoing.
   */
  protected async subExecute(
    state: State,
    room: Room<any>,
    command: Command
  ): Promise<void> {
    this._subCommands.push(command)
    await command.execute(state, room)
  }
}

export type Targets<T> = T | T[] | (() => T | T[])
export class TargetsHolder<T> {
  constructor(private value: Targets<T>) {}
  get(): T[] {
    const targets =
      typeof this.value === "function" ? (this.value as () => T)() : this.value

    return !Array.isArray(targets) ? [targets] : targets
  }
}

export type Target<T> = T | (() => T)
export class TargetHolder<T> {
  constructor(private value: Target<T>) {}
  get(): T {
    return typeof this.value === "function"
      ? (this.value as () => T)()
      : this.value
  }
}
