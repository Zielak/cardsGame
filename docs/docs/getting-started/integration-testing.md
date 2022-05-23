---
sidebar_position: 20
---

# Integration testing

Allows you to setup your game room for testing specific cases.

Starting from client-side:

1. Create new room passing test name in options: `game.joinOrCreate("MyGame", { test: "testName" })`
1. New "MyGame" room is created
1. Server-side calls integration hooks named "testName"
1. Your game room is now ready for testing
1. Start the game, interact with it like usual and inspect the results

## Setup integration hooks

First you need to define integration hooks and what they'll do.

1. Create new directory in your server game package: `game-mygame-server/src/integration`
2. Create new file for your setup:

```ts title="/src/integration/attack3.ts"
export const attack3: IntegrationHooks<MyGameState> = {
  data: {
    shuffleDeck: false,
  },
  init: function (state, context) {
    state.attackPoints = 3

    const clients = ["test1", "test2"]
    clients.forEach((i) => context.addClient(i))
  },
}
```

[IntegrationHooks](/api/server/modules#integrationhooks) object defines [hooks callbacks](/api/server/modules#integrationhookcallback) and [persistent data](/api/server/modules#integrationhookdata):

### Hooks callbacks

- `init` - will be called during room creation, but after [onInitGame](/api/server/classes/Room#oninitgame), so your game state object is already prepared
- `startPre` - called right before the game starts. `state.isGameStarted` is already `true` and room's [onStartGame](/api/server/classes/Room#onstartgame) has not yet been called.
- `startPost` - called last during game start sequence, after [onStartGame](/api/server/classes/Room#onstartgame).

### Integration data

- `data` - an object for you to define additional flags available in the game's room. It'll be available in room's class under `this.currentIntegration.data` (readonly).

:::note Example

```ts title="/src/integration/attack3.ts"
export const attack3: IntegrationHooks<MyGameState> = {
  data: {
    shuffleDeck: false,
  },
  // ...
}
```

```ts title="/src/index.ts - Room class"
  onStartGame() {
    const { state } = this
    const { shuffleDeck } = this.currentIntegration.data

    return [
      shuffleDeck && new commands.ShuffleChildren(state.deck)
    ].filter(cmd => cmd)
  }
```

:::

## Add hooks to the Room

Hooks are defined so now we can pass them to the Room class. In example below we might keep many integration objects in one `/integration/attack.ts` file.

```ts title="/src/index.ts - Room class"
import * as integrationAttack from "./integration/attack"
import * as integrationUi from "./integration/ui"

export default class MyGame extends Room<MyGameState> {
  possibleActions = new Set<ActionTemplate<MyGameState>>(actions)

  integrationHooks = {
    ...integrationAttack,
    ...integrationUi,
  }
  // ...
}
```

## Run

With the server-side setup we can finally enter the game from client-side and see the game being prepared differently than usual:

```ts
game.joinOrCreate("MyGame", { test: "attack3" })
```

### Tips

What's left for you is to setup your own e2e testing environment.

1. Setup a test route in your webapp to quickly join the room with an integration test like: `locahost:8000/game/MyGame/autoplay?test=attack3`.

2. Make quick function to open up these URLs.

   ```ts
   // In my Cypress setup I've created a support function
   Cypress.Commands.add("testRoom", (roomName, testName) => {
     cy.visit(`/game/${roomName}/autoplay?test=${testName}`)
   })
   // And call it like so
   cy.testRoom("MyGame", "attack3")
   ```
