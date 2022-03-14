---
id: "Game"
title: "Class: Game"
sidebar_label: "Game"
sidebar_position: 0
custom_edit_url: null
---

Get events from the game and put everything on the screen.
Provide an interface for the players: play area, settings and others

## Constructors

### constructor

• **new Game**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IGameOptions` |

## Properties

### client

• **client**: `Client`

___

### lobby

• **lobby**: [`LobbyRoom`](LobbyRoom.md)

___

### room

• **room**: [`Room`](Room.md)<`Record`<`string`, `any`\>\>

___

### wss

• **wss**: `WSSOptions`

## Accessors

### sessionID

• `get` **sessionID**(): `string`

If connected to game room, will return its session ID

#### Returns

`string`

## Methods

### create

▸ **create**(`roomName`, `options?`): `Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `roomName` | `string` |
| `options?` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

___

### getAvailableRooms

▸ **getAvailableRooms**(`gameName?`): `Promise`<`RoomAvailable`<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `gameName?` | `string` |

#### Returns

`Promise`<`RoomAvailable`<`any`\>[]\>

___

### join

▸ **join**(`roomName`, `options?`): `Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>

This one is probably useless for game rooms.
Use `joinOrCreate` instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `roomName` | `string` |
| `options?` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>

___

### joinById

▸ **joinById**(`roomId`, `options?`): `Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `roomId` | `string` |
| `options?` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>

___

### joinLobby

▸ **joinLobby**(): `Promise`<[`LobbyRoom`](LobbyRoom.md)\>

#### Returns

`Promise`<[`LobbyRoom`](LobbyRoom.md)\>

___

### joinOrCreate

▸ **joinOrCreate**(`roomName`, `options?`): `Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `roomName` | `string` |
| `options?` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<[`Room`](Room.md)<`Record`<`string`, `any`\>\>\>
