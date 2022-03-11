# `@cardsgame/server-testing`

Helps you test your server-side game logic.

- prepares game state and game entities according to your scenario
- helps mimic and test events sent by players
- executes your Actions so you can test the outcome

## Usage

One test file per Action you wanna test (example using Jest)

```ts
import { type ServerPlayerMessage } from "@cardsgame/server"
import { setupServerTesting } from "@cardsgame/server-testing"
// ...

let state: MyGameStateClass
let deckEvent: ServerPlayerMessage

// Initiate testing lib
const { reset, populateState, makeInteraction, testEvent } = setupServerTesting(
  { action: DrawCards }
)

beforeEach(() => {
  // Always reset state first.
  // Testing lib internally relies on updated references to the state object
  state = myOwnStateSetup()
  reset(state)

  // Create object to behave as "player touched deck of cards"
  deckEvent = makeInteraction({ type: "deck" })
})

test("drawing a card from deck", () => {
  // Populate state with some additional entities
  populateState([
    { type: "deck" },
    childrenNamed(["SA", "SK", "SQ", "SJ", "S10"]),
  ])

  // Test if your `DrawCards` action has proper conditions in place
  state.isGameStarted = true
  expect(testEvent(deckEvent)).toBe(true)

  state.isGameStarted = false
  expect(testEvent(deckEvent)).toBe(false)
})
```
