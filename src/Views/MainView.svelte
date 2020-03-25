<script>
  // # # # # # # # # # # # # # # #
  //
  //  Main View
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { links, navigate } from "svelte-routing";
  import { loadData, renderBlockText, toPlainText } from "../sanity.js";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";
  import Fuse from "fuse.js";
  import get from "lodash/get";

  // *** GLOBALS
  import { formattedDate } from "../global.js";

  // *** COMPONENTS
  import SinglePane from "../Components/SinglePane.svelte";
  import SignIn from "../Components/SignIn.svelte";
  import TextTile from "../Components/TextTile.svelte";
  import MetaData from "../Components/MetaData.svelte";
  import Listing from "../Components/Listing.svelte";

  // *** GRAPHICS
  import ArielLogo from "../Graphics/ArielLogo.svelte";
  import AriLogo from "../Graphics/AriLogo.svelte";
  import Cross from "../Graphics/Cross.svelte";
  import SubmitArrow from "../Graphics/SubmitArrow.svelte";
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
    loggedInUser,
    userLoaded
  } from "../stores.js";

  // *** PROPS
  export let title = "";
  export let slug = "";
  export let location = {};
  export let listing = false;
  export let single = false;
  export let profile = false;

  // Set globals
  showAbout.set(false);
  isAriel.set(title === "ariel");
  isAri.set(title === "ari");
  isYGRG.set(title === "ygrg");

  // TEXTS
  const texts = loadData('*[_type == "ygrgText"]', {});
  let filteredTexts = [];
  let filterTexts = () => {};
  let fuseTexts = {};
  let queryTextsFilter = "";
  const optionsTextsFilter = {
    keys: ["title"],
    tokenize: true,
    matchAllTokens: true,
    shouldSort: true,
    threshold: 0.2,
    minMatchCharLength: 2
  };

  texts.then(results => {
    filteredTexts = results;
    fuseTexts = new Fuse(results, optionsTextsFilter);
    filterTexts = () => {
      filteredTexts =
        queryTextsFilter.length == 0
          ? results
          : fuseTexts.search(queryTextsFilter);
    };
  });

  const generalInformation = loadData('*[_id == "generalInformation"][0]', {});

  const latestReading = loadData(
    '*[_type == "reading"][0]{"slug": slug.current}',
    {}
  );

  const latestProgram = loadData(
    '*[_type == "program"][0]{"slug": slug.current}',
    {}
  );

  const latestEvent = loadData(
    '*[_type == "event"][0]{"slug": slug.current}',
    {}
  );

  // ABOUT
  let aboutQuery = "";
  if ($isAriel) aboutQuery = '*[_id == "aboutAriel"][0]';
  if ($isAri) aboutQuery = '*[_id == "aboutAri"][0]';
  if ($isYGRG) aboutQuery = '*[_id == "aboutYGRG"][0]';
  const about = loadData(aboutQuery, {});

  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .main-view {
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

    .half {
      position: absolute;
      top: 0;
      height: 100vh;
      width: 50%;
      overflow-y: auto;
      @include hide-scroll;

      @include screen-size("small") {
        padding-top: $top-bar-height;
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
        line-height: $line-height;
        font-weight: bold;

        @include screen-size("small") {
          margin-right: 10px;
          margin-left: 10px;
          margin-top: 20px;
        }
      }

      .bottom-meta {
        position: fixed;
        bottom: 40px;
        left: 80px;
        width: calc(50vw - 80px);
        margin-top: 30px;
        text-align: center;

        @include screen-size("small") {
          bottom: 90px;
          width: calc(100vw - 20px);
          left: 10px;
        }
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

      @include screen-size("small") {
        display: none;
      }

      a {
        &:hover {
          border-bottom: 2px solid $black;
        }
      }

      .left {
        float: left;
      }

      .right {
        float: right;

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
            border-bottom: unset;
          }
        }
      }
    }
  }

  .active {
    border-bottom: 2px solid $black;
  }

  .about {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 50vw;
    z-index: 1000;
    opacity: 0;
    z-index: 100;
    overflow-y: hidden;

    &.ari,
    &.ariel {
      background: $purple-gradient;
      left: 0;
      transform: translateX(-100%);
    }

    &.ygrg {
      background: $red-gradient;
      right: 0;
      transform: translateX(100%);
    }

    &.open {
      transition: transform 0.2s $easing, opacity 0.3s $easing;
      transform: translateX(0);
      opacity: 1;
    }

    @include screen-size("small") {
      width: 100vw;
      top: 0px;
      height: 100vh;
      transform: translateY(100%);
    }

    .inner-container {
      font-size: $font-size-large;
      line-height: $line-height;
      font-weight: bold;
      width: 50vw;
      height: calc(100% - 110px);
      overflow: auto;
      @include hide-scroll;

      @include screen-size("small") {
        width: 100%;
        font-size: $font-size-mobile-large;
      }

      .text {
        margin-right: 30px;
        margin-left: 30px;
        padding-top: 40px;

        @include screen-size("small") {
          padding-top: 40px;
          margin-right: 20px;
          margin-left: 20px;
        }
      }
    }

    .bottom-text {
      position: absolute;
      top: calc(100% - 110px);
      padding-top: $line-height;
      text-align: center;
      margin-bottom: $line-height * 4;
      width: 100%;
      @include screen-size("small") {
        font-size: $font-size-mobile-medium;
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

  .sign-in {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 50vw;
    background: $grey;
    z-index: 10000;
    transform: translateX(100%);
    background: $brown;
    opacity: 1;
    font-family: $font-stack-ygrg-regular;
    font-weight: normal;
    overflow-y: auto;
    @include hide-scroll;

    @include screen-size("small") {
      width: 100vw;
      top: 0px;
      height: 100vh;
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

      @include screen-size("small") {
        margin-right: 10px;
        margin-left: 10px;
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

  .filter {
    margin-bottom: $line-height;
    width: 400px;
    max-width: 90%;
    position: relative;

    .filter-input {
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

    .filter-icon {
      position: absolute;
      right: $line-height * 0.5;
      top: $line-height * 0.5;
      width: $line-height * 1.5;
      height: $line-height * 1.5;
      cursor: pointer;
      transition: none;
      &:hover {
        transition: transform 0.2s ease-out;
        transform: scale(1.05);
      }
    }

    .filter-clear {
      position: absolute;
      right: $line-height * 0.5;
      top: $line-height * 0.5;
      width: $line-height * 1.5;
      height: $line-height * 1.5;
      cursor: pointer;
      transition: none;
      &:hover {
        transition: transform 0.2s ease-out;
        transform: scale(1.05);
      }
    }
  }

  .text-counter {
    margin-bottom: $line-height;
  }

  .tile-container {
    display: inline-block;
    padding-bottom: 60px;
  }
</style>

<MetaData post={{ title: title.toUpperCase() }} />

<div class="main-view" class:listing class:single in:fade>

  <!-- LEFT PANE -->
  <MediaQuery query="(min-width: 800px)" let:matches>
    {#if matches || (!listing && !single)}
      <div class="half left">

        <!-- TOP BAR -->
        <div class="top-bar left" use:links>
          <div class="right">
            {#if $isAriel || $isAri}
              <a href="/" class:active={$isAriel}>ARIEL</a>
              |
              <a href="/ari" class:active={$isAri}>ARI.</a>
            {/if}
            {#if $isYGRG}
              <span
                class="pseudo-link"
                on:click={() => {
                  showAbout.set(false);
                  navigate('/ygrg/profile');
                }}>
                {#if $userLoaded}
                  {#if $loggedInUser}MY PROFILE{:else}SIGN IN{/if}
                {:else}
                  <Ellipse />
                {/if}
              </span>
            {/if}
          </div>
          <div class="left">
            <span
              on:click={() => {
                profile = false;
                showAbout.set(true);
              }}
              class="pseudo-link">
              ABOUT
              {#if $isYGRG}YGRG{/if}
            </span>
          </div>
        </div>

        <div class="inner-container">

          <!-- LOGO -->
          {#if $isAriel}
            <ArielLogo />
          {/if}
          {#if $isAri}
            <AriLogo />
          {/if}

          {#if $isAriel || $isAri}
            {#await generalInformation then generalInformation}
              <div class="bottom-meta">
                <div class="tagline">{generalInformation.tagline}</div>
                <div class="address">
                  {@html generalInformation.address}
                </div>
              </div>
            {/await}
          {/if}

          {#if $isYGRG}
            <div class="filter">
              <input
                class="filter-input"
                type="text"
                bind:value={queryTextsFilter}
                on:keyup={filterTexts}
                placeholder="Search in the YGRG Archive..." />
              {#if queryTextsFilter.length == 0}
                <div on:click={filterTexts} class="filter-icon">
                  <SubmitArrow />
                </div>
              {/if}

              {#if queryTextsFilter.length > 0}
                <div
                  on:click={() => {
                    queryTextsFilter = '';
                    filterTexts();
                  }}
                  class="filter-clear">
                  <Cross />
                </div>
              {/if}
            </div>

            <div class="text-counter">
              {#if queryTextsFilter.length > 0}
                {filteredTexts.length} found matching '{queryTextsFilter}'
              {:else}{filteredTexts.length} texts in Archive{/if}
            </div>

            <div class="tile-container" use:links>
              {#each filteredTexts.filter(text =>
                get($loggedInUser, 'user_metadata.bookmarks', []).includes(
                  text._id
                )
              ) as t}
                <TextTile
                  id={t._id}
                  title={t.title}
                  slug={t.slug.current}
                  date={t._createdAt}
                  image={t.image}
                  marked={true} />
              {/each}
              {#each filteredTexts.filter(text => !get($loggedInUser, 'user_metadata.bookmarks', []).includes(text._id)) as t}
                <TextTile
                  id={t._id}
                  title={t.title}
                  slug={t.slug.current}
                  date={t._createdAt}
                  image={t.image}
                  marked={false} />
              {/each}
            </div>
          {/if}
        </div>

      </div>
    {/if}
  </MediaQuery>

  <!-- RIGHT PANE -->
  <MediaQuery query="(min-width: 800px)" let:matches>
    {#if matches || (listing || single)}
      <div class="half right">

        <div class="top-bar right">
          {#if $isAriel}
            <div class="left">
              {#await latestProgram then latestProgram}
                <a href="/ariel/program/{latestProgram.slug}">PROGRAM</a>
              {/await}
            </div>
            {#if slug}
              <div class="right">
                <a href="/ariel/program" class="close">
                  <Cross />
                </a>
              </div>
            {/if}
          {/if}
          {#if $isAri}
            <div class="left">
              {#await latestReading then latestReading}
                <a href="/ari/readings/{latestReading.slug}">READINGS</a>
              {/await}
            </div>
            {#if slug}
              <div class="right">
                <a href="/ari/readings" class="close">
                  <Cross />
                </a>
              </div>
            {:else}
              <div class="search">
                <!-- <input
                  class="search-input"
                  type="text"
                  bind:value={queryReadingsFilter}
                  on:keyup={filterReadings}
                  placeholder="Search in ARI..." />
                <div class="search-icon" on:click={filterReadings}>
                  <SubmitArrow />
                </div> -->
              </div>
            {/if}
          {/if}
          {#if $isYGRG}
            <div class="left">
              {#await latestEvent then latestEvent}
                <a href="/ygrg/events/{latestEvent.slug}">YGRG EVENT ARCHIVE</a>
              {/await}
            </div>
            {#if slug}
              <div class="right">
                <a href="/ygrg/events" class="close">
                  <Cross />
                </a>
              </div>
            {/if}
          {/if}
        </div>

        {#if slug}
          <SinglePane {slug} {title} />
        {:else}
          <div class="inner-container" use:links>
            <Listing />
          </div>
        {/if}

      </div>
    {/if}
  </MediaQuery>

  <!-- ABOUT PANE -->
  {#await about then about}
    <div class="about {title}" class:open={$showAbout}>

      <!-- MAIN TEXT -->
      <div class="inner-container">
        <div class="text">
          {@html renderBlockText(about.content)}
        </div>
      </div>

      <!-- BOTTOM TEXT -->
      <div class="bottom-text">
        {@html renderBlockText(about.bottomText)}
      </div>

      <div
        class="close"
        on:click={() => {
          showAbout.set(false);
        }}>
        <Cross />
      </div>

    </div>
  {/await}

  <!-- SIGN IN -->
  <div class="sign-in" class:open={profile} use:links>
    <SignIn />

    <a href="/ygrg" class="close">
      <Cross />
    </a>

  </div>

</div>
