---
id: "commands.Sequence"
title: "Class: Sequence"
sidebar_label: "commands.Sequence"
custom_edit_url: null
---

[commands](../namespaces/commands.md).Sequence

## Hierarchy

- [`Command`](Command.md)

  ↳ **`Sequence`**

## Constructors

### constructor

• **new Sequence**(`name`, `subCommands`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name this Sequence (useful for debugging) |
| `subCommands` | [`Command`](Command.md)<[`State`](State.md)\>[] |  |

#### Overrides

[Command](Command.md).[constructor](Command.md#constructor)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Command.name

## Methods

### execute

▸ **execute**(`state`, `room`): `Promise`<`void`\>

Run only registered sub commands.
An un-doing of these will be handled by parent class `Command`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |
| `room` | [`Room`](Room.md)<`any`\> |

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
