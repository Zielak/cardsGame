---
sidebar_position: 5
---

# Commands

Here we use **Command pattern**.

Commands modify the game state - the game state should never be modified directly.

A `Command` class is description of change in the game state.

**For example**, if player's intention is to move a card from his hand to the pile - you can use `ChangeParent` command:

```typescript
new commands.ChangeParent(myCard, pileOfCards)
```

## Commands within a command

Each command may spawn **sub-commands**, during their `execute()` method. This makes it possible to conditionally group a bunch of tiny actions into one command.

```typescript
execute(state, room) {
  this.subExecute(state, room, new MyOtherCommand())
  // ...
}
```

One built-in example of that would be `DrawOutUntil` command, which may `Flip` each drawn out card depending on constructor options.

You don't have to worry about manually undoing sub commands, `CommandsManager` knows when each command spawns sub commands and will take care of `undo()`ing everything for you.

> TODO: right now undo functionality is not handled. But write your code undo-friendly!

# Default commands explained

There are a bunch of basic commands already available, these should help you get up and running.

// TODO: white them down here or in a separate document?

# Create your own commands

Extend `Command` class, and ensure your command:

- remembers what its changing
- has `execute` method to perform the change
- and `undo` method to revert it

This example command will randomly push the item on its X axis and broadcast "hello" message to every player.

```ts title="MyCommand.ts"
import { Command, LocationTrait, Target, TargetsHolder } from "@cardsgame/server"

class MyCommand extends Command {
  private target: TargetsHolder<LocationTrait>
  // Objects X location before executing this command
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

    room.broadcast("message", `Hello ${this.name}!`)
  }

  async undo(state, room){
    this.target.get().x = this.lastX

    // We don't undo broadcasts, that's silly.
  }
}
```

Both `execute` and `undo` methods get direct references to game's `State` - which you can directly modify here, and `Room` - to access some room methods, eg: `broadcast()`.

When player performs a "legal" action, matching commands will be instantiated and executed by calling their `execute()` methods. Each executed command is then remembered in `CommandsManager` for history tracking and possibility to undo them.

## async `execute()` and `undo()`

Both execute and undo methods are async by default. This enables commands to take any time they need.

For example, you may want a 2 second break between showing users a message and finishing some action. You may code that delay yourself, or sub-execute `Wait` command, which does just that.

While a command is being executed, for however long, `CommandsManager` will not be taking any new actions from players. This prevents any unwanted collisions between commands.

:::caution TODO

Should CommandsManager stack incoming messages instead of simply ignoring them?

:::

## `TargetsHolder` and `Target`

## What should command "remember"

In command's instance you would want to store values which could be brought back into the game state with `undo` method.

When moving an item from A to B, your command should remember where the item came from, so you can precisely revert that action.

When changing plain variables in predictable way - like incrementing a number by set amount, or swapping `true` with `false` - you probably don't need to remember the exact "previous" value. History of all commands stays consistent and predictable. In the `undo` method you can just perform a reverse mathematic calculation, or swap boolean values again the same way:

```ts
async execute(state) {
  state.number += 10
  state.flipFlop = !state.flipFlop
}
async undo(state) {
  state.number -= 10
  state.flipFlop = !state.flipFlop
}
```
