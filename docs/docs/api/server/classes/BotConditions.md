---
id: "BotConditions"
title: "Class: BotConditions<S>"
sidebar_label: "BotConditions"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md) |

## Hierarchy

- [`Conditions`](Conditions.md)<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

  ↳ **`BotConditions`**

## Callable

### BotConditions

▸ **BotConditions**(): `ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

#### Returns

`ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

### BotConditions

▸ **BotConditions**(`props`): `ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

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

`ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

### BotConditions

▸ **BotConditions**(`alias`, `props?`): `ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

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

`ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

### BotConditions

▸ **BotConditions**(`arg0?`, `arg1?`): `ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0?` | `string` \| `QuerableProps` |
| `arg1?` | `QuerableProps` |

#### Returns

`ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

## Constructors

### constructor

• **new BotConditions**<`S`\>(`state`, `subjects`, `defaultSubjectKey?`)

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

### player

• **player**: `ConditionsMethods`<`S`, [`BotConditions`](BotConditions.md)<`S`\>\>

Changes current `subject` to interacting `Player`
