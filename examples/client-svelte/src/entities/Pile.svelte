<script lang="ts">
  import Card from "./Card.svelte";

  export let cards: CardData[]
</script>

<div class="pile">
  {#each cards as card}
    <Card rank={card.rank} suit={card.suit} faceUp={card.faceUp}/>
  {/each}
</div>

<style lang="scss">
  .pile {
    display: flex;
    width: 100%;
    height: 6em;
    margin-bottom: 0.5em;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: row;
    justify-content: center;
  }
</style>
