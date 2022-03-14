---
id: "traits"
title: "Namespace: traits"
sidebar_label: "traits"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [BoxModelTrait](../classes/traits.BoxModelTrait.md)
- [ChildTrait](../classes/traits.ChildTrait.md)
- [FlexyTrait](../classes/traits.FlexyTrait.md)
- [IdentityTrait](../classes/traits.IdentityTrait.md)
- [LabelTrait](../classes/traits.LabelTrait.md)
- [LocationTrait](../classes/traits.LocationTrait.md)
- [OwnershipTrait](../classes/traits.OwnershipTrait.md)
- [ParentTrait](../classes/traits.ParentTrait.md)
- [SelectableChildrenTrait](../classes/traits.SelectableChildrenTrait.md)
- [TwoSidedTrait](../classes/traits.TwoSidedTrait.md)

## Other Functions

- [hasSelectableChildren](traits.md#hasselectablechildren)

## Trait Functions

- [hasChildren](traits.md#haschildren)
- [hasIdentity](traits.md#hasidentity)
- [hasLabel](traits.md#haslabel)
- [hasOwnership](traits.md#hasownership)
- [isChild](traits.md#ischild)
- [isParent](traits.md#isparent)

## Type aliases

### ChildAddedHandler

Ƭ **ChildAddedHandler**: (`child`: [`ChildTrait`](../classes/traits.ChildTrait.md)) => `void`

#### Type declaration

▸ (`child`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `child` | [`ChildTrait`](../classes/traits.ChildTrait.md) |

##### Returns

`void`

___

### ChildRemovedHandler

Ƭ **ChildRemovedHandler**: (`idx`: `number`) => `void`

#### Type declaration

▸ (`idx`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |

##### Returns

`void`

## Other Functions

### hasSelectableChildren

▸ **hasSelectableChildren**(`entity`): entity is SelectableChildrenTrait

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is SelectableChildrenTrait

___

## Trait Functions

### hasChildren

▸ **hasChildren**(`entity`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

`boolean`

___

### hasIdentity

▸ **hasIdentity**(`entity`): entity is IdentityTrait

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `any` |

#### Returns

entity is IdentityTrait

___

### hasLabel

▸ **hasLabel**(`entity`): entity is LabelTrait

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is LabelTrait

___

### hasOwnership

▸ **hasOwnership**(`entity`): entity is OwnershipTrait

Entity with this trait can have a reference to `Player`, who "owns" this entity.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is OwnershipTrait

___

### isChild

▸ **isChild**(`entity`): entity is ChildTrait

**Important trait**

Entity can become a child of any other container/parent.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is ChildTrait

___

### isParent

▸ **isParent**(`entity`): entity is ParentTrait

**Important trait**

Entity will behave as container to hold all other entities with `ChildTrait`.

Has many methods for adding, fetching, removing and manipulating order of children.

Can behave as:

- an array - all children are indexed next to each other
- a map - there can be empty spaces between children

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is ParentTrait
