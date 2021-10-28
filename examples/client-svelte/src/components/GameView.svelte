<script>
  import { ante, battleOutcome, clients, gameOver, players, round, sessionID } from "../stores";
  import EndScreen from "./EndScreen.svelte";
  import PlayersContainer from "./PlayersContainer.svelte";

  $: opponentID = $clients.find(id => id !== $sessionID)

  $: player = $players.get($sessionID)
  $: opponent = $players.get(opponentID)
</script>

<main
  class="GameView"
  class:tie={$battleOutcome === 'tie'}
>
  {#if $opponent}
    <PlayersContainer opponent clientID={opponentID} playerData={$opponent} />
  {/if}

  <div>
    Round: <strong>{$round}</strong> |
    Ante: <strong>{$ante}</strong>
  </div>
  <div>battleOutcome: {$battleOutcome}</div>

  {#if $player}
    <PlayersContainer clientID={$sessionID} playerData={$player} />
  {/if}
  
  {#if $gameOver}
    <EndScreen/>
  {/if}
</main>

<style lang="scss">
  .GameView {
    text-align: center;
    position: relative;
    
    &.tie {
      background-color: #36aef4;
    }
  }

</style>
