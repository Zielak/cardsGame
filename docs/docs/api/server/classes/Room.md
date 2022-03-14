---
id: "Room"
title: "Class: Room<S>"
sidebar_label: "Room"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md) |

## Hierarchy

- `Room`<`S`\>

  ↳ **`Room`**

## Constructors

### constructor

• **new Room**<`S`\>(`presence?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md)<`S`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `presence?` | `Presence` |

#### Inherited from

colRoom<S\>.constructor

## Properties

### botActivities

• **botActivities**: [`BotNeuron`](../interfaces/BotNeuron.md)<`S`\>[]

___

### botClients

• **botClients**: [`Bot`](Bot.md)[] = `[]`

___

### botRunner

• **botRunner**: `BotRunner`<`S`\>

___

### commandsManager

• **commandsManager**: `CommandsManager`<`S`\>

___

### patchRate

• **patchRate**: `number` = `100`

#### Overrides

colRoom.patchRate

___

### possibleActions

• **possibleActions**: [`ActionsSet`](../modules.md#actionsset)<`S`\>

## Accessors

### allClientsCount

• `get` **allClientsCount**(): `number`

Count all connected clients, with planned bot players

#### Returns

`number`

___

### name

• `get` **name**(): `string`

#### Returns

`string`

## Methods

### addClient

▸ `Protected` **addClient**(`sessionId`): `boolean`

Add human client to `state.clients`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionId` | `string` |

#### Returns

`boolean`

`false` is client is already there or if the game is not yet started

___

### broadcast

▸ **broadcast**(`type`, `message?`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `number` |
| `message?` | `any` |
| `options?` | `BroadcastOptions` |

#### Returns

`void`

#### Overrides

colRoom.broadcast

___

### canGameStart

▸ **canGameStart**(): `boolean`

Override it to state your own conditions of whether the game can be started or not.

#### Returns

`boolean`

___

### handleMessage

▸ **handleMessage**(`message`): `Promise`<`boolean`\>

Handles new incoming event from client (human or bot).

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`ServerPlayerMessage`](../modules.md#serverplayermessage) |

#### Returns

`Promise`<`boolean`\>

`true` if action was executed, `false` if not, or if it failed.

___

### onCreate

▸ **onCreate**(`options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Record`<`string`, `any`\> |

#### Returns

`void`

#### Overrides

colRoom.onCreate

___

### onDispose

▸ **onDispose**(): `void`

#### Returns

`void`

#### Overrides

colRoom.onDispose

___

### onInitGame

▸ **onInitGame**(`options?`): `void`

Will be called right after the game room is created.
Create your game state here: `this.setState(new MyState())`.
Prepare your play area now.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`void`

___

### onJoin

▸ **onJoin**(`newClient`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newClient` | `Client` |

#### Returns

`void`

#### Overrides

colRoom.onJoin

___

### onLeave

▸ **onLeave**(`client`, `consented`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Client` |
| `consented` | `boolean` |

#### Returns

`void`

#### Overrides

colRoom.onLeave

___

### onPlayerTurnEnded

▸ **onPlayerTurnEnded**(`player`): `void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

Invoked when players turn ends

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](Player.md) |

#### Returns

`void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

___

### onPlayerTurnStarted

▸ **onPlayerTurnStarted**(`player`): `void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

Invoked when players turn starts

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](Player.md) |

#### Returns

`void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

___

### onRoundEnd

▸ **onRoundEnd**(): `void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

Invoked when a round is near completion.

#### Returns

`void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

___

### onRoundStart

▸ **onRoundStart**(): `void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

Invoked when each round starts.

#### Returns

`void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

___

### onStartGame

▸ **onStartGame**(`state`): `void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

Will be called when clients agree to start the game.
`state.players` is already populated with all players.
After this function, the game will give turn to the first player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](State.md) |

#### Returns

`void` \| [`Command`](Command.md)<[`State`](State.md)\>[]

___

### removeClient

▸ `Protected` **removeClient**(`sessionId`): `void`

Remove human client from `state.clients`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionId` | `string` |

#### Returns

`void`
