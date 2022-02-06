import { Command } from "../command"

export class Wait extends Command {
  constructor(private time: number) {
    super()
  }

  async execute(): Promise<void> {
    await new Promise<void>((res) => setTimeout(() => res(), this.time))
  }
}
