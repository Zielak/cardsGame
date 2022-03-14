---
id: "IRoom"
title: "Interface: IRoom<S>"
sidebar_label: "IRoom"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](../classes/State.md) |

## Properties

### botActivities

• `Optional` **botActivities**: [`BotNeuron`](BotNeuron.md)<`S`\>[]

## Methods

### canGameStart

▸ **canGameStart**(): `boolean`

#### Returns

`boolean`

___

### onInitGame

▸ **onInitGame**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`void`

___

### onPlayerTurnEnded

▸ **onPlayerTurnEnded**(`player`): `void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |

#### Returns

`void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

___

### onPlayerTurnStarted

▸ **onPlayerTurnStarted**(`player`): `void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |

#### Returns

`void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

___

### onRoundEnd

▸ **onRoundEnd**(): `void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

#### Returns

`void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

___

### onRoundStart

▸ **onRoundStart**(): `void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

#### Returns

`void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

___

### onStartGame

▸ **onStartGame**(`state`): `void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |

#### Returns

`void` \| [`Command`](../classes/Command.md)<[`State`](../classes/State.md)\>[]
