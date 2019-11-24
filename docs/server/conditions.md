# Conditions

Conditions are inspired by Chai Assertion Library.

Conditions are mainly used in [Action Templates](./actionTemplates.md#getConditions), in their `getConditions` methods.

## Subject change

With each statement you're going to check if _something_ matches your expectations/game rules. Each statement has its **subject**, which by default is the game state itself. You can change current **subject** at any time, to check many things in the game.

```typescript
con.state
con.player.its("name").is.equal("Testing")
```

Below properties and methods will change current subject to be tested.

### `state`

Property changes current subject back to game's state.

### `player`

Changes subject to a player of current interaction.

### `entity`

Changes subject to interacted entity.

### `set(newSubject)`

Sets new subject to whatever you provide, can be anything.

### `get(...props: QuerableProps[])`

Function expects objects of props ([`QuerableProps`](./types.md#QuerableProps)).

### `as(reference: string)`

Remembers current subject under given reference name. The subject can be later brought back using `get("refName")`.

Such references can be used throughout whole `getConditions()` function. In the end, the main `conditions` object is destroyed and all references are lost. So you can't re-use the same alias in different Action Templates.

### `get(alias: string)`

Bring back the subject by its previously remembered reference.

### `get(alias: string, ...props: QuerableProps[])`

Similar to `get(...props)`, but it's starting point is an entity remembered by a reference string.

## Chaining

You can continue your assertions using chain words, to construct neat, human-readable sentences.

`has`, `to,` `is`, `be`, `and`.

## Negation

Property `not` exists to negate any further assertions.
