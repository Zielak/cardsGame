import { Command } from "../command.js"

export class Noop extends Command {
  async execute(): Promise<void> {}
}
