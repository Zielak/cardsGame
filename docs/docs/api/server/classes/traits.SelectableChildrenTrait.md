---
id: "traits.SelectableChildrenTrait"
title: "Class: SelectableChildrenTrait"
sidebar_label: "traits.SelectableChildrenTrait"
custom_edit_url: null
---

[traits](../namespaces/traits.md).SelectableChildrenTrait

Used on **container** - its children can now be selected by players.

Holds indexes of selected children and in which order were these chosen.

> TODO: This trait is clearly dependant on ParentTrait. There should be a way of checking/ensuring this dependency is met

## Constructors

### constructor

• **new SelectableChildrenTrait**()

## Properties

### selectedChildren

• **selectedChildren**: `ArraySchema`<`SelectedChildData`\>

## Methods

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

### isChildSelected

▸ **isChildSelected**(`childIndex`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `childIndex` | `number` |

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
