---
id: "commands.FaceDown"
title: "Class: FaceDown"
sidebar_label: "commands.FaceDown"
custom_edit_url: null
---

[commands](../namespaces/commands.md).FaceDown

Reveal the back side (revers) of an element

## Hierarchy

- [`Command`](Command.md)

  ↳ **`FaceDown`**

## Constructors

### constructor

• **new FaceDown**(`entities`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entities` | [`Targets`](../modules.md#targets)<[`TwoSidedTrait`](TwoSidedTrait.md)\> |

#### Overrides

[Command](Command.md).[constructor](Command.md#constructor)

## Properties

### targets

• **targets**: [`TargetsHolder`](TargetsHolder.md)<[`TwoSidedTrait`](TwoSidedTrait.md)\>

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
