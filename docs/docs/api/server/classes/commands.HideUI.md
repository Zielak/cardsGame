---
id: "commands.HideUI"
title: "Class: HideUI"
sidebar_label: "commands.HideUI"
custom_edit_url: null
---

[commands](../namespaces/commands.md).HideUI

## Hierarchy

- [`Command`](Command.md)

  ↳ **`HideUI`**

## Constructors

### constructor

• **new HideUI**(`uiName`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `uiName` | `string` |

#### Overrides

[Command](Command.md).[constructor](Command.md#constructor)

## Properties

### lastUiName

• **lastUiName**: `string`

___

### lastUiValue

• **lastUiValue**: `string`

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
