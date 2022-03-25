---
id: "SelectableChildrenTrait"
title: "Class: SelectableChildrenTrait"
sidebar_label: "SelectableChildrenTrait"
sidebar_position: 0
custom_edit_url: null
---

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
| `this` | [`ParentTrait`](ParentTrait.md) & [`SelectableChildrenTrait`](SelectableChildrenTrait.md) |
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
| `this` | [`ParentTrait`](ParentTrait.md) & [`SelectableChildrenTrait`](SelectableChildrenTrait.md) |

#### Returns

`number`

___

### deselectChildAt

▸ **deselectChildAt**(`this`, `childIndex`): `void`

Deselect child

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](ParentTrait.md) & [`SelectableChildrenTrait`](SelectableChildrenTrait.md) |
| `childIndex` | `number` |

#### Returns

`void`

___

### getSelectedChildren

▸ **getSelectedChildren**<`T`\>(`this`): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](ChildTrait.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](ParentTrait.md) & [`SelectableChildrenTrait`](SelectableChildrenTrait.md) |

#### Returns

`T`[]

___

### getSelectionIndex

▸ **getSelectionIndex**(`childIndex`): `number`

In which order was nth child selected. Returns `undefined` on index of UNselected child.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `childIndex` | `number` | index of child |

#### Returns

`number`

___

### getUnselectedChildren

▸ **getUnselectedChildren**<`T`\>(`this`): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ChildTrait`](ChildTrait.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`ParentTrait`](ParentTrait.md) & [`SelectableChildrenTrait`](SelectableChildrenTrait.md) |

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
| `this` | [`ParentTrait`](ParentTrait.md) & [`SelectableChildrenTrait`](SelectableChildrenTrait.md) |
| `childIndex` | `number` |

#### Returns

`void`
