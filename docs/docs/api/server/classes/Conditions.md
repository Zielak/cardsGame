---
id: "Conditions"
title: "Class: Conditions<S, C>"
sidebar_label: "Conditions"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | `S` |
| `C` | extends [`Conditions`](Conditions.md)<`S`, `C`\> |

## Hierarchy

- `Function`

  ↳ **`Conditions`**

  ↳↳ [`BotConditions`](BotConditions.md)

  ↳↳ [`EntityConditions`](EntityConditions.md)

  ↳↳ [`ClientMessageConditions`](ClientMessageConditions.md)

## Callable

### Conditions

▸ `Abstract` **Conditions**(): `ConditionsMethods`<`S`, `C`\>

#### Returns

`ConditionsMethods`<`S`, `C`\>

### Conditions

▸ `Abstract` **Conditions**(`props`): `ConditionsMethods`<`S`, `C`\>

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

`ConditionsMethods`<`S`, `C`\>

### Conditions

▸ `Abstract` **Conditions**(`alias`, `props?`): `ConditionsMethods`<`S`, `C`\>

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

`ConditionsMethods`<`S`, `C`\>

### Conditions

▸ `Abstract` **Conditions**(`arg0?`, `arg1?`): `ConditionsMethods`<`S`, `C`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0?` | `string` \| [`QuerableProps`](../interfaces/QuerableProps.md) |
| `arg1?` | [`QuerableProps`](../interfaces/QuerableProps.md) |

#### Returns

`ConditionsMethods`<`S`, `C`\>

## Constructors

### constructor

• **new Conditions**<`S`, `C`\>(`state`, `subjects`, `defaultSubjectKey?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | `S` |
| `C` | extends [`Conditions`](Conditions.md)<`S`, `C`, `C`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `S` | game's state reference |
| `subjects` | `Record`<`string`, `any`\> | additional data to be available while running conditions |
| `defaultSubjectKey?` | `string` | - |

#### Overrides

Function.constructor
