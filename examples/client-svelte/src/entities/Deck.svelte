<script lang="ts">
  import {onMount} from 'svelte'

  import { game } from "../gameHandler";
  import Card from "./Card.svelte";

  export let deckCount: number
  export let idxPath: string

  let ref:HTMLDivElement
  onMount(() => {
    ref.dataset["idxPath"] = idxPath
  })
  
  const handleDeckClick = (event) => {
    const idxPath = event.currentTarget.dataset["idxPath"].split(",")
    console.log(`room.sendInteraction(tap, ${idxPath})`)
    game.room.sendInteraction("tap", idxPath)
  }
</script>

<div
  bind:this={ref}
  on:click={handleDeckClick}
  class="deck"
  role="button"
>
  <Card faceUp={false}>
    Deck of
    <div class="cardsCount">{deckCount}</div>
    cards
  </Card>
</div>

<style lang="scss">
  .deck {
    height: 6em;
    margin-bottom: 0.5em;
    
    .cardsCount {
      font-size: 2em;
    }
  }
</style>
