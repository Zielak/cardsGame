# Conditions

Conditions are inspired by Chai Assertion Library.

Conditions are mainly used in [Action Templates](./actionTemplates.md#checkConditions), in their `checkConditions` methods.

## Subject change

With each statement you're going to check if _something_ matches your expectations/game rules. Each statement has its **subject**, which by default is the game state itself. You can change current **subject** at any time, to check many things in the game.

```typescript
con("player").its("name").equals("Bob")
con({ type: "deck" }).top.its("rank").is.oneOf(["S", "C"])
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

### `get(props: QuerableProps)`

Changes subject to an entity described by object of props ([`QuerableProps`](./types.md#QuerableProps)).

### `as(reference: string)`

**Must be chained after `get()`.** Remembers current subject under given reference name. The subject can be later brought back using `get("refName")`.

```typescript
con.get({ type: "deck" }).as("deck")
con.get("deck").is.not.empty()
```

Such references can be used throughout whole `checkConditions()` function. Once it ends, the main `conditions` object is destroyed and all references are lost. So you can't re-use the same alias in different Action Templates.

### `get(alias: string)`

Bring back the subject by its previously remembered reference.

### `get(alias: string, props: QuerableProps)`

Similar to `get(props)`, but it's starting point is an entity remembered by a reference string, instead of the whole state.

### `its(key: string)`

Changes subject to current subjects key.

```typescript
// On state
con().its("round").above(10)

// On an entity
con({ type: "deck" }).its("angle").equals(90)

// Or anything else
con
  .set({
    propA: "foo",
    propB: "bar",
  })
  .its("propB")
  .equals("bar")
```

### `children`

Gets children of current subject (must be an entity) as an array and sets it as new current subject.

### `nthChild(index: number)`

Changes subject to a child at given index. Previous subject must be an object (entity with children or an array).

### `bottom` and `top`

Sets top/bottom child element as new subject. Previous subject could be an entity or anything else with "length" property (array, string, ...)

### `length`

Sets the "length" value (number) of current subject as the new subject. Parent entities don't have "length", use `childrenCount` instead.

### `childrenCount`

Sets current subjects number of children as the new subject. Previous subject must be an entity.

## Checking values

## Grouping

### `every(predicate)`

Loops through every item in subject's collection.
Each item is set as the `subject` with each iteration automatically.
After all iterations are done, the `subject` will be reset back to what it originally was.
If one of the items fail any assertions, whole `every` block fails.

Predicate here is a function in style of native `array.forEach`, but first argument is new Conditions instance. This `con` will have its own subject set to each item of current subject.

```typescript
// Current subject is state, we change it to "hand"
con.get("hand").children.every((con, item, index, array) => {
  // Current subjects here are the children of "hand"
  con.its("type").equals("classicCard")
  con.its("rank").oneOf(["2", "3"])
})
```

## Chaining

You can continue your assertions using chain words, to construct neat, human-readable sentences.

`has`, `to,` `is`, `be`, `and`.

## Negation

Property `not` exists to negate any further assertions.
