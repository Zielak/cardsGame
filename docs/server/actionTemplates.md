# Action Templates

With Action Templates you're helping to decipher players intention, after they click some item in the game. Player may interact with UI in many different ways at any time they wish. It's our job to filter out "illegal" moves.

Here's how a basic action may look like. It's simply an object:

```typescript
const TakeOneCard: ActionTemplate<MyGameState> = {
  name: "TakeOneCard",
  description: `Player grabs new card from the deck`,

  interactions: () => [
    {
      type: "deck",
    },
  ],

  conditions: (con) => {
    con.is.playersTurn
  },

  getCommand: (state, event) => {
    return commands.ChangeParent(
      () => state.deck.getTop(),
      state.query<Hand>({ owner: event.player })
    )
  },
}
```

> NOTE: `MyGameState` here would refer to the game's own `State` class.

`name` and `description` are simply just that.

## interactions

Interactions definition may relate to player interacting with an in-game object, or sending a custom command.

### A) _Player interacts with a game object_

Describe what kind of elements relate to this actions by any of their props. This is just the first place to quickly filter out unrelated interactions. Here you would define `interactions` as a function which returns an array of `QuerableProps`.

Think of `QuerableProps` as a search query.

```typescript
// Try executing this action when player
// taps any deck named "mainDeck"
interactions: () => [{ type: "deck", name: "mainDeck" }]

// Any classic card,
// of suit either Hearth or Spades,
// sitting inside a container named "playersHand"
interactions: () => [
  {
    type: "classicCard",
    suit: ["H", "S"],
    parent: {
      name: "playersHand",
    },
  },
]
```

This function will also be provided with the `Player` - reference to the currently interacting player. Use that to quickly query for ownership.

```typescript
// Any deck which belongs to interacting player
interactions: (player: Player) => [
  {
    type: "deck",
    owner: player,
  },
]
```

// TODO: link that somewhere?
Read the full description of `QuerableProps`.

### B) _Player is sending a custom command_

Custom command may relate to user clicking some UI button, but it's completely up to you. In `interactions` field provide the name of desired event.

```typescript
interactions: "passTurn"
```

Such events may also come with some details in `data` field. That can be asserted in the next step: "conditions".

## conditions

_Is players intention legal?_

Use [`conditions`](./conditions.md), first and only argument of this function, to define a set of rules for this action. If one of these rules fail, the action will be ignored.

[`conditions`](./conditions.md) object has a reference to the player, their whole event object and current game's state. You can use its API to construct easily readable assertions.

```typescript
// Example for card interaction
// You can name it `con` for short.
checkConditions: (con) => {
  con().itsPlayersTurn()

  // Grab current player's `hand` and remember it
  // under alias "chosenCards"
  con({
    type: "hand",
    parent: {
      owner: con.getPlayer(),
      type: "container",
    },
  }).as("chosenCards")

  // Change subject to previously remembered "chosenCards"
  // and ensure its got nothing inside.
  con("chosenCards").children.not.empty()
}

// Example for custom command with expected additional data
checkConditions: (con) => {
  con().itsPlayersTurn()
  con("data").its("suit").equals("S")
}
```

If any of these conditions fail, the whole action is disregarded, and internal CommandsManager will simply try checking the next available Action Template.

[Read more about Conditions](./conditions.md).

## command

Construct and return an actual `Command` to execute.

```typescript
command: (state, event) => {
  const source = state.query<Hand>({
    type: "hand",
    owner: event.player,
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
