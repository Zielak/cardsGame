---
sidebar_position: 1
---

# Introduction

:::danger

The libraries are still work in progress.

This documentation is incomplete.

Everything may change at any time.

:::

To create your own cards game you need at least two ingredients:

- Client-side renderer, using data provided by `@cardsgame/client` package.
- Server-side game logic, using tools from `@cardsgame/server` package,

To get started follow these docs to create the most basic game.

## Client side

Create your game elements using any renderer/ui library you like. `@cardsgame/client` will help you send interaction events to the server, and receive game state updates, so you can update game elements.

## Server side

Validates incoming interaction events from players using **set of rules** and executes them, _or not_ if the move was invalid.
