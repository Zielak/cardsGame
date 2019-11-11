import { Command } from "../command"

export class Noop extends Command {
  _name = "Noop"
  async execute() {}
}
