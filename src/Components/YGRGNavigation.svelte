<script>
  // # # # # # # # # # # # # # # #
  //
  //  Navbar: YGRG
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { navigate } from "svelte-routing";

  // *** VARIABLES
  let expanded = false;

  const transition = e => {
    expanded = true;
    setTimeout(() => {
      navigate("/ygrg");
    }, 400);
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .ygrg-navigation {
    position: fixed;
    top: 0;
    right: 0px;
    height: 100vh;
    width: 100vw;
    background: $grey;
    border-left: $line-style;
    user-select: none;
    transform: translateX(calc(100% - 80px));
    transition: transform 0.3s $easing, opacity 0.3s $easing;
    cursor: pointer;

    @include screen-size("small") {
      bottom: 0;
      height: 100vh;
      width: 100vw;
      border-left: unset;
      border-top: $line-style;
      transform: translateY(calc(100% - 80px));
      top: unset;
    }

    .inner {
      position: absolute;
      top: 0;
      left: 80px;
      width: 100vh;
      height: 80px;
      display: block;
      transform-origin: 0% 0%;
      transform: rotateZ(90deg);
      line-height: 80px;
      padding-left: 20px;
      font-size: 32px;
      font-family: $font-stack-ygrg-extended;
      transition: opacity 0.5s $easing;
      opacity: 1;

      @include screen-size("small") {
        transform: translateY(2px);
        height: 80px;
        width: 100vw;
        font-size: 16px;
      }
    }

    .side-bar-background {
      position: absolute;
      top: 0;
      left: 0px;
      height: 100vh;
      width: 78px;
      background: $grey;
      background: $red-gradient;
      pointer-events: none;
      transform: translateX(100%);
      transition: transform 1s $easing, opacity 1s $easing;
      opacity: 0;

      @include screen-size("small") {
        background: $red-gradient-vertical;
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
      transform: translateX(-2px);
      background: $red-gradient;

      @include screen-size("small") {
        background: $red-gradient-vertical;
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

<div on:click={transition} class="ygrg-navigation" class:expanded>
  <div class="side-bar-background" />
  <div class="inner">YGRG Archive</div>
</div>
