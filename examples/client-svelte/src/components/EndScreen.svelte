<script lang="ts">
  import { winner } from "../stores";
</script>

<div class="EndScreen">
  <h1>GAME OVER</h1>
  <p>Player {$winner} is the winner!</p>
</div>

<style lang="scss">
  .EndScreen {
    display: flex;
    position: absolute;
    flex-direction: column;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1em;
    font-size: 1.5em;
    background: #030c;
    color: white;
  }
</style>
