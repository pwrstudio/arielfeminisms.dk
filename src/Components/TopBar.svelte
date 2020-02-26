<script>
  // # # # # # # # # # # # # # # #
  //
  //  Topbar: Phone
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { links, navigate } from "svelte-routing";
  import { slide, fade } from "svelte/transition";

  // *** GRAPHICS
  import Cross from "../Graphics/Cross.svelte";
  import Ellipse from "../Graphics/Ellipse.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isAri,
    showAbout,
    showProgram,
    showEvents,
    showReadings,
    userLoaded,
    loggedInUser
  } from "../stores.js";

  // *** VARIABLES
  let open = false;

  const toggleAbout = () => {
    showAbout.set(true);
    open = false;
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .top-bar {
    position: fixed;
    top: 0;
    height: 60px;
    width: 100vw;
    background: $grey;
    border-bottom: $line-style;
    user-select: none;

    @include screen-size("small") {
      border-bottom: $mobile-line-style;
    }

    .inner {
      height: 100%;
      width: 100%;
      text-align: center;
      line-height: 60px;

      .active {
        border-bottom: $line-style;
      }
    }
  }

  .hamburger {
    position: absolute;
    top: 5px;
    left: 20px;

    transition: transform 0.3s $easing;

    svg {
      fill: none;
      stroke: $black;
      stroke-width: 1.85px;
      width: 40px;
      margin-top: 10px;
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  .mobile-menu {
    position: fixed;
    top: 60px;
    width: 100vw;
  }

  .mobile-menu-item {
    display: block;
    height: 60px;
    width: 100vw;
    text-align: center;
    line-height: 60px;
    border-bottom: $line-style;
    cursor: pointer;
    background: $grey;

    @include screen-size("small") {
      border-bottom: $mobile-line-style;
    }
  }

  .close {
    position: absolute;
    left: 26px;
    top: 16px;
    font-size: $font-size-large;
    height: 26px;
    width: 26px;
    transition: transform 0.3s $easing;

    &:hover {
      transform: scale(1.1);
    }
  }
</style>

<div class="mobile-nav">
  <div class="top-bar" use:links>

    {#if open}
      <div
        class="close"
        on:click={() => {
          open = false;
        }}>
        <Cross />
      </div>
    {:else}
      <div
        class="hamburger"
        on:click={() => {
          open = true;
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.54 48.52">
          <line class="cls-1" y1="0.93" x2="66.54" y2="0.93" />
          <line class="cls-1" y1="24.26" x2="66.54" y2="24.26" />
          <line class="cls-1" y1="47.59" x2="66.54" y2="47.59" />
        </svg>
      </div>
    {/if}
    <div class="inner">
      {#if $isAriel || $isAri}
        <a href="/" class:active={$isAriel}>ARIEL</a>
        |
        <a href="/ari" class:active={$isAri}>ARI.</a>
      {/if}
      {#if $isYGRG}
        <a href="/ygrg">YGRG ARCHIVE</a>
      {/if}

    </div>
  </div>

  {#if open}
    <div class="mobile-menu" use:links in:slide={{ duration: 200 }}>
      {#if $isAriel}
        <div
          class="mobile-menu-item"
          on:click={() => {
            open = false;
            navigate('/ariel/program');
          }}>
          PROGRAM
        </div>
        <div class="mobile-menu-item" on:click={toggleAbout}>ABOUT ARIEL</div>
      {/if}

      {#if $isAri}
        <div
          class="mobile-menu-item"
          on:click={() => {
            open = false;
            navigate('/ari/readings');
          }}>
          READINGS
        </div>
        <div class="mobile-menu-item" on:click={toggleAbout}>ABOUT ARI.</div>
      {/if}

      {#if $isYGRG}
        <div
          class="mobile-menu-item"
          on:click={() => {
            open = false;
            navigate('/ygrg/events');
          }}>
          EVENTS
        </div>
        <div class="mobile-menu-item" on:click={toggleAbout}>ABOUT YGRG</div>
        <div
          class="mobile-menu-item"
          on:click={() => {
            open = false;
            navigate('/ygrg/profile');
          }}>
          {#if $userLoaded}
            {#if $loggedInUser}MY PROFILE{:else}SIGN IN{/if}
          {:else}
            <Ellipse />
          {/if}
        </div>
      {/if}

    </div>
  {/if}
</div>
