# Bots

A bot player ideally would need two things to make a decision:

- access to the game state - list of players, their items and any other items in play
- list of all possible moves it can make

In theory we could train some AI system to make its best decision based on just that.

Here I settled on a solution similar to **Utility AI**, which involves scoring each possible/legal move and executing an action with highest calculated value.

[Action Templates](./actionTemplates.md) gives bots a list of **all possible actions**. This by its own may not sometimes be ideal. For example: in game Makao, a single action describes "selecting a single card from player's hand". It doesn't progress the player in any way, a player then needs to finalize his choice by clicking main pile of cards OR by selecting more cards of the same kind.

## Bot guidance

It should include

- when should the bot react (in some games players may interrupt each other)
- what are the possible scenarios to take

## Bot players

There's no other special class to handle bot player. It's just `Player` with it's `clientID` in different format (?good idea?)
