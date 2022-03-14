---
id: "traits.ParentTrait"
title: "Class: ParentTrait"
sidebar_label: "traits.ParentTrait"
custom_edit_url: null
---

[traits](../namespaces/traits.md).ParentTrait

## Constructors

### constructor

• **new ParentTrait**()

## Other Properties

### childAdded

• **childAdded**: [`ChildAddedHandler`](../namespaces/traits.md#childaddedhandler)

___

### childRemoved

• **childRemoved**: [`ChildRemovedHandler`](../namespaces/traits.md#childremovedhandler)

___

## ParentTrait Properties

### childrenPointers

• **childrenPointers**: `Map`<[`ChildTrait`](traits.ChildTrait.md), `string`\>

ChildTrait object -> its constructor's name
Also good spot to count all children

___

### collectionBehaviour

• **collectionBehaviour**: ``"array"`` \| ``"map"``

How children and their indexes behave when added into or removed from this parent.
- array: there can be no empty spots, children will always move to fill in the gaps
- map: no automatic movement is performed, adding to first empty spot,
  otherwise you need to ensure given spot isn't occupied

**`default`** "array"

___

### hijacksInteractionTarget

• **hijacksInteractionTarget**: `boolean`

Used by [ChildTrait.`isInteractive`](traits.ChildTrait#isinteractive).

If set to true, will prevent its direct children from getting interaction events.

___

### maxChildren

• **maxChildren**: `number`

**`default`** Infinity

## Methods

### addChild

▸ **addChild**(`entity`): `void`

Adds new item.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`ChildTrait`](traits.ChildTrait.md) |

#### Returns

`void`

▸ **addChild**(`entity`, `prepend`): `void`

Adds new item.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`ChildTrait`](traits.ChildTrait.md) |
| `prepend` | `boolean` |

#### Returns

`void`

▸ **addChild**(`entity`, `atIndex`): `void`

Adds new item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entity` | [`ChildTrait`](traits.ChildTrait.md) |  |
| `atIndex` | `number` | squeeze into desired spot, moving other children away. |

#### Returns

`void`

▸ **addChild**(`entity`, `arg1`): `void`

Adds new item.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`ChildTrait`](traits.ChildTrait.md) |
| `arg1` | `number` \| `boolean` |

#### Returns

`void`

___

### addChildren

▸ **addChildren**(`entities`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entities` | [`ChildTrait`](traits.ChildTrait.md)[] |

#### Returns

`void`

___

### countChildren

▸ **countChildren**(): `number`

Number of child elements

#### Returns

`number`

___

### getBottom

▸ **getBottom**<`T`\>(): `T`

Get the element with the lowest 'idx' value

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Returns

`T`

___

### getChild

▸ **getChild**<`T`\>(`idx`): `T`

Get one direct child of `parent` by its `idx`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |

#### Returns

`T`

___

### getChildren

▸ **getChildren**<`T`\>(): `T`[]

Gets all direct children in array form, "sorted" by idx

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Returns

`T`[]

___

### getClosestEmptySpot

▸ **getClosestEmptySpot**(`index`): `number`

unused?

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`number`

___

### getFirstEmptySpot

▸ **getFirstEmptySpot**(): `number`

For map behaviour, seeks out first available spot, starting from index 0.
Arrays don't have gaps, so first "available" spot is always after last child.

#### Returns

`number`

index of first vacant spot, or -1 if no spot is available

___

### getLastEmptySpot

▸ **getLastEmptySpot**(): `number`

unused?

#### Returns

`number`

___

### getTop

▸ **getTop**<`T`\>(): `T`

Get the element with highest 'idx' value

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Returns

`T`

___

### indexFits

▸ **indexFits**(`index`): `boolean`

Does index fit in range of this container.
Doesn't check if index is occupied.
Considering `maxChildren` and if index is negative or otherwise invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`boolean`

___

### move

▸ `Protected` **move**(`where`, `start`, `end?`): `IndexUpdate`[]

Takes care of manipulating indexes, and updating every internal things
related to children spot movements

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `where` | `number` | direction and range. (+1) - one up, (-2) - two in direction of array start |
| `start` | `number` | left-most child to manipulate |
| `end?` | `number` | rightmost child, omit to have only one child moved |

#### Returns

`IndexUpdate`[]

___

### moveChildTo

▸ **moveChildTo**(`from`, `to`): `void`

In array, moves child to target idx, rearranging everything between `from` and `to`.
In map, swaps children at `from` and `to` (for now...)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `number` | index of child to move |
| `to` | `number` | desired target position |

#### Returns

`void`

___

### query

▸ **query**<`T`\>(`props`): `T`

Find one item matching props.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `QuerableProps` |

#### Returns

`T`

___

### queryAll

▸ **queryAll**<`T`\>(`props`): `T`[]

Looks for every matching entity here and deeper

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `QuerableProps` |

#### Returns

`T`[]

___

### removeChild

▸ **removeChild**(`child`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `child` | [`ChildTrait`](traits.ChildTrait.md) |

#### Returns

`boolean`

___

### removeChildAt

▸ **removeChildAt**(`idx`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |

#### Returns

`boolean`
