import { Command } from "../command"

export class Noop extends Command {
  async execute() {}
}
