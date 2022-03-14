---
id: "commands.Noop"
title: "Class: Noop"
sidebar_label: "commands.Noop"
custom_edit_url: null
---

[commands](../namespaces/commands.md).Noop

## Hierarchy

- [`Command`](Command.md)

  ↳ **`Noop`**

## Constructors

### constructor

• **new Noop**(`name?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | provide only if you're using `new Command()` syntax. If you're extending command, just leave it empty - the name will be grabbed from class name. |

#### Inherited from

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

▸ **execute**(): `Promise`<`void`\>

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
