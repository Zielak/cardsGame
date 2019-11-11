import { Command } from "../command"

export class Wait extends Command {
  _name = "Wait"

  constructor(private time: number) {
    super()
  }

  async execute() {
    await new Promise(res => setTimeout(res, this.time))
  }
}
