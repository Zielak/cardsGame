---
sidebar_position: 3
---

# Gameplay Conditions

Conditions are inspired by Chai Assertion Library. It is provided in [Action Templates](./action-templates) and [Bot's Neuron](./bots#botneuron) `conditions` methods.

```ts
conditions: (con: Conditions) => {
  con().itsPlayersTurn();
},
```

Given player's interaction and current state of the game, **conditions** help the game figure out which action can be taken right now.

## Subject change

With each statement you're going to check if _something_ matches your expectations/game rules. You can do that by switching **current subject** to some game element, player's status, value of some prop on game state or anything else.

Default **subject** is always the root game state, and it is reset every time you begin with `con()`.

You can change current **subject** by using many props and functions:

```ts title="Checking player's name is 'Bob'"
con().get("player").its("name").equals("Bob")

// explained:

con()
  // changes subject to something by alias "player"
  .get("player")
  // changes subject to a prop "name" of previous subject, effectively: player['name']
  .its("name")
  // asserts player's name is "Bob"
  .equals("Bob")
```

```ts title="Checking the topmost card on deck is of rank Spades or Clubs"
con().get({ type: "deck" }).top.its("rank").is.oneOf(["S", "C"])

// explained:

con()
  // changes subject to entity matching the "type" by querying whole game state
  .get({ type: "deck" })
  // changes subject to the last/topmost child of previously found entity
  .top // changes subject to last entity's "rank" prop
  .its("rank")
  // asserts prop value
  .is.oneOf(["S", "C"])
```

### Initial subjects

There are quick references for couple of objects you can use to start construction your assertions. You can access them with `subject` or even shorter with `$`.

```ts
con().subject.entity.its("name").equals("mainDeck")
// This is the same
con().$.entity.its("name").equals("mainDeck")
```

#### `entity`

Changes subject to interacted entity.

#### `player`

Changes subject to a player of current interaction.

#### `data`

Changes subject to extra data sent with an event.

You may have a UI interaction which would send extra data:

```ts
con().subject.data.oneOf(["5", "6", "7", "8", "9", "K", "A"])
```

### Changing subjects

#### `set(newSubject)`

Sets new subject to whatever you provide, can be anything.

#### `query(props: QuerableProps)`

Looks for a child entity by their `props` using [`QuerableProps`](/api/server/interfaces/QuerableProps), starting from current subject.

#### `as(reference: string)`

Remembers current subject under given reference name. The subject can be later brought back using `get("refName")`.

```typescript
con.get({ type: "deck" }).as("deck")
con.get("deck").is.not.empty()
```

Such references can be used throughout whole `checkConditions()` function. Once it ends, the main `conditions` object is destroyed and all references are lost. So you can't re-use the same alias in different Action Templates.

#### `remember(alias: string, props: QuerableProps)

Alternative way for remembering an entity by alias.

Remembers subject found by [`QuerableProps`](/api/server/interfaces/QuerableProps) with a given alias. Won't start looking for (querying) new subject if given alias is already populated with something (for performance!).

```ts
// First call, queries state for entity named "deck"
con().remember("aliasToDeck", { name: "deck" })
// Won't perform the lookup again, as we already remember "aliasToDeck"
con().remember("aliasToDeck", { name: "deck" })
```

#### `get(alias: string)`

Bring back the subject by its previously remembered reference.

#### `its(key: string)`

Changes subject to current subject's key/prop value.

```typescript
// On state
con().its("round").above(10)

// On an entity
con({ type: "deck" }).its("angle").equals(90)

// Or anything else
con()
  .set({
    propA: "foo",
    propB: "bar",
  })
  .its("propB")
  .equals("bar")
```

#### `children`

Gets children of current subject (must be an entity) as an array and sets it as new current subject.

#### `bottom` and `top`

Sets top (last) or bottom (first) child element as new subject. Previous subject could be an entity or array.

#### `itsLength`

Sets the "length" value (number) of current subject as the new subject.

Previous subject could be anything with "length" property, so array, string, etc. Container entities don't have "length" property, use `childrenCount` instead.

#### `childrenCount`

Sets current subject's number of children as the new subject. Previous subject must be a container entity.

#### `nthChild(index: number)`

Changes subject to a child at given index. Previous subject must be an entity with children or an array.

#### `parent`

Changes subject to parent of current entity. Will throw if entity doesn't have a parent, so is directly in a root state.

#### `selectedChildren` and `unselectedChildren`

Works on container entities. Grabs all selected or not-selected children in an array and sets it as new subject.

#### `selectedChildrenCount` and `unselectedChildrenCount`

Works on container entities. Counts the number of un/selected children and sets that number as new subject.

#### `owner`

Changes subject to owner of currently interacted entity.

Requires `player` in initial subjects, so it doesn't work with UI-based interactions and custom events.

## Asserting values

#### `empty()`

Subject should be empty. Usable against JS primitives AND Entities.

#### `full()`

#### `availableSpotAt(index: number)`

#### `availableSpotAt(column: number, row: number)`

#### `equals(value: unknown)`

#### `true()`

#### `false()`

#### `defined()`

#### `undefined()`

#### `above(value: number)`

#### `aboveEq(value: number)`

#### `below(value: number)`

#### `belowEq(value: number)`

#### `oneOf(values: any[])`

#### `matchesPropOf(refName: string)`

#### `matchesPropOf(other: unknown)`

#### `selectable()`

#### `selected()`

#### `someEntitiesMatchProps(props: QuerableProps)`

#### `everyEntityMatchesProps(props: QuerableProps)`

#### `test(tester: (subject: any) => boolean)`

#### `revealedUI(uiKey?: string)`

#### `itsPlayersTurn()`

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

`has`, `to`, `is`, `can`, `be`, `and`.

```ts
con().has.not.revealedUI()

con()
  .subject.entity.its("rank")
  .equals("K")
  .and.its("suit")
  .is.oneOf(["S", "H"])
```

## Negation

Property `not` exists to negate any further assertions.

## Advanced topics

### Avoid code duplication

If you start seeing repeated condition statements across all your ActionTemplates, you could extract common elements out into a separate functions:

```ts title="src/conditions/matchesWithPile.ts"
import type { ClientMessageConditions } from "@cardsgame/server"
import type { MakaoState } from "../state.js"

export const matchesWithPile = (
  con: ClientMessageConditions<MakaoState>
): void => {
  con("Card must match with the one on the pile").either(
    () => con().subject.entity.its("rank").matchesPropOf("pileTop"),
    () => con().subject.entity.its("suit").matchesPropOf("pileTop")
  )
}
```

Remember to pass reference to `con` down to the other function.

```ts title="src/actions/selectCard.ts"
// ...
  conditions: (con, { player }) => {
    con().itsPlayersTurn()
    con().remember("hand", {
      type: "hand",
      owner: player,
    })

    matchesWithPile(con)
  },
// ...
```

### Grabbing direct value references

Sometimes you need to grab a direct reference to an object and for example decide a different flow for conditions.

You can use `grab<T>()`, which will return current subject as direct value reference. Provide `T` with the expected type to have nicer coding experience - your value will be typed as whatever you provide as `T`

```ts
const currentlySelected = con().get({ type: "hand" }).grab<ClassicCard>()

if (isCardAttack(currentlySelected)) {
  // Flow A, if selected card is of "attack" type
} else {
  // Flow B, otherwise
}
```

### Grabbing direct reference to game's State

`grabState()` returns your game's `state` object.

In below example we use it to navigate condition checks flow. Assume `isCardAttack`, `isCardSkip` and `matchesWithPile` are defined elsewhere.

```ts
const state = con().grabState()

if (state.attackPoints > 0) {
  con("Can only play 'attack' cards now").subject.entity.test(isCardAttack)
  matchesWithPile(con)
}
if (state.skipPoints > 0) {
  con("Can only play 'skip turn' cards now").subject.entity.test(isCardSkip)
}
```
