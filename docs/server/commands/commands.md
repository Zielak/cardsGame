# Commands

Here we use **Command pattern**.

Commands modify the game state - the game state should never be modified directly.

A `Command` class is description of change in the game state. Command should remember what its changing, have `execute` method to perform the change and `undo` method to revert it. Both `execute` and `undo` methods get direct references to game's `State` - which you can directly modify here, and `Room` - to access some room methods, eg: `broadcast()`.

When player performs a "legal" action, matching commands will be instantiated and executed by calling their `execute()` methods. Each executed command is then remembered in `commandsManager` for history tracking and possibility to undo them.

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
