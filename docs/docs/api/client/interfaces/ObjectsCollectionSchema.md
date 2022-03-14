---
id: "ObjectsCollectionSchema"
title: "Interface: ObjectsCollectionSchema<T, K>"
sidebar_label: "ObjectsCollectionSchema"
sidebar_position: 0
custom_edit_url: null
---

Client-side, could also be wrapped with array-like or map-like functions.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `K` | `string` |

## Hierarchy

- [`WithSchemaDefinition`](WithSchemaDefinition.md)

  ↳ **`ObjectsCollectionSchema`**

## Indexable

▪ [key: `string`]: `any`

## Properties

### \_definition

• **\_definition**: `SchemaDefinition`

#### Inherited from

[WithSchemaDefinition](WithSchemaDefinition.md).[_definition](WithSchemaDefinition.md#_definition)

___

### onAdd

• **onAdd**: [`CollectionCallback`](../modules.md#collectioncallback)<`T` & `ObjectSchemaColyBase`<`any`\> & `DirectPrimitiveOrSchemaObject`<`any`\> & [`WithSchemaDefinition`](WithSchemaDefinition.md) & `T` & [`ObjectsCollectionSchema`](ObjectsCollectionSchema.md)<`any`, `any`\> & `T` & [`PrimitivesCollectionSchema`](PrimitivesCollectionSchema.md)<`any`, `any`\>, `K`\>

___

### onRemove

• **onRemove**: [`CollectionCallback`](../modules.md#collectioncallback)<`T` & `ObjectSchemaColyBase`<`any`\> & `DirectPrimitiveOrSchemaObject`<`any`\> & [`WithSchemaDefinition`](WithSchemaDefinition.md) & `T` & [`ObjectsCollectionSchema`](ObjectsCollectionSchema.md)<`any`, `any`\> & `T` & [`PrimitivesCollectionSchema`](PrimitivesCollectionSchema.md)<`any`, `any`\>, `K`\>
