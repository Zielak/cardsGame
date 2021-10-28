[![CircleCI](https://circleci.com/gh/Zielak/cardsGame/tree/development.svg?style=svg&circle-token=0731ea14fca235ad0b3aaaa4484137faa81d8b47)](https://circleci.com/gh/Zielak/cardsGame/tree/development) [![Coverage Status](https://coveralls.io/repos/github/Zielak/cardsGame/badge.svg?branch=main)](https://coveralls.io/github/Zielak/cardsGame?branch=main)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Zielak_cardsGame&metric=bugs)](https://sonarcloud.io/dashboard?id=Zielak_cardsGame) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Zielak_cardsGame&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=Zielak_cardsGame)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Zielak_cardsGame&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=Zielak_cardsGame) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Zielak_cardsGame&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=Zielak_cardsGame) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Zielak_cardsGame&metric=security_rating)](https://sonarcloud.io/dashboard?id=Zielak_cardsGame)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# `@cardsgame`

Libraries for creating card games in general.

## Packages included

- `@cardsgame/server` - base server-side lib. Just write your own game actions, condition and elements (classic card games elements already included).
- `@cardsgame/client` - base client-side lib. No rendering included/enforced. Gives you neatly packed game state updates, so you could render your game in whatever way you want.
- `@cardsgame/utils` - some utilities used by both server and client side code. You too might find them useful.
- `@cardsgame/types` - TS types for things used in both server and client side code.
- `@cardsgame/entity-traits` - more type definitions, used in server-side lib, can optionally be exposed to your client-side implementation.

## Example usage

In the `./example/` directory you'll find the most basic implementations of this lib. There's one server-side code base and two clients. One is "rendered" with vanilla JS and the other using Svelte.

## Wishlist

Right now I'm focusing on the basics, and I'd love to start working on the following in the future:

- [x] **Play against bots** - in games you define all possible moves and their conditions. Such list could be one day used by simple AI system to choose actions automatically.
- [ ] **Game variants** - most classic card games play different in different regions. I'd like to make it possible to define, select and play what kind of the game you wish to play exactly.
- [ ] **Accessibility** - color blindness, high contrast, keyboard controls, screen readers, voice activation, all the good stuff. Make games accessible to as much people as possible.
- [ ] **Online profiles** - at the very bottom on the list for a reason.
