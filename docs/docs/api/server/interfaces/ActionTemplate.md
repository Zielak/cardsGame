---
id: "ActionTemplate"
title: "Interface: ActionTemplate<S>"
sidebar_label: "ActionTemplate"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](../classes/State.md) |

## Properties

### description

• `Optional` **description**: `string`

___

### interaction

• **interaction**: `string` \| (`player`: [`Player`](../classes/Player.md)) => `QuerableProps`[]

Either a function returning queries for associated entities
OR a string for event type.

___

### name

• **name**: `string`

## Methods

### command

▸ **command**(`state`, `event`): [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>

Generate a `Command` to run for this action.
Use `Sequence()` if you need to run multiple commands.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `event` | [`ServerPlayerMessage`](../modules.md#serverplayermessage) |

#### Returns

[`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>

___

### conditions

▸ **conditions**(`con`): `void`

This action will be ignored when one of the assertions fail.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `con` | [`ClientMessageConditions`](../classes/ClientMessageConditions.md)<`S`\> | contains references to "command", "event", "data", "player" and "entity". Default subject is set to the game state. |

#### Returns

`void`
