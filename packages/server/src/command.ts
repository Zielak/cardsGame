import { State } from "./state"
import { Room } from "./room"
import { logs } from "@cardsgame/utils"

export interface Command {
  execute(state: State, room: Room<any>): Promise<void | Command>
}

export class Command {
  private _subCommands: Command[]
  private _name: string
  get name() {
    return this._name
  }

  constructor(subCommands?: Command[]) {
    this._name = this.constructor.name

    this._setSubCommands(subCommands)
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    this._executeSubCommands(state, room)
  }

  async undo(state: State, room: Room<any>) {
    if (this._subCommands.length === 0) {
      logs.verbose(`${this.name}, nothing to undo.`)
      return
    }

    logs.group(`Commands group: ${this.name}.undo()`)
    for (let i = this._subCommands.length; i > 0; i--) {
      const command = this._subCommands[i]
      if (command.undo) {
        logs.notice(`- ${command.name}: undoing`)
        command.undo(state, room)
      } else {
        logs.warn(`- ${command.name} doesn't have undo()!`)
      }
    }
    logs.groupEnd()
  }

  /**
   * Call this to execute sub commands.
   * Will remember them internally here and execute them in place.
   * @param state
   * @param room
   * @param commands
   */
  async subExecute(state: State, room: Room<any>, commands: Command[]) {
    this._setSubCommands(commands)
    await this._executeSubCommands(state, room)
  }

  /**
   * Set the list of sub commands, filter out any dirt.
   * @private
   * @param commands
   */
  private _setSubCommands(commands: Command[]) {
    this._subCommands = commands
      ? commands.filter(c => typeof c === "object")
      : []
  }

  protected addSubCommand(command: Command) {
    this._subCommands.push(command)
  }

  /**
   * Executes every planned sub commands.
   * @private
   * @param state
   * @param room
   */
  private async _executeSubCommands(state: State, room: Room<any>) {
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
