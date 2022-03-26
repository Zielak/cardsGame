import { BotNeuron } from "@cardsgame/server"

import { PickCard } from "./actions"
import { WarState } from "./state"

export const JustPlayGoal: BotNeuron<WarState> = {
  name: "JustPlayGoal",
  description: "Bot can take only one action in this game. Click the deck!",
  value: () => 1,
  action: PickCard,
}
