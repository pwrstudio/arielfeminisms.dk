<script>
  // # # # # # # # # # # # # # # #
  //
  //  Navbar: Ariel
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { navigate } from "svelte-routing";
  import MediaQuery from "svelte-media-query";

  // *** GRAPHICS
  import ArielVerticalLogo from "../Graphics/ArielVerticalLogo.svelte";
  import ArielHorizontalLogo from "../Graphics/ArielHorizontalLogo.svelte";

  // *** VARIABLES
  let expanded = false;

  const transition = e => {
    expanded = true;
    setTimeout(() => {
      navigate("/");
    }, 400);
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .ariel-navigation {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: $grey;
    border-right: $line-style;
    user-select: none;
    transform: translateX(calc(-100% + 80px));
    transition: transform 0.3s $easing, opacity 0.3s $easing;
    cursor: pointer;

    @include screen-size("small") {
      bottom: -2px;
      height: calc(100vh + 2px);
      width: 100vw;
      border-right: unset;
      border-top: $mobile-line-style;
      transform: translateY(calc(100% - 80px));
      top: unset;
    }

    .arrow-up {
      display: flex;
      justify-content: center;

      svg {
        fill: none;
        stroke: $black;
        stroke-width: 1.85px;
        width: 30px;
        margin-top: 10px;
      }
    }

    .inner {
      position: absolute;
      top: 0;
      right: 0px;
      height: 100vh;
      width: 80px;
      display: block;
      line-height: 80px;
      padding-left: 20px;
      padding-top: 20px;
      transition: opacity 0.5s $easing;
      opacity: 1;

      @include screen-size("small") {
        height: 80px;
        width: 100vw;
        padding-left: 0px;
        padding-top: 30px;

        display: flex;
        justify-content: center;
      }
    }

    .side-bar-background {
      position: absolute;
      top: 0;
      right: 0;
      height: 100vh;
      width: 78px;
      background: $purple-gradient;
      pointer-events: none;
      transform: translateX(-100%);
      transition: transform 1s $easing, opacity 1s $easing;
      opacity: 0;

      @include screen-size("small") {
        transform: none;
        height: 80px;
        width: 100vw;
        transform: translateY(100%);
      }
    }

    &:hover {
      .side-bar-background {
        transform: translateX(0);
        transition: transform 0.3s $easing, opacity 0.5s $easing;
        opacity: 1;

        @include screen-size("small") {
          transform: translateY(0);
        }
      }
    }

    &.expanded {
      transform: translateX(2px);
      background: $purple-gradient;

      @include screen-size("small") {
        transform: translateY(-2px);
        background: $purple-gradient-vertical;
        border-top: none;
      }

      .side-bar-background {
        display: none;
      }

      .inner {
        opacity: 0;
      }

      .arrow-up {
        display: none;
      }
    }
  }
</style>

<div on:click={transition} class="ariel-navigation" class:expanded>
  <div class="side-bar-background" />
  <MediaQuery query="(max-width: 700px)" let:matches>
    {#if matches}
      <div class="arrow-up">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.21 10.36">
          <polyline class="cls-1" points="0.37 9.51 20.08 1.01 39.85 9.51" />
        </svg>
      </div>
    {/if}
  </MediaQuery>
  <div class="inner">
    <MediaQuery query="(max-width: 700px)" let:matches>
      {#if matches}
        <ArielHorizontalLogo />
      {:else}
        <ArielVerticalLogo />
      {/if}
    </MediaQuery>
  </div>
</div>
