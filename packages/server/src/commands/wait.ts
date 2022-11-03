import { Command } from "../command.js"

export class Wait extends Command {
  constructor(private readonly time: number) {
    super()
  }

  async execute(): Promise<void> {
    await new Promise<void>((res) => setTimeout(() => res(), this.time))
  }
}
