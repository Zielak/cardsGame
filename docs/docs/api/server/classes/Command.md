---
id: "Command"
title: "Class: Command<S>"
sidebar_label: "Command"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md) = [`State`](State.md) |

## Hierarchy

- **`Command`**

  ↳ [`Broadcast`](commands.Broadcast.md)

  ↳ [`ChangeIdx`](commands.ChangeIdx.md)

  ↳ [`ChangeParent`](commands.ChangeParent.md)

  ↳ [`DealCards`](commands.DealCards.md)

  ↳ [`DrawOutUntil`](commands.DrawOutUntil.md)

  ↳ [`GameOver`](commands.GameOver.md)

  ↳ [`NextRound`](commands.NextRound.md)

  ↳ [`Noop`](commands.Noop.md)

  ↳ [`PlaceOnGrid`](commands.PlaceOnGrid.md)

  ↳ [`NextPlayer`](commands.NextPlayer.md)

  ↳ [`PreviousPlayer`](commands.PreviousPlayer.md)

  ↳ [`Select`](commands.Select.md)

  ↳ [`Deselect`](commands.Deselect.md)

  ↳ [`ToggleSelection`](commands.ToggleSelection.md)

  ↳ [`Sequence`](commands.Sequence.md)

  ↳ [`ShuffleChildren`](commands.ShuffleChildren.md)

  ↳ [`FaceUp`](commands.FaceUp.md)

  ↳ [`FaceDown`](commands.FaceDown.md)

  ↳ [`Flip`](commands.Flip.md)

  ↳ [`RevealUI`](commands.RevealUI.md)

  ↳ [`HideUI`](commands.HideUI.md)

  ↳ [`Wait`](commands.Wait.md)

## Constructors

### constructor

• **new Command**<`S`\>(`name?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](State.md)<`S`\> = [`State`](State.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | provide only if you're using `new Command()` syntax. If you're extending command, just leave it empty - the name will be grabbed from class name. |

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

## Methods

### execute

▸ **execute**(`state`, `room`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `room` | [`Room`](Room.md)<`S`\> |

#### Returns

`Promise`<`void`\>

___

### subExecute

▸ `Protected` **subExecute**(`state`, `room`, `command`): `Promise`<`void`\>

Execute a sub command.
Call ONLY during your commands `execute` method.
Will also remember it internally for undoing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `room` | [`Room`](Room.md)<`any`\> |
| `command` | [`Command`](Command.md)<[`State`](State.md)\> |

#### Returns

`Promise`<`void`\>

___

### undo

▸ **undo**(`state`, `room`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `room` | [`Room`](Room.md)<`S`\> |

#### Returns

`Promise`<`void`\>

▸ **undo**(`state`, `room`): `Promise`<`void`\>

Undoes every remembered extra sub command.
`Command` may gather new sub commands only while executing.
`Sequence` will only gather sub commands upon construction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `room` | [`Room`](Room.md)<`any`\> |

#### Returns

`Promise`<`void`\>
