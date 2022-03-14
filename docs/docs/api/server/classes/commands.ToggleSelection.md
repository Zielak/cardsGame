---
id: "commands.ToggleSelection"
title: "Class: ToggleSelection"
sidebar_label: "commands.ToggleSelection"
custom_edit_url: null
---

[commands](../namespaces/commands.md).ToggleSelection

## Hierarchy

- [`Command`](Command.md)

  ↳ **`ToggleSelection`**

## Constructors

### constructor

• **new ToggleSelection**(`parent`, `idx?`)

Toggle selection marking of items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parent` | [`Target`](../modules.md#target)<`ParentSelecta`\> | target parent of child elements you want to toggle selection |
| `idx?` | `number` \| `number`[] | single number or array of all indexes to toggle. Omit to TOGGLE ALL. These are not "selection indexes" but entity's index in its parent. |

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
