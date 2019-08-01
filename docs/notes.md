# notes

- ♥ kier - Hearts
- ♠ pik - Spades
- ♦ karo - Diamonds
- ♣ trefl - Clubs

# TODO

[ ] - Merge ActionTemplate `interaction` and `conditions`...?

# Visibility status journey

An entity can be visible:

- to all, no exeptions
- to nobody
- only to owner

1. When priv prop value changes -> I should send an update to all clients, which its visible to.
2. When element changes its OWNER, ALL private props should be sent to new owner immediatelly. Probably no need to send "removal" update to last owner (?)

- changing `@privateAttribute` goes through that decorator's setter
- which in turn emits `"privateAttributeUpdate"` event on itself with propName

---

> Archival notes. Keeping just for fun

### Server side

- `room` gets inited -> setupPrivatePropsSync()
- `room` sets listener on `state` for `"ownerUpdate"` event
- `Entity` emits `"ownerUpdate"` when its parent changes
- `room` catchese that and sends `"privateAttributeUpdate"` update to client

### Client side

- `room` catches message with `"privateAttributeUpdate"` and calls

# Interaction target brainstorm

// Probably solved and working

right now I have some solution on the cilent, overriding PIXI's interaction getter.
but maybe I should be doing it on the server.

1. Client always clicks something, top-most card in deck, middle card in deck or maybe a deck itself (empty or filled with cards)

2. Cards in the middle shouldn't be "interaction targets" of the user. "pick nth card from deck" should not be a focus right now, and could be handled by game author.

3. Picking deck can have different meanings:

- I wish to pick top-most card,
- I wish to place some card here.

  how to decipher that? I could always point to DECK, and let game author decipher intention in `Command`s

- there are no cards, so I probably want to put
- there are some cards, but I could pick one or place one there
