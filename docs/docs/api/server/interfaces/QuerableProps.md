---
id: "QuerableProps"
title: "Interface: QuerableProps"
sidebar_label: "QuerableProps"
sidebar_position: 0
custom_edit_url: null
---

Interface used to search for an entity.
An object of props, which appear in every kind of trait and entity, with an addition of:

- `parent` - describe the parent of an entity you're looking for
- `selected` - query only for selected or not-selected items
- `selectionIndex` - query by items selection index, if it was in fact selected

## Hierarchy

- `EntityOptions`

  ↳ **`QuerableProps`**

## ChildTrait Properties

### idx

• `Optional` **idx**: `number` \| `number`[]

#### Inherited from

EntityOptions.idx

___

## ClassicCard Properties

### rank

• `Optional` **rank**: `string` \| `string`[]

#### Inherited from

EntityOptions.rank

___

### suit

• `Optional` **suit**: `string` \| `string`[]

#### Inherited from

EntityOptions.suit

___

## Deck Properties

### childCount

• `Optional` **childCount**: `number` \| `number`[]

Number of child elements synchronized to the client.

#### Inherited from

EntityOptions.childCount

___

### topDeck

• `Optional` **topDeck**: `TopDeckElement` \| `TopDeckElement`[]

#### Inherited from

EntityOptions.topDeck

___

## Grid Properties

### alignItems

• `Optional` **alignItems**: `GridAlignItems` \| `GridAlignItems`[]

#### Inherited from

EntityOptions.alignItems

___

### columns

• `Optional` **columns**: `number` \| `number`[]

#### Inherited from

EntityOptions.columns

___

### itemAngle

• `Optional` **itemAngle**: `number` \| `number`[]

Grid comment at grid file

#### Inherited from

EntityOptions.itemAngle

___

### justify

• `Optional` **justify**: `GridJustify` \| `GridJustify`[]

#### Inherited from

EntityOptions.justify

___

### justifyItems

• `Optional` **justifyItems**: `GridJustifyItems` \| `GridJustifyItems`[]

#### Inherited from

EntityOptions.justifyItems

___

### rows

• `Optional` **rows**: `number` \| `number`[]

#### Inherited from

EntityOptions.rows

___

## LabelTrait Properties

### name

• `Optional` **name**: `string` \| `string`[]

#### Inherited from

EntityOptions.name

___

### type

• `Optional` **type**: `string` \| `string`[]

Type should be unique to schema object! If you're extending this schema
and adding new fields - set the new type string!

#### Inherited from

EntityOptions.type

___

## Line Properties

### align

• `Optional` **align**: `LineAlign` \| `LineAlign`[]

How should items align within the container.
In zero-length container only "start" and "end" values make sense.

#### Inherited from

EntityOptions.align

___

### itemSpacing

• `Optional` **itemSpacing**: `number` \| `number`[]

Margin or overlapping (negative values) between items

#### Inherited from

EntityOptions.itemSpacing

___

### length

• `Optional` **length**: `number` \| `number`[]

0cm by default, sets the point of overflow.

#### Inherited from

EntityOptions.length

___

### overflow

• `Optional` **overflow**: `boolean` \| `boolean`[]

Should the items overflow over the edge,
or squeeze in and keep in the Lines length?
Remember, items don't "wrap" to "the next line".
Default value depends on `length`:
- length=0 -> overflow=true
- length>0 -> overflow=false

#### Inherited from

EntityOptions.overflow

___

## LocationTrait Properties

### angle

• `Optional` **angle**: `number` \| `number`[]

Rotation in degrees

#### Inherited from

EntityOptions.angle

___

### x

• `Optional` **x**: `number` \| `number`[]

X offset relative to entity's parent

#### Inherited from

EntityOptions.x

___

### y

• `Optional` **y**: `number` \| `number`[]

Y offset relative to entity's parent

#### Inherited from

EntityOptions.y

___

## Other Properties

### owner

• **owner**: [`Player`](../classes/Player.md) \| [`Player`](../classes/Player.md)[]

#### Inherited from

EntityOptions.owner

___

### parent

• `Optional` **parent**: [`QuerableProps`](QuerableProps.md)

___

### selected

• `Optional` **selected**: `boolean`

___

### selectionIndex

• `Optional` **selectionIndex**: `number` \| `number`[]

___

## OwnershipTrait Properties

### ownerID

• `Optional` **ownerID**: `string` \| `string`[]

ID of the player owning this entity

#### Inherited from

EntityOptions.ownerID

___

### ownersMainFocus

• `Optional` **ownersMainFocus**: `boolean` \| `boolean`[]

Is this entity/container to be the main focus for this player?
To be used by client-side implementation.

#### Inherited from

EntityOptions.ownersMainFocus

___

## ParentTrait Properties

### collectionBehaviour

• `Optional` **collectionBehaviour**: ``"array"`` \| ``"map"`` \| (``"array"`` \| ``"map"``)[]

How children and their indexes behave when added into or removed from this parent.
- array: there can be no empty spots, children will always move to fill in the gaps
- map: no automatic movement is performed, adding to first empty spot,
  otherwise you need to ensure given spot isn't occupied

**`default`** "array"

#### Inherited from

EntityOptions.collectionBehaviour

___

### maxChildren

• `Optional` **maxChildren**: `number` \| `number`[]

**`default`** Infinity

#### Inherited from

EntityOptions.maxChildren

___

## TwoSidedTrait Properties

### faceUp

• `Optional` **faceUp**: `boolean` \| `boolean`[]

#### Inherited from

EntityOptions.faceUp
