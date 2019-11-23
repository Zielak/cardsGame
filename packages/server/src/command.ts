import { State } from "./state"
import { Room } from "./room"
import { logs } from "@cardsgame/utils"

export interface Command {
  execute(state: State, room: Room<any>): Promise<void | Command[]>
}

export class Command {
  private _subCommands: Command[]
  public _name: string

  constructor(name?: string, subCommands?: Command[]) {
    this._name = name || `Some ${subCommands ? "compound" : "plain"} command`
    this._subCommands = subCommands
      ? subCommands.filter(c => typeof c === "object")
      : []
  }

  async execute(state: State, room: Room<any>): Promise<void | Command[]> {
    if (this._subCommands.length === 0) {
      logs.notice(`${this._name}, nothing to execute.`)
      return
    }

    logs.group(`Commands group: ${this._name}.execute()`)
    for (let i = 0; i < this._subCommands.length; i++) {
      const command = this._subCommands[i]
      const commandName = command._name || command.constructor.name

      logs.notice(`\t${commandName}: executing`)

      const result = await command.execute(state, room)
      if (Array.isArray(result)) {
        await new Command(commandName, result).execute(state, room)
      }
    }
    logs.groupEnd()
  }

  async undo(state: State, room: Room<any>) {
    if (this._subCommands.length === 0) {
      logs.notice(`${this._name}, nothing to undo.`)
      return
    }

    logs.group(`Commands group: ${this._name}.undo()`)
    for (let i = this._subCommands.length; i > 0; i--) {
      const command = this._subCommands[i]
      if (command.undo) {
        command.undo(state, room)
      }
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
