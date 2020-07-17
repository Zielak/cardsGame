# Create your own commands

You can just extend `Command` class, have your constructor and both `execute` and `undo` commands. But there's more you should know before you start.

This example command will randomly push the item on its X axis and broadcast "hello" message to every player. Continue reading below for explanation.

```typescript
import { Command, LocationTrait, Target, TargetsHolder } from "@cardsgame/server"

class MyCommand extends Command {
  private target: TargetsHolder<LocationTrait>
  private lastX: number
  private name: string

  constructor(
    target: Target<LocationTrait>
    name: string
  ) {
    this.target = new TargetsHolder<LocationTrait>(target)
    this.name = name
  }

  async execute(state, room) {
    this.lastX = this.target.get().x
    this.target.get().x += Math.random()*10

    room.broadcast({data: `Hello ${this.name}!`})
  }

  async undo(state, room){
    this.target.get().x = this.lastX

    // We don't undo broadcasts, that's silly.
  }
}
```

## `async`

Both execute and undo methods are async by default. This enables commands to take any time they need. For example, you may want a 2 second break between showing users a message and finishing some action. You may code that delay yourself, or sub-execute `Wait` command, which does just that. While a command is being executed, for however long, `CommandsManager` will not be taking any new actions from players. This prevents any unwanted collisions between commands.

## `TargetsHolder` and `Target`

## `LocationTrait` and Traits in general

## What should command "remember"

In command's instance you would want to store values which could be brought back into the game state with `undo` method.

When moving an item from A to B, your command should remember where the item came from, so you can precisely revert that action.

When changing plain variables in predictable way - like incrementing a number by set amount, or swapping true/false - you probably don't need to remember the exact "previous" value. History of all commands stays consistent and predictable. In the `undo` method you can just perform a reverse mathematic calculation, or swap boolean values again the same way:

```typescript
async execute(state) {
  state.number += 10
  state.flipFlop = !state.flipFlop
}
async undo(state) {
  state.number -= 10
  state.flipFlop = !state.flipFlop
}
```

> Note: It's okay to omit the second argument, because we're not using the `room` here.
