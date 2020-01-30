<script>
  // # # # # # # # # # # # # # # #
  //
  //  Topbar: Phone
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { links } from "svelte-routing";

  // *** PROPS
  export let title = "";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isSubsectionAriel,
    isSubsectionAri
  } from "../stores.js";

  // *** VARIABLES
  let showAbout = false;
</script>

<style lang="scss">
  @import "../variables.scss";

  .top-bar {
    position: fixed;
    top: 0;
    height: 80px;
    width: 100vw;
    background: $grey;
    border-bottom: $line-style;
    user-select: none;

    .inner {
      height: 100%;
      width: 100%;
      text-align: center;
      line-height: 80px;

      .active {
        font-style: italic;
      }
    }
  }
</style>

<div class="top-bar" use:links>
  <div class="inner">
    <a href="/" class:active={$isSubsectionAriel}>ARIEL</a>
    |
    <a href="ari" class:active={$isSubsectionAri}>ARI</a>
  </div>
</div>
