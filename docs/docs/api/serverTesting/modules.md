---
id: "modules"
title: "@cardsgame/server-testing"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Other Type aliases

### EntityMockingDefinition

Ƭ **EntityMockingDefinition**: `EntityMockingProps` & `ChildrenMockingArray` & { `selected?`: `number`[] ; `type?`: `string`  }

An object _describing_ any possible entity. This is not an [Entity](/api/server/classes/Entity) in itself.

**`example`** "D7" card placed with its face down:
```ts
{ type: "classicCard", suit: "D", rank: "3", faceUp: false }
```

**`example`** Some container with 2 cards, with second one being selected:
```ts
{
  children: [
    { type: "classicCard", name: "D7" },
    { type: "classicCard", name: "D3" },
  ],
  selected: [1]
}
```
:::note

`name: "D7"` is a shorthand. Given this object is of type `"classicCard"`,
this object will get populated with 2 new props: `rank: "7"` and `suit: "D"`

:::

___

### StateMockingRecord

Ƭ **StateMockingRecord**<`S`\>: `ChildrenMockingArray` & `StateMockingProps`<`S`\> & `Partial`<{ `clients`: `string`[] ; `players`: `Partial`<`IPlayerDefinition`\>[]  }\>

An object _describing_ a root state.
This definition may contain state's props like `"isGameStarted"`,
and all the other [entities](#entitymockingdefinition) in `"children"` array.

**`example`** Game state at round 10, only one card on the table.
```ts
{
  round: 10,
  children: [
    {type: "classicCard", name: "D7"}
  ]
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State` |

___

### StateMockingTuple

Ƭ **StateMockingTuple**: [`QuerableProps` \| `undefined`, [`EntityMockingDefinition`](modules.md#entitymockingdefinition)]

___

## Setup Type aliases

### SetupAPI

Ƭ **SetupAPI**<`S`, `R`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State` |
| `R` | extends `Room`<`S`\> |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `executeEvent` | `ExecuteEvent` | Test how your Action would modify the game state. |
| `initState` | `InitState`<`S`\> | Create your state and populate it with provided props and entities. Include definitions of child entities in `children` array. |
| `makeEvent` | `MakeEvent` | - |
| `makeInteraction` | `MakeInteraction` | Construct interaction event object for use in `testEvent()` |
| `populateState` | `PopulateState`<`S`\> | Populates state with new entities.  Use AFTER you prepared the base state yourself by using your game's own state preparation functions. Modifies state in-place. |
| `reset` | `Resetter`<`S`, `R`\> | Will remember new reference to the State and Room object for use in other functions of `setupServerTesting()`.  Without calling this function, for example `populateState(...entitiesMap)` might end up populating state object of previous test runs (which is bad!). |
| `testEvent` | `TestEvent` | Test if given event would pass in gameplay under current conditions. |

___

### SetupOptions

Ƭ **SetupOptions**<`S`, `R`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State` |
| `R` | extends `Room`<`S`\> |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `ActionTemplate`<`S`\> | Used only in `testEvent()`, don't have to provide if you won't use that function. |
| `gameEntities?` | `Record`<`string`, `EntityConstructor`\> | List of custom entities present in your game, if any. Used to figure out entity constructor just by it's `type` from `statePreparation` |
| `roomConstructor?` | () => `R` | Used only in `executeEvent()`, don't have to provide if you won't use that function. |
| `stateConstructor?` | () => `S` | Used only in `initState()`, don't have to provide if you won't use that function. |

## Variables

### CLIENT\_ID

• `Const` **CLIENT\_ID**: ``"CLIENT"``

Client ID with which most of the events will be automatically created.
Assign it to the first player in your testing environment.

## Other Functions

### initState

▸ **initState**<`S`\>(`statePreparation?`, `stateConstructor?`, `gameEntities?`): `S`

Create your state and populate it with provided props and entities.
Include definitions of child entities in `children` array.

**`example`**
```ts
state = initState(
  State,
  {
    isGameStarted: true,
    children: [
      {
        type: "hand",
        children: [{ name: "SK" }],
        selected: [0],
      },
    ],
  }
)
```
- Would create a hand
- Add new card King of Spades to the hand
- And finally mark that card as selected

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State`<`S`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `statePreparation?` | [`StateMockingRecord`](modules.md#statemockingrecord)<`S`\> |
| `stateConstructor?` | () => `S` |
| `gameEntities?` | `Record`<`string`, `EntityConstructor`\> |

#### Returns

`S`

___

### makeEvent

▸ **makeEvent**<`S`\>(`state`, `message`, `messageType?`): `ServerPlayerMessage`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State`<`S`\> |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `state` | `S` | `undefined` |
| `message` | `RawInteractionClientPlayerMessage` | `undefined` |
| `messageType` | `string` | `"EntityInteraction"` |

#### Returns

`ServerPlayerMessage`

___

### makeInteraction

▸ **makeInteraction**<`S`\>(`state`, `entityQuery`, `event?`): `ServerPlayerMessage`

Construct interaction event object for use in `testEvent()`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State`<`S`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `entityQuery` | `QuerableProps` |
| `event?` | `string` |

#### Returns

`ServerPlayerMessage`

___

### populateState

▸ **populateState**<`S`\>(`state`, `entitiesMap`, `gameEntities?`): `S`

_this function can be run independently of `setupServerTesting()`_

Use AFTER you prepared the base state yourself by using your
game's own state preparation functions. Modifies state in-place.

**`example`**
```ts
populateState(
  state,
  [
    [ { name: "hand0" }, { children: [{ name: "SK" }], selected: [0] } ]
  ]
)
```
- Would find entity named "hand0" (eg. first player's hand)
- Create new card King of Spades
- And finally mark that card selected ([0] in this case assuming it's first and only card in "hand0")

**`example`**
```ts
populateState(
  state,
  [
    [ null, { name: "C7" } ]
  ]
)
```
- Would add card 7 of Clubs directly on the state/table
- Note `null` -> no query = fallback to root state object

**`example`**
Perform multiple additions in one go:
```ts
populateState(
  state,
  [
    [ { name: "hand0" }, { children: [{ name: "SK" }], selected: [0] } ],
    [ null, { name: "C7" } ],
    [ { type: "pile" }, { children: [{ name: "C2" }, { name: "C3" }, { name: "C4" }] } ]
  ]
)
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State`<`S`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `S` | State to populate with new entities |
| `entitiesMap` | [`StateMockingTuple`](modules.md#statemockingtuple)[] | Tuples of "entity queries" to "entity definitions". Finds an already existing entity and fills it with new data/entities to test. |
| `gameEntities?` | `Record`<`string`, `EntityConstructor`\> | optional record of your game's custom entities. |

#### Returns

`S`

the same state just for convenience.

___

### testEvent

▸ **testEvent**<`S`\>(`state`, `action`, `message`): `boolean`

Test if given event would pass in gameplay under current conditions.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State`<`S`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `action` | `ActionTemplate`<`S`\> |
| `message` | `ServerPlayerMessage` |

#### Returns

`boolean`

___

## Setup Functions

### setupServerTesting

▸ **setupServerTesting**<`S`, `R`\>(`options`): [`SetupAPI`](modules.md#setupapi)<`S`, `R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `State`<`S`\> |
| `R` | extends `Room`<`S`, `R`\> = `Room`<`S`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`SetupOptions`](modules.md#setupoptions)<`S`, `R`\> |

#### Returns

[`SetupAPI`](modules.md#setupapi)<`S`, `R`\>

___

## Utility Functions

### childrenNamed

▸ **childrenNamed**(`names`): [`EntityMockingDefinition`](modules.md#entitymockingdefinition)

Creates [`EntityMockingDefinition`](#entitymockingdefinition) object
containing `children` with objects containing names.

**`example`** given multiple names
```ts
childrenNamed(["D7", "D8", "D9"])
// returns:
{
  children: [
    { name: "D7"}, { name: "D8"}, { name: "D9"}
  ]
}
```

**`example`** single string param
```ts
childrenNamed("D7")
// returns:
{
  children: [{ name: "D7"}]
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `names` | `string` \| `string`[] | can be single name, will be wrapped in an array anyway |

#### Returns

[`EntityMockingDefinition`](modules.md#entitymockingdefinition)

___

### objectsNamed

▸ **objectsNamed**(`names`): [`EntityMockingDefinition`](modules.md#entitymockingdefinition)[]

Turns an array of strings into array of objects with `name`.
Useful in creating `children` prop in [`EntityMockingDefinition`](#entitymockingdefinition).

**`example`** given multiple names
```ts
objectsNamed(["D7", "D8", "D9"])
// returns:
[{ name: "D7"}, { name: "D8"}, { name: "D9"}]
```

**`example`** single string param
```ts
objectsNamed("D7")
// returns:
[{ name: "D7"}]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `names` | `string` \| `string`[] | can be single name, will be wrapped in an array anyway |

#### Returns

[`EntityMockingDefinition`](modules.md#entitymockingdefinition)[]
