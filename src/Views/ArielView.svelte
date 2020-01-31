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
  import { format, getYear } from "date-fns";

  // *** COMPONENTS
  import SinglePane from "../Components/SinglePane.svelte";

  // *** GRAPHICS
  import ArielLogo from "../Graphics/ArielLogo.svelte";
  import AriLogo from "../Graphics/AriLogo.svelte";
  import Cross from "../Graphics/Cross.svelte";
  import SubmitArrow from "../Graphics/SubmitArrow.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isSubsectionAriel,
    isSubsectionAri,
    showAbout
  } from "../stores.js";

  // *** PROPS
  export let title = "";
  export let slug = "";
  export let location = {};

  // Set globals
  isYGRG.set(false);
  isAriel.set(true);
  isSubsectionAriel.set(title === "ariel");
  isSubsectionAri.set(title === "ari");

  // *** VARIABLES
  const aboutAriel = loadData('*[_id == "aboutAriel"][0]', {});
  const aboutAri = loadData('*[_id == "aboutAri"][0]', {});
  const generalInformation = loadData('*[_id == "generalInformation"][0]', {});
  const program = loadData('*[_type in [ "program"]]', {});
  const readings = loadData('*[_type in [ "reading"]]', {});

  const formattedDate = (start, end) => {
    const startDate = Date.parse(start);
    const endDate = Date.parse(end);

    const startFormat =
      getYear(startDate) == getYear(endDate) ? "dd.MM" : "dd.MM.yyyy";
    const endFormat = "dd.MM.yyyy";

    return format(startDate, startFormat) + " – " + format(endDate, endFormat);
  };

  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .ariel-view {
    position: fixed;
    left: 80px;
    top: 0;
    width: calc(100vw - 160px);
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
      @include screen-size("small") {
        margin-top: 20px;
      }
    }

    &.right {
      right: 0;
      @include screen-size("small") {
        padding-bottom: $line-height * 6;
        margin-top: 20px;
      }
    }

    .inner-container {
      margin-top: $top-bar-height + 20px;
      margin-right: 30px;
      margin-left: 30px;
      font-size: $font-size-medium;
      line-height: $line-height;
      font-weight: bold;

      @include screen-size("small") {
        margin-right: 10px;
        margin-left: 10px;
      }
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
    user-select: none;

    &.left {
      left: 0;
      box-sizing: border-box;
    }

    &.right {
      right: 0;
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
      margin-bottom: $line-height;
      text-transform: uppercase;
    }
    .date {
      text-align: center;
      margin-bottom: $line-height * 3;
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
    width: calc(50vw);
    z-index: 10000;
    transform: translateX(-100%);
    background: $purple-gradient;
    opacity: 0;
    overflow-y: auto;
    @include hide-scroll;

    @include screen-size("small") {
      width: 100vw;
      top: 80px;
      height: calc(100vh - 80px);
      transform: translateY(100%);
    }

    &.open {
      transition: transform 0.2s $easing, opacity 0.3s $easing;
      transform: translateX(0);
      opacity: 1;
    }

    .inner-container {
      margin-right: 30px;
      margin-left: 30px;
      font-size: $font-size-large;
      line-height: $line-height;
      font-weight: bold;
      width: calc(100% - 100px);

      .bottom-text {
        margin-top: $line-height * 2;
        text-align: center;
        margin-bottom: $line-height * 4;
      }
    }

    .close {
      position: absolute;
      right: 20px;
      top: 15px;
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

  .search {
    width: 300px;
    max-width: 60%;
    position: relative;
    float: right;

    .search-input {
      font-size: $font-size-medium;
      width: 100%;
      border: $line-style;
      outline: none;
      line-height: $line-height;
      height: $line-height * 2.5;
      padding: 5px;
      border-radius: 5px;
      background: $grey;

      @include screen-size("small") {
        border: $mobile-line-style;
      }
    }

    .search-icon {
      position: absolute;
      right: $line-height * 0.35;
      top: $line-height * 0.35;
      width: $line-height * 1.25;
      height: $line-height * 1.25;
    }
  }
</style>

<div class="ariel-view" in:fade>

  <MediaQuery query="(max-width: 700px)" let:matches>
    {#if (matches && !slug) || !matches}
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
                <span
                  on:click={() => {
                    showAbout.set(true);
                  }}
                  class="pseudo-link">
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
    {/if}
  </MediaQuery>

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
              <div class="search">
                <input
                  class="search-input"
                  type="text"
                  placeholder="Search in ARI..." />
                <div class="search-icon">
                  <SubmitArrow />
                </div>
              </div>
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
                <div class="date">{formattedDate(p.startDate, p.endDate)}</div>
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

  <!-- ABOUT -->
  <div class="about-pane" class:open={$showAbout}>
    <div class="inner-container">

      {#if $isSubsectionAriel}
        {#await aboutAriel then aboutAriel}
          <div class="text">
            {@html renderBlockText(aboutAriel.content)}
            <div class="bottom-text">
              {@html renderBlockText(aboutAriel.bottomText)}
            </div>
          </div>
        {/await}
      {/if}

      {#if $isSubsectionAri}
        {#await aboutAri then aboutAri}
          <div class="text">
            {@html renderBlockText(aboutAri.content)}
            <div class="bottom-text">
              {@html renderBlockText(aboutAri.bottomText)}
            </div>
          </div>
        {/await}
      {/if}

    </div>

    <div
      class="close"
      on:click={() => {
        showAbout.set(false);
      }}>
      <Cross />
    </div>

  </div>

</div>
