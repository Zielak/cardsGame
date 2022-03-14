---
id: "traits.LabelTrait"
title: "Class: LabelTrait"
sidebar_label: "traits.LabelTrait"
custom_edit_url: null
---

[traits](../namespaces/traits.md).LabelTrait

Adds `name` and `type` properties, useful for querying on server-side and for choosing client-side component.

> TODO: I might move `type` to base Entity class, seems I'm using `type` everywhere anyway

## Constructors

### constructor

• **new LabelTrait**()

## LabelTrait Properties

### name

• **name**: `string`

___

### type

• **type**: `string`

Type should be unique to schema object! If you're extending this schema
and adding new fields - set the new type string!
