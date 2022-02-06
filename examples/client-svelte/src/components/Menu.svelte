<script lang="ts">
import { game } from "../gameHandler";
import { clientJoined, gameStarted, readyToStart } from "../stores";

  const handleQuickJoin = () => {
    game.quickJoin()
  }
  const handleStart = () => {
    game.room.send("start")
  }
  const handleAddBot = () => {
    game.room.send("bot_add")
  }
  
</script>

<nav>
  <ol>
    <li>
      <button type="button"
        on:click={handleQuickJoin}
        disabled={$clientJoined}
      >
        Quick join some room
      </button>
    </li>
    <li>
      Wait fot other player to join, or
      <button type="button"
        on:click={handleAddBot}
        disabled={!($clientJoined && !$gameStarted)}
      >
        Add Bot
      </button>
    </li>
    <li>
      <button type="button"
        class="StartButton"
        on:click={handleStart}
        disabled={!$readyToStart}
      >Start game</button>
    </li>
  </ol>
</nav>

<style lang="scss">
  .StartButton:not(:disabled) {
    background: linear-gradient(
      250deg,
      #ff8f75,
      #c7fb28,
      #28fbea,
      #f028fb,
      #ff8f75
    );
    background-size: 8000% 100%;
    border: 1px solid gray;
    border-radius: 2px;

    animation: AnimationName 2s linear infinite;
  }
  @keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
</style>
