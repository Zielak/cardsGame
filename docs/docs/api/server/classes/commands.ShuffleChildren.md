---
id: "commands.ShuffleChildren"
title: "Class: ShuffleChildren"
sidebar_label: "commands.ShuffleChildren"
custom_edit_url: null
---

[commands](../namespaces/commands.md).ShuffleChildren

## Hierarchy

- [`Command`](Command.md)

  ↳ **`ShuffleChildren`**

## Constructors

### constructor

• **new ShuffleChildren**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | [`Target`](../modules.md#target)<[`ParentTrait`](ParentTrait.md)\> |

#### Overrides

[Command](Command.md).[constructor](Command.md#constructor)

## Properties

### target

• **target**: [`TargetHolder`](TargetHolder.md)<[`ParentTrait`](ParentTrait.md)\>

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Command.name

## Methods

### execute

▸ **execute**(`state`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[Command](Command.md).[execute](Command.md#execute)

___

### subExecute

▸ `Protected` **subExecute**(`state`, `room`, `command`): `Promise`<`void`\>

Execute a sub command.
Call ONLY during your commands `execute` method.
Will also remember it internally for undoing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `room` | [`Room`](Room.md)<`any`\> |
| `command` | [`Command`](Command.md)<[`State`](State.md)\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Command](Command.md).[subExecute](Command.md#subexecute)

___

### undo

▸ **undo**(`state`, `room`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `room` | [`Room`](Room.md)<[`State`](State.md)\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Command](Command.md).[undo](Command.md#undo)

▸ **undo**(`state`, `room`): `Promise`<`void`\>

Undoes every remembered extra sub command.
`Command` may gather new sub commands only while executing.
`Sequence` will only gather sub commands upon construction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `room` | [`Room`](Room.md)<`any`\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Command](Command.md).[undo](Command.md#undo)
