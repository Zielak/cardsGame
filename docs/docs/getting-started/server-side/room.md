# Room

Game room is your entry point. When first player connects to your server, a new game room will be created.

```ts title="./game/room.ts"
import { Room } from "@cardsgame/server"

import { MyGameState } from "./state"
import { actions } from "./actions"

class MyGame extends Room {
  maxClients = 4
  possibleActions = new Set(actions)

  onInitGame() {
    this.setState(new MyGameState())
  }

  onStartGame() {
    return new commands.Broadcast("Let's start!")
  }
}
```

:::danger

I will be re-working `Room` class, so it's easier to create custom rooms and less prone to mistakes. Extending base class isn't best idea here.

Ticket: https://www.notion.so/darekgreenly/Extending-Room-confusion-38862d90a9524d45bfdb24242d66bb37

:::
