---
id: "entities.ClassicCard"
title: "Class: ClassicCard"
sidebar_label: "entities.ClassicCard"
custom_edit_url: null
---

[entities](../namespaces/entities.md).ClassicCard

## Hierarchy

- `Entity`<`ClassicCardOptions`\>

- `Mixin`

  ↳ **`ClassicCard`**

## Constructors

### constructor

• **new ClassicCard**(`state`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `options` | `Partial`<`Partial`<`NonFunctionProperties`<`Mixin`\> & { `rank`: `string` ; `suit`: `string`  }\>\> |

#### Inherited from

Entity<ClassicCardOptions\>.constructor

## ChildTrait Properties

### idx

• **idx**: `number`

___

### parent

• **parent**: [`ParentTrait`](traits.ParentTrait.md)

___

## ClassicCard Properties

### rank

• **rank**: `string`

___

### suit

• **suit**: `string`

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

### id

• `Readonly` **id**: `number`

___

## OwnershipTrait Properties

### ownerID

• **ownerID**: `string`

___

### ownersMainFocus

• **ownersMainFocus**: `boolean`

___

## TwoSidedTrait Properties

### faceUp

• **faceUp**: `boolean`

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

### create

▸ **create**(`state`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `options` | `Partial`<`NonFunctionProperties`<`Mixin`\> & { `rank`: `string` ; `suit`: `string`  }\> |

#### Returns

`void`

#### Overrides

Entity.create

___

## TwoSidedTrait Methods

### flip

▸ **flip**(): `void`

Flip the entity on to the other side

#### Returns

`void`

___

### flipDown

▸ **flipDown**(): `void`

Flip the entity to reveal its back side

#### Returns

`void`

___

### flipUp

▸ **flipUp**(): `void`

Flip the entity to reveal its face

#### Returns

`void`
