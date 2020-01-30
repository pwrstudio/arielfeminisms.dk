<script>
  // # # # # # # # # # # # # # # #
  //
  //  View: Ariel/Ari
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { Route, links } from "svelte-routing";
  import { loadData, renderBlockText } from "../sanity.js";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";

  // *** COMPONENTS
  import ArielLogo from "../Components/ArielLogo.svelte";
  import AriLogo from "../Components/AriLogo.svelte";
  import Cross from "../Components/Cross.svelte";
  import SinglePane from "../Components/SinglePane.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isSubsectionAriel,
    isSubsectionAri
  } from "../stores.js";

  // *** PROPS
  export let title = "";
  export let slug = "";
  export const location = {};

  // Set globals
  isYGRG.set(false);
  isAriel.set(true);
  isSubsectionAriel.set(title === "ariel");
  isSubsectionAri.set(title === "ari");

  // *** VARIABLES
  let showAbout = false;
  const aboutAriel = loadData('*[_id == "aboutAriel"][0]', {});
  const aboutAri = loadData('*[_id == "aboutAri"][0]', {});
  const generalInformation = loadData('*[_id == "generalInformation"][0]', {});
  const program = loadData('*[_type in [ "program"]]', {});
  const readings = loadData('*[_type in [ "reading"]]', {});
</script>

<style lang="scss">
  @import "../variables.scss";

  .ariel-view {
    position: fixed;
    left: 0;
    top: 0;
    width: calc(100vw - 80px);
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: $font-stack-ariel;

    @include screen-size("small") {
      position: static;
      width: 100vw;
    }
  }

  .half-pane {
    position: absolute;
    top: 0;
    height: 100vh;
    width: 50%;
    overflow-y: auto;
    @include hide-scroll;

    @include screen-size("small") {
      margin-top: $top-bar-height;
      position: static;
      height: auto;
      width: 100vw;
    }

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }

    .inner-container {
      margin-top: $top-bar-height + 20px;
      margin-right: 30px;
      margin-left: 30px;
      font-size: $font-size-medium;
      font-weight: bold;
    }

    .bottom-meta {
      margin-top: 30px;
      text-align: center;
    }
  }

  .top-bar {
    position: absolute;
    top: 0;
    height: $top-bar-height;
    width: 100%;
    line-height: $top-bar-height;
    padding-left: 30px;
    padding-right: 30px;
    font-weight: bold;
    font-size: $font-size-large;

    &.left {
      //   background: $black;
      left: 0;
      //   background: red;
      box-sizing: border-box;
    }

    &.right {
      //   background: white;
      right: 0;
      //   background: green;
      box-sizing: border-box;
    }

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }

  .program {
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
    .title {
      text-align: center;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    .date {
      text-align: center;
      margin-bottom: 40px;
    }
    .artist {
      text-align: center;
      text-transform: uppercase;
    }
  }

  .active {
    font-style: italic;
  }

  .about-pane {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: calc(50vw - 30px);
    background: pink;
    z-index: 10000;
    transform: translateX(-100%);
    background: $purple-gradient;
    font-size: $font-size-large;
    opacity: 0;
    overflow-y: auto;
    @include hide-scroll;

    &.open {
      transition: transform 0.2s $easing, opacity 0.3s $easing;
      transform: translateX(0);
      opacity: 1;
    }

    .inner-container {
      margin-top: $top-bar-height + 20px;
      margin-right: 30px;
      margin-left: 30px;
      font-size: $font-size-large;
      font-weight: bold;
    }

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      height: 24px;
      width: 24px;
      transition: transform 0.3s $easing;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .pseudo-link {
    cursor: pointer;
  }
</style>

<div class="ariel-view" in:fade>
  <div class="half-pane left">

    <!-- TOP BAR -->
    <MediaQuery query="(min-width: 700px)" let:matches>
      {#if matches}
        <div class="top-bar left" use:links>
          <div class="left">
            <a href="/" class:active={$isSubsectionAriel}>ARIEL</a>
            |
            <a href="ari" class:active={$isSubsectionAri}>ARI</a>
          </div>
          <div class="right">
            <span on:click={() => (showAbout = true)} class="pseudo-link">
              ABOUT
            </span>
          </div>
        </div>
      {/if}
    </MediaQuery>

    <!-- INNER CONTAINER -->
    <div class="inner-container">

      <!-- LOGO -->
      {#if $isSubsectionAriel}
        <ArielLogo />
      {/if}
      {#if $isSubsectionAri}
        <AriLogo />
      {/if}

      <!-- BOTTOM META-->
      {#await generalInformation then generalInformation}
        <div class="bottom-meta">
          <div class="tagline">{generalInformation.tagline}</div>
          <div class="address">
            {@html generalInformation.address}
          </div>
        </div>
      {/await}
    </div>

  </div>

  <div class="half-pane right">

    {#if slug}
      <SinglePane {slug} />
    {:else}
      <!-- TOP BAR -->
      <MediaQuery query="(min-width: 700px)" let:matches>
        {#if matches}
          <div class="top-bar right">
            {#if $isSubsectionAriel}
              <div class="left active">ARIEL PROGRAM</div>
            {/if}
            {#if $isSubsectionAri}
              <div class="left active">ARI READINGS</div>
            {/if}
          </div>
        {/if}
      </MediaQuery>

      <!-- INNER CONTAINER -->
      <div class="inner-container" use:links>
        {#if $isSubsectionAriel}
          {#await program then program}
            {#each program as p}
              <a href="/{p.slug.current}" class="program">
                <div class="title">{p.title}</div>
                <div class="artist">
                  {#each p.artists as a}
                    <span>{a},</span>
                  {/each}
                </div>
                <div class="date">
                  {p.startDate.substring(0, 9)} – {p.endDate.substring(0, 9)}
                </div>
                <div class="text">
                  {@html renderBlockText(p.content)}
                </div>
              </a>
            {/each}
          {/await}
        {/if}

        {#if $isSubsectionAri}
          {#await readings then readings}
            {#each readings as r}
              <div class="program">
                <div class="title">{r.title}</div>
                <div class="text">
                  {@html renderBlockText(r.content)}
                </div>
              </div>
            {/each}

          {/await}
        {/if}

      </div>
    {/if}

  </div>

  <div class="about-pane" class:open={showAbout}>
    <div class="inner-container">

      {#if $isSubsectionAriel}
        {#await aboutAriel then aboutAriel}
          <div class="text">
            {@html renderBlockText(aboutAriel.content)}
          </div>
        {/await}
      {/if}

      {#if $isSubsectionAri}
        {#await aboutAri then aboutAri}
          <div class="text">
            {@html renderBlockText(aboutAri.content)}
          </div>
        {/await}
      {/if}

    </div>

    <div class="close" on:click={() => (showAbout = false)}>
      <Cross />
    </div>

  </div>

</div>
