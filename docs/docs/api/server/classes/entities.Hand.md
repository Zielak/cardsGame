---
id: "entities.Hand"
title: "Class: Hand"
sidebar_label: "entities.Hand"
custom_edit_url: null
---

[entities](../namespaces/entities.md).Hand

## Hierarchy

- `Entity`<`HandOptions`\>

- `Mixin`

  ↳ **`Hand`**

## Constructors

### constructor

• **new Hand**(`state`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `options` | `Partial`<`Partial`<`NonFunctionProperties`<`Mixin`\> & { `autoSort`: `SortingFunction`  }\>\> |

#### Inherited from

Entity<HandOptions\>.constructor

## ChildTrait Properties

### idx

• **idx**: `number`

___

### parent

• **parent**: [`ParentTrait`](traits.ParentTrait.md)

___

## LabelTrait Properties

### name

• **name**: `string`

___

### type

• **type**: `string`

Type should be unique to schema object! If you're extending this schema
and adding new fields - set the new type string!

___

## LocationTrait Properties

### angle

• **angle**: `number`

Rotation in degrees

___

### x

• **x**: `number`

X offset relative to entity's parent

___

### y

• **y**: `number`

Y offset relative to entity's parent

___

## Other Properties

### autoSort

• **autoSort**: `SortingFunction`

___

### childAdded

• **childAdded**: (`child`: [`ChildTrait`](traits.ChildTrait.md)) => `void` = `sortOnChildAdded`

#### Type declaration

▸ (`child`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `child` | [`ChildTrait`](traits.ChildTrait.md) |

##### Returns

`void`

___

### childRemoved

• **childRemoved**: [`ChildRemovedHandler`](../namespaces/traits.md#childremovedhandler)

___

### hijacksInteractionTarget

• **hijacksInteractionTarget**: `boolean` = `false`

___

### id

• `Readonly` **id**: `number`

___

### selectedChildren

• **selectedChildren**: `ArraySchema`<`SelectedChildData`\>

___

## OwnershipTrait Properties

### ownerID

• **ownerID**: `string`

___

### ownersMainFocus

• **ownersMainFocus**: `boolean`

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

### maxChildren

• **maxChildren**: `number`

**`default`** Infinity

## ChildTrait Accessors

### idxPath

• `get` **idxPath**(): `number`[]

TODO: Limit the number of automatic getters. Just make these a `getIdxPath` functions. QueryRunner grabs all the "props" and ignores functions.

**`category`** ChildTrait

#### Returns

`number`[]

array of indexes for this entity access

___

## OwnershipTrait Accessors

### owner

• `get` **owner**(): [`Player`](Player.md)

Get the real owner of this thing, by traversing `this.parent` chain.
Owner could be set on an element or container, meaning every element in
such container belongs to one owner.

**`category`** OwnershipTrait

#### Returns

[`Player`](Player.md)

`Player` or `undefined` if this container doesn't belong to anyone

• `set` **owner**(`value`): `void`

Get the real owner of this thing, by traversing `this.parent` chain.
Owner could be set on an element or container, meaning every element in
such container belongs to one owner.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Player`](Player.md) |

#### Returns

`void`

`Player` or `undefined` if this container doesn't belong to anyone

## ChildTrait Methods

### isInteractive

▸ **isInteractive**(): `boolean`

Points out if this element can be target of any interaction

#### Returns

`boolean`

___

## Other Methods

### \_selectableEnsureIndex

▸ **_selectableEnsureIndex**(`this`, `index`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](traits.ParentTrait.md) & [`SelectableChildrenTrait`](traits.SelectableChildrenTrait.md) |
| `index` | `number` |

#### Returns

`void`

___

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

### countSelectedChildren

▸ **countSelectedChildren**(): `number`

Number of selected child elements

#### Returns

`number`

___

### countUnselectedChildren

▸ **countUnselectedChildren**(`this`): `number`

Number of not selected child elements

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](traits.ParentTrait.md) & [`SelectableChildrenTrait`](traits.SelectableChildrenTrait.md) |

#### Returns

`number`

___

### create

▸ **create**(`state`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `options` | `Partial`<`NonFunctionProperties`<`Mixin`\> & { `autoSort`: `SortingFunction`  }\> |

#### Returns

`void`

#### Overrides

Entity.create

___

### deselectChildAt

▸ **deselectChildAt**(`this`, `childIndex`): `void`

Deselect child

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](traits.ParentTrait.md) & [`SelectableChildrenTrait`](traits.SelectableChildrenTrait.md) |
| `childIndex` | `number` |

#### Returns

`void`

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

### getSelectedChildren

▸ **getSelectedChildren**<`T`\>(`this`): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](traits.ParentTrait.md) & [`SelectableChildrenTrait`](traits.SelectableChildrenTrait.md) |

#### Returns

`T`[]

___

### getSelectionIndex

▸ **getSelectionIndex**(`childIndex`): `number`

In which order was nth child selected

#### Parameters

| Name | Type |
| :------ | :------ |
| `childIndex` | `number` |

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

### getUnselectedChildren

▸ **getUnselectedChildren**<`T`\>(`this`): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](traits.ChildTrait.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](traits.ParentTrait.md) & [`SelectableChildrenTrait`](traits.SelectableChildrenTrait.md) |

#### Returns

`T`[]

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

### isChildSelected

▸ **isChildSelected**(`childIndex`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `childIndex` | `number` |

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

___

### selectChildAt

▸ **selectChildAt**(`this`, `childIndex`): `void`

Select child

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](traits.ParentTrait.md) & [`SelectableChildrenTrait`](traits.SelectableChildrenTrait.md) |
| `childIndex` | `number` |

#### Returns

`void`
