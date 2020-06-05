import { Command } from "../command"

export class Wait extends Command {
  constructor(private time: number) {
    super()
  }

  async execute(): Promise<void> {
    await new Promise((res) => setTimeout(res, this.time))
  }
}
