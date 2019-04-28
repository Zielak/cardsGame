import { ICommand } from "."

export class Noop implements ICommand {
  execute() {}
}
