
<script lang="ts">
	import { onMount } from 'svelte';

  export let suit: string = ""
  export let rank: string = ""
  export let faceUp: boolean

	let cardRef;

	onMount(() => {
		cardRef.style.setProperty('--angle', `${(Math.random() - 0.5) * 10}deg`)
	});

</script>

<div bind:this={cardRef} class="Card" class:faceDown={!faceUp} >
  {#if faceUp}
    {#if suit !== ""}<div class="suit">{suit}</div>{/if}
    {#if rank !== ""}<div class="rank">{rank}</div>{/if}
  {/if}
  <slot></slot>
</div>

<style lang="scss">
  .Card {
    box-sizing: border-box;
    width: 4.5em;
    height: 6em;

    text-align: center;

    background-color: white;
    border: 0.05em solid #0003;
    border-radius: 0.25em;
    box-shadow: 0.1em 0.1em 6px 0px #0005;
    transform: rotate(var(--angle));
    cursor: pointer;

    user-select: none;

    &.faceDown {
      margin-right: -3.5em;
      background-color: #834224;
      border: 0.5em solid white;
    }

    .suit,
    .rank {
      font-size: 2em;
    }
  }

</style>
