---
id: "ClientMessageConditions"
title: "Class: ClientMessageConditions<S>"
sidebar_label: "ClientMessageConditions"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md) |

## Hierarchy

- [`Conditions`](Conditions.md)<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

  ↳ **`ClientMessageConditions`**

## Callable

### ClientMessageConditions

▸ **ClientMessageConditions**(): `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

#### Returns

`ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

### ClientMessageConditions

▸ **ClientMessageConditions**(`props`): `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

Looks for a child entity by their `props`, starting from current subject.

**`yields`** an entity, found by alias or `QuerableProps` query

**`example`**
```ts
con({name: 'deck'}).as('deck')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`QuerableProps`](../interfaces/QuerableProps.md) |

#### Returns

`ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

### ClientMessageConditions

▸ **ClientMessageConditions**(`alias`, `props?`): `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

Changes subject to previously remembered entity by an `alias`.
If `props` are also provided, it'll also search the aliased entity
for another entity by their `props`.

**`yields`** an entity, found by alias or `QuerableProps` query

**`example`**
```ts
con('deck', {rank: 'K'})
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `alias` | `string` |
| `props?` | [`QuerableProps`](../interfaces/QuerableProps.md) |

#### Returns

`ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

### ClientMessageConditions

▸ **ClientMessageConditions**(`arg0?`, `arg1?`): `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0?` | `string` \| [`QuerableProps`](../interfaces/QuerableProps.md) |
| `arg1?` | [`QuerableProps`](../interfaces/QuerableProps.md) |

#### Returns

`ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

## Constructors

### constructor

• **new ClientMessageConditions**<`S`\>(`state`, `subjects`, `defaultSubjectKey?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md)<`S`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `S` | game's state reference |
| `subjects` | `Record`<`string`, `any`\> | additional data to be available while running conditions |
| `defaultSubjectKey?` | `string` | - |

#### Inherited from

[Conditions](Conditions.md).[constructor](Conditions.md#constructor)

## Properties

### data

• **data**: `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

Changes current `subject` to event's additional data

___

### entity

• **entity**: `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

Changes current `subject` to entity being interacted with

___

### event

• **event**: `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

Changes current `subject` to Interaction-related events ("click", "touchstart"...)

___

### messageType

• **messageType**: `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

Changes current `subject` to game-specific player command. Defaults to "EntityInteraction"

___

### player

• **player**: `ConditionsMethods`<`S`, [`ClientMessageConditions`](ClientMessageConditions.md)<`S`\>\>

Changes current `subject` to interacting `Player`
