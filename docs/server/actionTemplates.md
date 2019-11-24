# Action Templates

With Action Templates you're helping to decipher players intention, after they click some item in the game.

Here's how a basic action may look like. It's and object with 5 properties:

```typescript
const MyAction: ActionTemplate<MyGameState> = {
  name: "MyAction",
  description: `I play something`,

  getInteractions: () => [
    {
      type: "deck"
    }
  ],

  getConditions: con => {
    con.is.playersTurn
  },

  getCommands: (state: MyGameState, event: ServerPlayerEvent) => {
    return NextPlayer()
  }
}
```

`name` and `description` are esimply just that.

## getInteractions

_With that elements is this action related to?_

Return an array of `InteractionDefinition` object. In each object describe either an entity, of which you want to capture an interaction, or provide a `command` or `event` name.

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
      name: "playersHand"
    }
  }
]

// Command "passTurn", most likely invoked by clicking a button.
return [{ command: "passTurn" }]

// It's an array, so you can provide multiple possibilities:
// Either click of a button, or click on a pile
return [
  {
    command: "discard"
  },
  {
    type: "pile",
    name: "mainPile"
  }
]
```

## getConditions

_Is players intention legal?_

Use `conditions`, first and only argument of this function, to define a set of rules for this action. If one of these rules fail, the action will be ignored.

`conditions` object has a reference to player's event and current game's state. You can use its pre-defined methods and properties to construct easily readable assertions.

```typescript
// You can name it `con` for short.
getConditions: con => {
  //
  con.is.playersTurn

  con
    .get(
      {
        owner: con.getPlayer(),
        type: "container"
      },
      {
        type: "hand"
      }
    )
    .as("chosenCards")

  con.get("chosenCards").children.not.empty
}
```

[Read more about Conditions](./conditions.md).

## getCommands
