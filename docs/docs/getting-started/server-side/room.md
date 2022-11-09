---
sidebar_position: 1
---

# Room

Game room is your entry point. When first player connects to your server, a new game room will be created.

```ts title="./game/index.ts"
import { defineRoom } from "@cardsgame/server"

import { actions } from "./actions.js"
import { setupState } from "./setupState.js"
import { MyGameState } from "./state.js"

export default defineRoom("MyGame", {
  maxClients: 4,
  possibleActions: actions,

  onInitGame() {
    this.setState(setupState(new MyGameState()))
  },

  onStartGame(options) {
    return new commands.Broadcast("Let's start!")
  },
})
```

Rooms require at the very least:

- a list of actions players can make in a game, defined with `possibleActions`,
- and `onInitGame` which initiates the game's state and spawns all required game elements (in above example, _state preparation_ is extracted into separate file)

## Lifetime hooks

### `onInitGame(options?)`

Will be called right after the game room is created.

Create your game state here using: `this.setState(new MyState())`, and prepare your play area now.

```ts title="Example: Fresh game state with full deck of cards"
onInitGame() {
  this.setState(new MyGameState())

  const { state } = this

  const deck = new Deck(state, { name: "mainDeck" })
  standardDeckFactory().forEach(
    ({ suit, rank }) =>
      new ClassicCard(state, {
        parent: deck,
        suit,
        rank,
      })
  )
}
```

### `canGameStart(): boolean`

State your own conditions of whether the game can be started or not.

```ts title="Example: Wait for at least 2 players before starting the game"
canGameStart() {
  return this.allClientsCount === 2
}
```

### `onStartGame(state): void | Command[]`

Will be called when clients agree to start the game. At this stage [`state.players`](/api/server/classes/State#players) is already populated with all joined players (including [bots](bots)).

After this function, the game will give turn to the first player.

You can make this function return an array of commands to execute:

```ts title="Example: Deal cards to players when the game starts"
onStartGame() {
  const { state } = this

  // Create a "Hand" container for each player
  const hands = state.players.map(
    (player, idx) =>
      new Hand(state, {
        owner: player,
        ownersMainFocus: true,
        name: `player${idx}`,
      })
  )

  return [
    new commands.ShuffleChildren(state.deck),
    new commands.DealCards(state.deck, hands, { count: 5 }),
  ]
}
```

### `onRoundStart(): void | Command[]` and `onRoundEnd(): void | Command[]`

Both invoked when executing [NextRound](/api/server/classes/commands.NextRound) command, in order:

1. `onRoundEnd()`
2. [`state.round`](/api/server/classes/State#round) number is bumped up
3. `onRoundStart()`.

Return an array of commands if needed.

:::info

This example just illustrates the usage of `onRoundStart` hook. In reality, it would be much better to rely on client-side `state.round` updates to show a round change in UI.

:::

```ts title="Example: announce next round start."
onRoundStart() {
  const { state } = this

  return [
    new commands.Broadcast("announcement", `Round ${state.round} begins!`)
  ]
}
```

### `onPlayerTurnStarted(player): void | Command[]` and `onPlayerTurnEnded(player): void | Command[]`

This happens when executing [NextPlayer](/api/server/classes/commands.NextPlayer) command, which will:

1. Call `onPlayerTurnEnded(player)` with a reference to player whose turn just ended
2. Call `onPlayerTurnStarted(player)` with the next player to play.

Return an array of commands if needed.
