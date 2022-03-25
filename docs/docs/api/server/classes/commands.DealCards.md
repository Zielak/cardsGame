---
id: "commands.DealCards"
title: "Class: DealCards"
sidebar_label: "commands.DealCards"
custom_edit_url: null
---

[commands](../namespaces/commands.md).DealCards

A command which by itself changes nothing,
but applies subCommands and executes these instead.

## Hierarchy

- [`Command`](Command.md)

  ↳ **`DealCards`**

## Constructors

### constructor

• **new DealCards**(`source`, `targets`, `options?`)

Deals `count` cards from this container to other containers.
Eg. hands

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | [`Target`](../modules.md#target)<[`ParentTrait`](ParentTrait.md)\> | will take cards from here |
| `targets` | [`Targets`](../modules.md#targets)<[`ParentTrait`](ParentTrait.md)\> | and put them in these containers |
| `options` | `DealCardsOptions` | - |

#### Overrides

[Command](Command.md).[constructor](Command.md#constructor)

## Properties

### count

• **count**: `number`

___

### onEmptied

• **onEmptied**: () => [`Command`](Command.md)<[`State`](State.md)\>

#### Type declaration

▸ (): [`Command`](Command.md)<[`State`](State.md)\>

##### Returns

[`Command`](Command.md)<[`State`](State.md)\>

___

### source

• **source**: [`TargetHolder`](TargetHolder.md)<[`ParentTrait`](ParentTrait.md)\>

___

### step

• **step**: `number`

___

### targets

• **targets**: [`TargetsHolder`](TargetsHolder.md)<[`ParentTrait`](ParentTrait.md)\>

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
