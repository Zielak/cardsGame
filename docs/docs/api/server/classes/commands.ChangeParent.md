---
id: "commands.ChangeParent"
title: "Class: ChangeParent"
sidebar_label: "commands.ChangeParent"
custom_edit_url: null
---

[commands](../namespaces/commands.md).ChangeParent

## Hierarchy

- [`Command`](Command.md)

  ↳ **`ChangeParent`**

## Constructors

### constructor

• **new ChangeParent**(`entities`, `target`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entities` | [`Targets`](../modules.md#targets)<[`ChildTrait`](traits.ChildTrait.md)\> |
| `target` | [`Target`](../modules.md#target)<[`ParentTrait`](traits.ParentTrait.md)\> |
| `options` | `ChangeParentOptions` |

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

▸ **undo**(`state`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[Command](Command.md).[undo](Command.md#undo)
