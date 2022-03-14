---
id: "PrimitivesCollectionSchema"
title: "Interface: PrimitivesCollectionSchema<T, K>"
sidebar_label: "PrimitivesCollectionSchema"
sidebar_position: 0
custom_edit_url: null
---

Client-side, could also be wrapped with array-like or map-like functions.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`PrimitiveValue`](../modules.md#primitivevalue) |
| `K` | `string` |

## Hierarchy

- [`WithSchemaDefinition`](WithSchemaDefinition.md)

  ↳ **`PrimitivesCollectionSchema`**

## Indexable

▪ [key: `string`]: `any`

## Properties

### \_definition

• **\_definition**: `SchemaDefinition`

#### Inherited from

[WithSchemaDefinition](WithSchemaDefinition.md).[_definition](WithSchemaDefinition.md#_definition)

___

### onAdd

• **onAdd**: [`CollectionCallback`](../modules.md#collectioncallback)<`T`, `K`\>

___

### onChange

• **onChange**: [`CollectionCallback`](../modules.md#collectioncallback)<`T`, `K`\>

___

### onRemove

• **onRemove**: [`CollectionCallback`](../modules.md#collectioncallback)<`T`, `K`\>
