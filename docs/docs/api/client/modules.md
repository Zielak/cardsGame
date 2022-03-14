---
id: "modules"
title: "@cardsgame/client"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [Game](classes/Game.md)
- [LobbyRoom](classes/LobbyRoom.md)
- [Room](classes/Room.md)

## Interfaces

- [ObjectsCollectionSchema](interfaces/ObjectsCollectionSchema.md)
- [PrimitivesCollectionSchema](interfaces/PrimitivesCollectionSchema.md)
- [RoomAvailable](interfaces/RoomAvailable.md)
- [WithSchemaDefinition](interfaces/WithSchemaDefinition.md)

## Type aliases

### ArraySchemaDefinition

Ƭ **ArraySchemaDefinition**: `ArrayOfPrimitivesDefinition` \| `ArrayOfSchemaObjectsDefinition`

___

### ClientGameState

Ƭ **ClientGameState**<`MoreProps`\>: [`ObjectSchema`](modules.md#objectschema)<[`ClientGameStateProps`](modules.md#clientgamestateprops) & `MoreProps`\> & `EntityParentNode`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MoreProps` | `Record`<`string`, `any`\> |

___

### ClientGameStateProps

Ƭ **ClientGameStateProps**: `Object`

Root game state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clients` | `string`[] |
| `currentPlayerIdx?` | `number` |
| `isGameOver` | `boolean` |
| `isGameStarted` | `boolean` |
| `playerViewPosition` | `IPlayerViewPosition` |
| `players` | `IPlayerDefinition`[] |
| `round` | `number` |
| `tableHeight` | `number` |
| `tableWidth` | `number` |
| `turnBased` | `boolean` |
| `ui?` | `Map`<`string`, `string`\> |

___

### CollectionCallback

Ƭ **CollectionCallback**<`T`, `K`\>: (`instance`: `T`, `key`: `K`) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | `string` |

#### Type declaration

▸ (`instance`, `key`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `T` |
| `key` | `K` |

##### Returns

`void`

___

### MapSchemaDefinition

Ƭ **MapSchemaDefinition**: `MapOfPrimitivesDefinition` \| `MapOfSchemaObjectsDefinition`

___

### ObjectSchema

Ƭ **ObjectSchema**<`T`\>: `ObjectSchemaColyBase`<`T`\> & `DirectPrimitiveOrSchemaObject`<`T`\> & [`WithSchemaDefinition`](interfaces/WithSchemaDefinition.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `Record`<`string`, `any`\> |

___

### PrimitiveValue

Ƭ **PrimitiveValue**: `string` \| `boolean` \| `number`

___

### Schema

Ƭ **Schema**<`T`, `K`\>: [`ObjectSchema`](modules.md#objectschema)<`T`\> \| [`ObjectsCollectionSchema`](interfaces/ObjectsCollectionSchema.md)<`T`, `K`\> \| [`PrimitivesCollectionSchema`](interfaces/PrimitivesCollectionSchema.md)<`T`, `K`\>

Base for all fields in State in each schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `K` | `any` |

___

### SchemaChangeCallback

Ƭ **SchemaChangeCallback**: (`changes`: `DataChange`[]) => `void`

#### Type declaration

▸ (`changes`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `changes` | `DataChange`[] |

##### Returns

`void`

___

### SchemaDefinitionFieldTypes

Ƭ **SchemaDefinitionFieldTypes**: `Record`<`string`, [`SchemaDefinitionValue`](modules.md#schemadefinitionvalue)\>

___

### SchemaDefinitionValue

Ƭ **SchemaDefinitionValue**: `string` \| [`ArraySchemaDefinition`](modules.md#arrayschemadefinition) \| [`MapSchemaDefinition`](modules.md#mapschemadefinition) \| [`WithSchemaDefinition`](interfaces/WithSchemaDefinition.md)

## Functions

### isDefinitionOfArraySchema

▸ **isDefinitionOfArraySchema**(`o`): o is ArraySchemaDefinition

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is ArraySchemaDefinition

___

### isDefinitionOfMapSchema

▸ **isDefinitionOfMapSchema**(`o`): o is MapSchemaDefinition

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is MapSchemaDefinition

___

### isDefinitionOfObjectsCollection

▸ **isDefinitionOfObjectsCollection**(`o`): o is CollectionOfObjectsDefinition

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is CollectionOfObjectsDefinition

___

### isDefinitionOfPrimitive

▸ **isDefinitionOfPrimitive**(`o`): o is string

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is string

___

### isDefinitionOfPrimitivesCollection

▸ **isDefinitionOfPrimitivesCollection**(`o`): o is CollectionOfPrimitivesDefinition

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is CollectionOfPrimitivesDefinition

___

### isDefinitionOfSchema

▸ **isDefinitionOfSchema**(`o`): o is WithSchemaDefinition

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is WithSchemaDefinition

___

### isSchemaDefinition

▸ **isSchemaDefinition**(`o`): o is SchemaDefinition

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is SchemaDefinition

___

### isSchemaObject

▸ **isSchemaObject**(`o`): o is Schema<any, any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is Schema<any, any\>

___

### isSchemaParent

▸ **isSchemaParent**(`schema`): `boolean`

Is given object a schema of entities container

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`ObjectSchema`](modules.md#objectschema)<`Record`<`string`, `any`\>\> |

#### Returns

`boolean`

___

### makeChildrenCollection

▸ **makeChildrenCollection**(`schema`): `ChildrenDecorator`

Creates new schema-like object containing all child entities in a Map.
You can subscribe to `onAdd` and `onRemove` the same way as with
any other collections.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`Schema`](modules.md#schema)<`any`, `any`\> | schema object of all child entities in given container entity |

#### Returns

`ChildrenDecorator`
