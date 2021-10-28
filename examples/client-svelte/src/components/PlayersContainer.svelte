<script lang="ts">
  import { battleOutcome } from "../stores";
  import Deck from "../entities/Deck.svelte";
  import Pile from "../entities/Pile.svelte";

  export let opponent=false
  export let playerData: PlayerData
  export let clientID: string

  $: playersCards = [...playerData.pile.values()]
</script>

<div
  class="PlayerContainer"
  class:disconnected={!playerData.connected}
  class:looser={$battleOutcome !== "" && $battleOutcome !== clientID}
  class:reversed={opponent}
>
  <header>
    <h2>Opponent <em>{playerData.played ? "played" : "THINKING"}</em></h2>
    <p>(clientID: <span class="clientID">{clientID}</span>)</p>
  </header>
  <Deck deckCount={playerData.deckCount} idxPath={`${playerData.idx},0`}/>
  <Pile cards={playersCards} />
</div>

<style lang="scss">
  .PlayerContainer {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    
    &.reversed {
      flex-direction: column;
    }

    &.disconnected {
      opacity: 0.5;
    }

    &.looser {
      background-color: #f44336;
    }
  }
</style>
