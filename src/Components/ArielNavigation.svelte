<script>
  // # # # # # # # # # # # # # # #
  //
  //  Navbar: Ariel
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { navigate } from "svelte-routing";

  // *** COMPONENTS
  import ArielVerticalLogo from "./ArielVerticalLogo.svelte";

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
      bottom: 0;
      height: 100vh;
      width: 100vw;
      border-right: unset;
      border-top: $line-style;
      transform: translateY(calc(100% - 80px));
      top: unset;
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
      transform: translatey(-2px);
      background: $purple-gradient;

      @include screen-size("small") {
        background: $purple-gradient-vertical;
      }

      .side-bar-background {
        display: none;
      }

      .inner {
        opacity: 0;
      }
    }
  }
</style>

<div on:click={transition} class="ariel-navigation" class:expanded>
  <div class="side-bar-background" />
  <div class="inner">
    <ArielVerticalLogo />
  </div>
</div>
