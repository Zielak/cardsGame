# Bots

Bots, just like human players, can't break the rules defined by [Action Templates](./action-templates). They also can't make decisions fully autonomously, so they need your guidance for each game.

## Setup in Room

Define `botActivities` array in your [`Room`](./room) class.

:::tip

Ideally you could have this array extracted in a separate folder with all "bot-related" things

:::

```ts title="bots/index.ts"
import PlayCardGoal from "./playCardGoal.ts"
import DrawCardGoal from "./drawCardGoal.ts"

export const allBotGoals: BotNeuron<MyGameState> = [PlayCardGoal, DrawCardGoal, ...];
```

```ts title="index.ts"
import { allBotGoals } from "./bots/index"

class MyGame extends Room<MyGameState> {
  botActivities = allBotGoals
}
```

## How bots take action

Bots will be asked to decide on their goals at many events:

- new round starts
- bot's turn just started
- any message sent to the room

This allows bots to take actions not only during their own turns, but also try **interrupting other players** if the game is designed as non-turn-based.

Each neuron will first be checked if it's possible to run by evaluating its own "conditions". Then, each neuron is sorted by the results of their "value" functions. Lastly, in order from _most valuable_, neurons will be simulated to execute its assigned `ActionTemplate` (for example, by _clicking_ all related cards).

Neuron which was possible to simulate will be sent to the Room with prepared `event`, the same way human players send events to the Room. This ensures bots follow the same rules human players do.

## BotNeuron

A Neuron must either be assigned with an `ActionTemplate` or be a parent for other "child" neurons. This allows for grouping complex, multi-step interactions within one Neuron, for example: click to select card -> click the pile to play that card -> answer UI popup.
