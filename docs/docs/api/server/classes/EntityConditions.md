---
id: "EntityConditions"
title: "Class: EntityConditions<S>"
sidebar_label: "EntityConditions"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md) |

## Hierarchy

- [`Conditions`](Conditions.md)<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

  ↳ **`EntityConditions`**

## Callable

### EntityConditions

▸ **EntityConditions**(): `ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

#### Returns

`ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

### EntityConditions

▸ **EntityConditions**(`props`): `ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

Looks for a child entity by their `props`, starting from current subject.

**`yields`** an entity, found by alias or `QuerableProps` query

**`example`**
```ts
con({name: 'deck'}).as('deck')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `QuerableProps` |

#### Returns

`ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

### EntityConditions

▸ **EntityConditions**(`alias`, `props?`): `ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

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
| `props?` | `QuerableProps` |

#### Returns

`ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

### EntityConditions

▸ **EntityConditions**(`arg0?`, `arg1?`): `ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0?` | `string` \| `QuerableProps` |
| `arg1?` | `QuerableProps` |

#### Returns

`ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

## Constructors

### constructor

• **new EntityConditions**<`S`\>(`state`, `subjects`, `defaultSubjectKey?`)

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

### entity

• **entity**: `ConditionsMethods`<`S`, [`EntityConditions`](EntityConditions.md)<`S`\>\>

Changes current `subject` to interacting `Player`
