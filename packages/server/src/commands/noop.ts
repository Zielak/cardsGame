import { ICommand } from "../command"

export class Noop implements ICommand {
  execute() {}
}
