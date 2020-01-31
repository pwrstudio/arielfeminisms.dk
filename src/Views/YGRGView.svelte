<script>
  // # # # # # # # # # # # # # # #
  //
  //  YGRG VIEW
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
  import Cross from "../Components/Cross.svelte";
  import SinglePane from "../Components/SinglePane.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isSubsectionAriel,
    isSubsectionAri,
    showAbout
  } from "../stores.js";

  // Set globals
  isAriel.set(false);
  isYGRG.set(true);
  isSubsectionAriel.set(false);
  isSubsectionAri.set(false);

  // *** PROPS
  export let slug = "";
  export const location = {};

  // *** VARIABLES
  const aboutYGRG = loadData('*[_id == "aboutYGRG"][0]', {});
  const texts = loadData('*[_type in [ "ygrgText"]]', {});
  const events = loadData('*[_type in [ "event"]]', {});

  const formattedDate = (start, end) => {
    const startDate = Date.parse(start);
    const endDate = Date.parse(end);

    const startFormat =
      getYear(startDate) == getYear(endDate) ? "dd.MM" : "dd.MM.yyyy";
    const endFormat = "dd.MM.yyyy";

    return format(startDate, startFormat) + " – " + format(endDate, endFormat);
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .ygrg-view {
    position: fixed;
    left: 80px;
    top: 0;
    width: calc(100vw - 160px);
    height: 100vh;
    margin: 0;
    padding: 0;

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
    user-select: none;

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
    font-family: $font-stack-ygrg-extended;

    .title {
      text-align: center;
    }
    .date {
      text-align: center;
    }
    .artist {
      text-align: center;
    }
  }

  .active {
    font-style: italic;
  }

  .about-pane {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 50vw;
    background: $grey;
    z-index: 10000;
    transform: translateX(100%);
    background: $red-gradient;
    opacity: 1;
    font-family: $font-stack-ygrg-regular;
    font-weight: normal;
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
      font-weight: bold;
      line-height: $line-height;
      width: calc(100% - 100px);

      .bottom-text {
        margin-top: $line-height * 2;
        text-align: center;
        margin-bottom: $line-height * 4;
        font-family: $font-stack-ariel;
      }
    }

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: $font-size-large;
      height: 24px;
      width: 24px;
      transition: transform 0.3s $easing;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .pseudo-link {
    cursor: pointer;
  }

  .tile {
    border: $line-style;
    border-radius: 4px;
    height: 160px;
    width: calc(32% - 10px);
    display: block;
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
    text-align: center;
    padding-top: 40px;
    font-family: $font-stack-ygrg-regular;

    @include screen-size("small") {
      border: $mobile-line-style;
    }

    .time {
      font-size: $font-size-small;
      margin-bottom: 20px;
    }

    .preview {
      font-size: $font-size-small;
    }
  }
</style>

<div class="ygrg-view" in:fade>

  <MediaQuery query="(max-width: 700px)" let:matches>
    {#if (matches && !slug) || !matches}
      <div class="half-pane left">

        <!-- TOP BAR -->
        <MediaQuery query="(min-width: 700px)" let:matches>
          {#if matches}
            <div class="top-bar left" use:links>
              <div class="left">
                <span
                  on:click={() => {
                    showAbout.set(true);
                  }}
                  class="pseudo-link">
                  ABOUT YGRG
                </span>
              </div>
              <div class="right">SIGN IN</div>
            </div>
          {/if}
        </MediaQuery>

        <!-- INNER CONTAINER -->
        <div class="inner-container">

          <div class="tile-container" use:links>

            {#await texts then texts}
              {#each texts as t}
                <a class="tile" href="/ygrg/text/{t.slug.current}">
                  <div class="title">{t.title}</div>
                  <div class="time">About 2 months ago</div>
                  <div class="preview">Preview</div>
                </a>
              {/each}
              {#each texts as t}
                <a class="tile" href="/ygrg/text/{t.slug.current}">
                  <div class="title">{t.title}</div>
                  <div class="time">About 2 months ago</div>
                  <div class="preview">Preview</div>
                </a>
              {/each}
            {/await}
          </div>

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
            <div class="left active">YGRG ARCHIVE</div>
          </div>
        {/if}
      </MediaQuery>

      <!-- INNER CONTAINER -->
      <div class="inner-container">

        {#await events then events}
          {#each events as e}
            <a href="/ygrg/{e.slug.current}" class="program">
              <div class="title">{e.title}</div>
              <div class="date">{formattedDate(e.startDate, e.endDate)}</div>
              <div class="text">
                {@html renderBlockText(e.content)}
              </div>
            </a>
          {/each}
        {/await}

      </div>
    {/if}

  </div>

  <div class="about-pane" class:open={$showAbout}>
    <div class="inner-container">

      {#await aboutYGRG then aboutYGRG}
        <div class="text">
          {@html renderBlockText(aboutYGRG.content)}
          <div class="bottom-text">
            {@html renderBlockText(aboutYGRG.bottomText)}
          </div>
        </div>
      {/await}

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
