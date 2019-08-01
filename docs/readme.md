[![CircleCI](https://circleci.com/gh/Zielak/cardsGame/tree/master.svg?style=svg&circle-token=0731ea14fca235ad0b3aaaa4484137faa81d8b47)](https://circleci.com/gh/Zielak/cardsGame/tree/master)

# `@cardsgame`

Library for creating card games in general.

## Packages included

- `@cardsgame/server` - base server-side lib. Just write your own game actions, condition and elemens (classic card games already included)
- `@cardsgame/client` - base client-side lib.
- `@cardsgame/utils` - some utilities used by both server and client side code.
- `@cardsgame/types` - TS types for things used in both server and client side code.

## Example usage

[@cardsgame/examples](https://github.com/Zielak/cardsGame-examples) - all @cardsgame packages stiched up together with HTTPS server and React on the client. Use it as an example of how to use both server and client side code.

## Wishlist

Right now I'm focusing on the basics, and I'd love to start working on the following:

- **Game variants** - most classic card games play different in different regions. I'd like to make it possible to define, select and play what kind of the game you wish to play exactly.
- **Play against bots** - in games you define all possible moves and their conditions. Such list could be one day used by simple AI system to choose actions automatically.
- **Accessibility** - color blindness, high contrast, keyboard controls, screen readers, voice activation, all the good stuff. Make games accessible to as much people as possible.
- **Online profiles** - at the very bottom on the list for a reason.
