workspace {

  !identifiers hierarchical

  model {
    player = person "Player" "plays the game"

    portal = softwareSystem "Cards Game portal" "Hosts at least one multiplayer cards game room" {
      frontend = container "Web app" "lobby listing, game table rendering, player interaction" "JS-based" 
      backend = container "Node server" "Server-side rooms, gameplay logic" "Node.js"
    }

    cardsGame = softwareSystem "Cards Game Libraries" {
      clinet = container "@cardsgame/client" "library for connecting with server-side"
      server = container "@cardsgame/server" "library providing tools to create game logic"
      utils = container "@cardsgame/utils" "library providing tools to create game logic"
    }

    enterprise colyseus {
      colyseus = softwareSystem "Colyseus libraries" "Provides connectivity server/client and base game state management" {
        client = container "colyseus.js" "client-side connection library" "JS"
        server = container "colyseus" "Server-side connection and state synchronization library" "Node.js"
        schema = container "@colyseus/schema" "state serializer with delta encoding" "JS"
      }
    }

    player -> portal.frontend "Interacts with"

    portal.frontend -> cardsGame.clinet "Uses"
    portal.backend -> cardsGame.server "Uses"

    cardsGame.clinet -> colyseus.client "Implements"
    cardsGame.server -> colyseus.server "Implements"

    cardsGame.clinet -> cardsGame.utils "Uses"
    cardsGame.server -> cardsGame.utils "Uses"
  }

  views {

    systemLandscape "Landscape" {
      include *
      autoLayout
    }

    container portal "Diagram1" {
      include *
      autoLayout
    }

    component portal.frontend "ComponentsFrontend" {
      include *
      autoLayout
    }
    component portal.backend "ComponentsBackend" {
      include *
      autoLayout
    }

    theme default
  }

}
