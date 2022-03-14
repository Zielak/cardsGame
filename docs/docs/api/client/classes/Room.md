---
id: "Room"
title: "Class: Room<MoreProps>"
sidebar_label: "Room"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `MoreProps` | `Record`<`string`, `any`\> |

## Constructors

### constructor

• **new Room**<`MoreProps`\>(`room`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MoreProps` | `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `room` | `Room`<`any`\> |

## Properties

### room

• **room**: `Room`<`any`\>

## Accessors

### id

• `get` **id**(): `string`

#### Returns

`string`

___

### sessionID

• `get` **sessionID**(): `string`

#### Returns

`string`

___

### state

• `get` **state**(): [`ClientGameState`](../modules.md#clientgamestate)<`MoreProps`\>

#### Returns

[`ClientGameState`](../modules.md#clientgamestate)<`MoreProps`\>

## Methods

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

___

### leave

▸ **leave**(): `void`

#### Returns

`void`

___

### onError

▸ **onError**(`code`, `message`): `void`

**`override`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `message` | `string` |

#### Returns

`void`

___

### onFirstStateChange

▸ **onFirstStateChange**(`state`): `void`

**`override`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ClientGameState`](../modules.md#clientgamestate)<`MoreProps`\> |

#### Returns

`void`

___

### onLeave

▸ **onLeave**(`code`): `void`

**`override`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `number` | webSocket shutdown code |

#### Returns

`void`

___

### onMessage

▸ **onMessage**<`T`\>(`type`, `callback`): () => `void`

Subscribe to messages from the server

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `ServerMessage` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `callback` | (`message`: { `data`: `T`  }) => `void` |

#### Returns

`fn`

method to unsubscribe

▸ (): `void`

Subscribe to messages from the server

##### Returns

`void`

method to unsubscribe

___

### onStateChange

▸ **onStateChange**(`state`): `void`

**`override`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ClientGameState`](../modules.md#clientgamestate)<`MoreProps`\> |

#### Returns

`void`

___

### send

▸ **send**(`type`, `message?`): `void`

Send a custom message from client to server.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `message?` | `ClientPlayerMessage` |

#### Returns

`void`

___

### sendInteraction

▸ **sendInteraction**(`event`, `entityIdxPath`, `data?`): `void`

Sends an event related to entity interaction.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `event` | `MouseEvent` \| `TouchEvent` | `undefined` | mouse or touch event. `event.type` will be grabbed from it automatically. |
| `entityIdxPath` | `number`[] | `undefined` | - |
| `data` | `any` | `undefined` | - |

#### Returns

`void`
