---
id: "Logs"
title: "Class: Logs"
sidebar_label: "Logs"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new Logs**(`name`, `enabled?`, `options?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `enabled` | `boolean` | `false` |
| `options?` | `LogsOptions` | `undefined` |

## Methods

### debug

▸ **debug**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### error

▸ **error**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### group

▸ **group**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### groupCollapsed

▸ **groupCollapsed**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### groupEnd

▸ **groupEnd**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### info

▸ **info**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### log

▸ **log**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### notice

▸ **notice**(...`any`): `void`

**`deprecated`** use `log()` instead

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### setupBrowserLogs

▸ **setupBrowserLogs**(`name`, `style`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `style` | `string` |

#### Returns

`void`

___

### setupServerLogs

▸ **setupServerLogs**(`name`, `style`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `style` | `Chalk` |

#### Returns

`void`

___

### verbose

▸ **verbose**(...`any`): `void`

**`deprecated`** use `debug()` instead

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`

___

### warn

▸ **warn**(...`any`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...any` | `any`[] |

#### Returns

`void`
