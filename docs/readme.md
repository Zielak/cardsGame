# Documentation

Think of the games here like the real-life games: a pack of 52 cards, sometimes with jokers, or a box of chess pieces and checker board. Once you start the game, the number of game elements doesn't change. They're always there on the table and you don't spontaneously create new cards out of thin air.

Game elements are called `entities`. All entities and all their information are preserved in the `game state`. The information includes: their location, ownership to player, name, is it face up, etc. Entities are a mixture of `traits`, which enable them to hold such information but also can provide additional functionalities.

## Client-server communication

Player can interact either with game elements (entities) or UI elements. Such interaction should be converted to a message object by game author.

Client-side library sends a message to the server, where it is received and translated into player's intention.

From now `CommandsManager` takes this message and tries to figure out:

- is any other action still pending?
- does the interaction relate to any defined `actionTemplate`?
- will any pre-defined action's `conditions` allow to execute such interaction?

If commands manager finds at least one possible, legal, game action to take, it executes its `command` and keeps it in the history.

Commands job is mainly to change game state in some way. For example: move card to another container, change points on one player, or present player with some UI to make choice.

Such change is then sent back to all clients with state change event.

---

- ♥ kier - Hearts
- ♠ pik - Spades
- ♦ karo - Diamonds
- ♣ trefl - Clubs
