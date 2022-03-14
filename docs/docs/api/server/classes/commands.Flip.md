---
id: "commands.Flip"
title: "Class: Flip"
sidebar_label: "commands.Flip"
custom_edit_url: null
---

[commands](../namespaces/commands.md).Flip

Flip the element to reveal its other side

## Hierarchy

- [`Command`](Command.md)

  ↳ **`Flip`**

## Constructors

### constructor

• **new Flip**(`entities`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entities` | [`Targets`](../modules.md#targets)<[`TwoSidedTrait`](traits.TwoSidedTrait.md)\> |

#### Overrides

[Command](Command.md).[constructor](Command.md#constructor)

## Properties

### targets

• **targets**: [`TargetsHolder`](TargetsHolder.md)<[`TwoSidedTrait`](traits.TwoSidedTrait.md)\>

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