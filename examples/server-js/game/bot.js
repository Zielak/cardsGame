const { PickCard } = require("./actions")

/**
 * @type {import("@cardsgame/server").BotNeuron}
 */
const JustPlayGoal = {
  name: "JustPlayGoal",
  description: "Bot can take only one action in this game. Click the deck!",
  value: () => 1,
  action: PickCard,
}

module.exports = [JustPlayGoal]
