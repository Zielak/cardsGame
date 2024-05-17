---
sidebar_position: 3
---

# Action Templates

Game's [`Room`](./room) holds a set of all action templates in `possibleActions` set.

With Action Templates we're _codifying_ game rules - they're helping decipher players' intention during play. Players may interact with UI in many different ways at any time they wish. It's our job to filter out "illegal" moves.

There are many kinds of actions, and in general they consist of:

- `interaction` - _what did client touch/say?_
- `conditions` - _can client perform this action at this moment?_
- `command` - _what exactly should be done?_

Here's how a basic Entity Action may look like:

```ts title="./actions/takeOneCard.ts"
import { commands, defineEntityAction } from "@cardsgame/server"
import { Deck, Hand } from "@cardsgame/server/entities"

import { MyGameState } from "../state.js"

/**
 * Player grabs new card from the deck
 */
export const TakeOneCard = defineEntityAction<MyGameState>({
  name: "TakeOneCard",

  interaction: () => [{ type: "deck" }],

  conditions: (test) => {
    test("It's not your turn yet!").itsPlayersTurn()
  },

  command: ({ state, player }) => {
    const topDeck = state.query<Deck>({ type: "deck" }).getTop()
    const playersHand = state.query<Hand>({ owner: player })

    return new commands.Sequence([
      new commands.ChangeParent(topDeck, playersHand),
      new commands.NextPlayer(),
    ])
  },
})
```

## 1. Interaction

Interactions definition may relate to player interacting with an in-game object, or sending a custom command by clicking some UI element.

### A) _Player interacts with game entity_

Define `interaction` as a function which returns an array of `QuerableProps`.

:::danger TODO: link that somewhere?

Read the full description of `QuerableProps`.

:::

```ts
interaction: (messageContext: ClientMessageContext<State>) => QuerableProps[] | "*"
```

Describe what kind of elements relate to this action by their props. This is the first place to quickly filter out unrelated interactions. Reference to `player` is provided if you need to query by ownership.

#### Examples

```ts
// Any deck which belongs to interacting player
interaction: ({ player }) => [
  {
    type: "deck",
    owner: player,
  },
]
```

```ts
// Try executing this action when player
// taps any deck named "mainDeck"
interaction: () => [{ type: "deck", name: "mainDeck" }]
```

```ts
// Any classic card,
// of suit either Hearth or Spades,
// sitting inside a container named "playersHand"
interaction: () => [
  {
    type: "classicCard",
    suit: ["H", "S"],
    parent: {
      name: "playersHand",
    },
  },
]
```

```ts
// React on any entity interaction
// Rely on Conditions to figure out if this action should be performed
interaction: () => "*"
```

### B) _Player is sending a custom messge_

Custom message may relate to user clicking some UI button, but it's completely up to you.

```ts
interaction: string
```

#### Example

In `interaction` field provide the name of event related to this action:

```ts
interactions: "passTurn"
```

Client may send more details available in `data` field of the message (typed `ClientPlayerMessage`), which will be available to be asserted in the next step: "conditions".

## 2. `conditions`

_Is players intention legal?_

Use [`conditions` framework](./conditions.md), passed as first argument of `conditions` function, to define a set of rules for this action. If one of these rules fail, the action will be ignored.

[`conditions`](./conditions.md) have references to the player, their whole event object and current game's state. You can use its API to construct easily readable assertions.

```ts
// Example for card interaction
// You can name it `con` for short.
conditions: (test, { player }) => {
  test().itsPlayersTurn()

  // Grab current player's `hand` and remember it
  // under alias "chosenCards"
  test().remember("chosenCards", {
    type: "hand",
    parent: {
      owner: player,
      type: "container",
    },
  })

  // Change subject to previously remembered "chosenCards"
  // and ensure its got nothing inside.
  test().get("chosenCards").children.is.not.empty()
}

// Example for custom command with expected additional data
conditions: (con) => {
  test().itsPlayersTurn()
  // When client sent data as `{ "suits": "S" }`
  test().subject.data.its("suit").equals("S")
}
```

If any of these conditions fail, the whole action is disregarded, and internal CommandsManager will simply try checking the next available Action Template.

[Read more about Conditions](./conditions.md).

## 3. `command`

Construct and return an actual `Command` to execute.

```ts
command: ({ state, player }) => {
  const source = state.query<Hand>({
    type: "hand",
    owner: player,
  })
  const cards = source.getSelectedChildren<ClassicCard>()
  const pile = state.query<Pile>({ type: "pile" })

  return new commands.Sequence("PlayCards", [
    new commands.ChangeParent(cards, pile),
    new commands.FaceUp(cards),
    new commands.NextPlayer(),
  ])
},
```
