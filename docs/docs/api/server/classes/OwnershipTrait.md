---
id: "OwnershipTrait"
title: "Class: OwnershipTrait"
sidebar_label: "OwnershipTrait"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new OwnershipTrait**()

## OwnershipTrait Properties

### ownerID

• **ownerID**: `string`

ID of the player owning this entity

___

### ownersMainFocus

• **ownersMainFocus**: `boolean`

Is this entity/container to be the main focus for this player?
To be used by client-side implementation.

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
