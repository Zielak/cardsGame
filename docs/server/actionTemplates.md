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

  checkConditions: (con) => {
    con.is.playersTurn
  },

  getCommand: (state: MyGameState, event: ServerPlayerEvent) => {
    return ChangeParent(
      () => state.deck.getTop(),
      state.query<Hand>({ owner: event.player })
    )
  },
}
```

> NOTE: `MyGameState` here would refer to your game's `State` class.

`name` and `description` are simply just that.

## interactions

_With what elements is this action related to?_

Describe what kind of elements relate to this actions. Don't mind about player's event and ownerships here. This is just the first place to quickly filter out unwanted actions.

Return an array of `InteractionDefinition` objects. In each object describe either an entity, of which you want to capture an interaction, or provide a `command` name.

An entity can be described by any of its props. You can also describe `parent` of each entity the same way.

```typescript
// Interaction with any deck
return [{ type: "deck" }]

// Any deck named 'mainDeck'
return [{ type: "deck", name: "mainDeck" }]

// Any classic card, sitting in container named 'playersHand'
return [
  {
    type: "classicCard",
    parent: {
      name: "playersHand",
    },
  },
]

// Command "passTurn", most likely invoked by clicking a button.
return [{ command: "passTurn" }]

// It's an array, so you can provide multiple possibilities:
// Either click of a button, or click on a pile
return [
  {
    command: "discard",
  },
  {
    type: "pile",
    name: "mainPile",
  },
]
```

> NOTE: A single `InteractionDefinition` is either an object of [`QuerableProps`](./types.md#QuerableProps) type or an object describing a command: `{ command: "commandName" }`.

## checkConditions

_Is players intention legal?_

Use [`conditions`](./conditions.md), first and only argument of this function, to define a set of rules for this action. If one of these rules fail, the action will be ignored.

[`conditions`](./conditions.md) object has a reference to player's event and current game's state. You can use its pre-defined methods and properties to construct easily readable assertions.

```typescript
// You can name it `con` for short.
checkConditions: (con) => {
  con.is.playersTurn

  // Grab current player's `hand` and remember it
  // under alias "chosenCards"
  con
    .get({
      type: "hand",
      parent: {
        owner: con.getPlayer(),
        type: "container",
      },
    })
    .as("chosenCards")

  // Change subject to previously remembered "chosenCards"
  // and ensure its got nothing inside.
  con.get("chosenCards").children.not.empty()
}
```

If any of these conditions fail, the whole action is disregarded, and internal CommandsManager will simply try checking the next available Action Template.

[Read more about Conditions](./conditions.md).

## getCommand
