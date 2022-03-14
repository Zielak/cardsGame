---
id: "commands.NextRound"
title: "Class: NextRound"
sidebar_label: "commands.NextRound"
custom_edit_url: null
---

[commands](../namespaces/commands.md).NextRound

## Hierarchy

- [`Command`](Command.md)

  ↳ **`NextRound`**

## Constructors

### constructor

• **new NextRound**(`name?`)

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

▸ **execute**(`state`, `room`): `Promise`<`void`\>

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
| `room` | [`Room`](Room.md)<`any`\> |

#### Returns

`Promise`<`void`\>

#### Overrides

[Command](Command.md).[undo](Command.md#undo)
