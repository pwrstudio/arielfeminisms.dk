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
  import FullListing from "../Components/FullListing.svelte";

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
    activeSection,
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
  const texts = loadData('*[_type == "ygrgText"] | order(_createdAt desc)', {});
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

  const latestEvent = loadData(
    '*[_type == "event"] | order(startDate desc) [0] {"slug": slug.current}',
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
        // margin-top: $top-bar-height + 20px;
        margin-right: 30px;
        margin-left: 30px;
        font-size: $font-size-medium;
        line-height: $line-height;
        font-weight: bold;

        @include screen-size("small") {
          margin-right: auto;
          margin-left: auto;
          margin-top: 20px;
          width: 90%;
          max-width: 50ch;
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
          position: static;
          bottom: 90px;
          width: calc(100vw - 20px);
          left: 10px;
          bottom: unset;
          left: unset;
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

      &.ari,
      &.ariel {
        a,
        .pseudo-link {
          &:hover {
            color: $purple;
            border-bottom: 2px solid $purple;
          }
          &:active {
            border-bottom: 2px solid $purple;
          }
        }
      }

      &.ygrg {
        a,
        .pseudo-link {
          &:hover {
            color: $red;
            border-bottom: 2px solid $red;
          }
          &:active {
            border-bottom: 2px solid $red;
          }
        }
      }
    }
  }

  .active {
    border-bottom: 2px solid $black;

    &:hover {
      border-bottom: 2px solid $purple;
    }
  }

  .about {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 80px;
    z-index: 1000;
    opacity: 1;
    z-index: 100;
    overflow-y: hidden;
    cursor: pointer;

    &.ari,
    &.ariel {
      background: $purple-gradient;
      left: 0;
      transform: translateX(calc(-100% + 80px));
    }

    &.ygrg {
      background: $red-gradient;
      right: 0;
      transform: translateX(calc(100% - 80px));
    }

    @include screen-size("small") {
      &.ari,
      &.ariel,
      &.ygrg {
        transform: translateY(100%);
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
      display: none;

      &:hover {
        transform: scale(1.1);
      }
    }

    &.open {
      width: 50vw;
      transition: transform 0.3s $easing;
      transform: translateX(0);
      opacity: 1;
      // cursor: default;

      .close {
        display: block;
      }
    }

    @include screen-size("small") {
      width: 100vw;
      top: 0px;
      height: auto;
      transform: translateY(100%);
      overflow-y: auto;

      &.open {
        width: 100vw;
      }
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
        height: 100vh;
      }

      .text {
        margin-right: 30px;
        margin-left: 30px;
        padding-top: 40px;

        @include screen-size("small") {
          padding-top: 30px;
          margin-right: 20px;
          margin-left: 20px;
        }
      }

      opacity: 0;

      &.open {
        transition: opacity 0.4s $easing;
        opacity: 1;
      }
    }

    .bottom-text {
      position: absolute;
      top: calc(100% - 110px);
      padding-top: $line-height;
      padding-bottom: $line-height;
      text-align: center;
      margin-bottom: $line-height * 4;
      width: 100%;

      @include screen-size("small") {
        padding-top: 0;
        padding-bottom: 0;
        font-size: $font-size-mobile-medium;
        position: static;
        top: unset;
      }
    }
  }

  .search {
    width: 300px;
    max-width: 60%;
    position: relative;
    float: right;

    @include screen-size("small") {
      width: 100%;
      max-width: unset;
    }

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
    background: $red-gradient;
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
    margin-top: $top-bar-height + 20px;

    @include screen-size("small") {
      width: 100%;
      max-width: unset;
      margin-top: 30px;
    }

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
    padding-bottom: 120px;
    width: 100%;
  }

  .bar {
    position: relative;
    top: -2px;
  }

  .link {
    border-bottom: 2px solid transparent;
    cursor: pointer;

    &:hover {
      border-bottom: 2px solid black;
    }
  }

  .line {
    margin-bottom: 4px;
  }
</style>

{#if !single}
  <MetaData post={{ title: title.toUpperCase() }} />
{/if}

<div class="main-view" class:listing class:single in:fade>

  <!-- LEFT PANE -->
  <MediaQuery query="(min-width: 800px)" let:matches>
    <!-- Show if desktop -->
    <!-- OR if NOT single and NOT YGRG-listing -->
    {#if matches || (!single && !(listing && $isYGRG))}
      <div class="half left">

        <!-- TOP BAR -->
        <div class="top-bar left {$activeSection}" use:links>

          <div class="left">
            {#if $isAriel || $isAri}
              <a href="/" class:active={$isAriel}>ARIEL</a>
            {/if}
            {#if $isYGRG}
              <span
                on:click={() => {
                  profile = false;
                  showAbout.set(!$showAbout);
                }}
                class="pseudo-link">
                ABOUT YGRG
              </span>
            {/if}
          </div>

          <div class="right">
            {#if $isAriel || $isAri}
              <a href="/ari" class:active={$isAri}>ARI. INDEX</a>
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

        </div>

        <div class="inner-container">

          {#if $isAriel || $isAri}
            <Listing {single} />
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
    <!-- Show if desktop -->
    <!-- OR if single view  -->
    <!-- OR if YGRG and listing -->
    {#if matches || single || (listing && $isYGRG)}
      <div class="half right">

        <div class="top-bar right {$activeSection}">
          {#if $isAriel || $isAri}
            <span
              on:click={() => {
                profile = false;
                showAbout.set(!$showAbout);
              }}
              class="pseudo-link">
              ABOUT
            </span>
          {/if}
          {#if $isYGRG}
            <div class="left">
              <a href="/ygrg/events">YGRG EVENT ARCHIVE</a>
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

        {#if single}
          {#if slug}
            <SinglePane {slug} {title} />
          {:else}
            {#await latestEvent then latestEvent}
              <SinglePane slug={latestEvent.slug} {title} />
            {/await}
          {/if}
        {:else}
          {#if $isAriel || $isAri}
            <div class="inner-container" use:links>
              <FullListing />
            </div>
          {/if}
          {#if $isYGRG}
            {#if listing}
              <Listing single={true} />
            {:else}
              {#await latestEvent then latestEvent}
                <SinglePane slug={latestEvent.slug} {title} />
              {/await}
            {/if}
          {/if}
        {/if}

      </div>
    {/if}
  </MediaQuery>

  <!-- ABOUT PANE -->
  {#await about then about}
    <div
      class="about {title}"
      class:open={$showAbout}
      on:click={() => {
        showAbout.set(!$showAbout);
      }}>

      <!-- MAIN TEXT -->
      <div class="inner-container" class:open={$showAbout}>
        <div class="text">
          {@html renderBlockText(about.content)}
        </div>

        <!-- BOTTOM TEXT -->
        <div class="bottom-text" use:links>
          {#if $isAriel}
            <div class="line">
              <span>NIELS HEMMINGSENS GADE 8–10 1153 CPH K</span>
            </div>
            <div class="line">
              <a
                href="mailto:arielfeminisms@gmail.com"
                target="_blank"
                class="link">
                CONTACT
              </a>
              <!-- <span class="bar">|</span>
              <span class="link">NEWSLETTER ARIEL</span> -->
            </div>
          {/if}
          {#if $isAri}
            <div class="line">
              <a href="/ari/readings" class="link">ARI. READINGS</a>
              <span class="bar">|</span>
              <span>THE WOMEN´S BUILDING</span>
            </div>
            <div class="line">
              <span>FREE ACCESS</span>
              <span class="bar">|</span>
              <a
                href="mailto:arielfeminisms@gmail.com"
                target="_blank"
                class="link">
                SIGN UP
              </a>
            </div>
          {/if}
          {#if $isYGRG}
            <div class="line">
              <a href="/ygrg/events" class="link">YGRG ARCHIVE</a>
              <span class="bar">|</span>
              <a href="/ygrg/profile" class="link">SIGN IN / SIGN UP</a>
            </div>
            <div class="line">
              <a
                href="mailto:younggirlreadinggroup@gmail.com"
                target="_blank"
                class="link">
                CONTACT
              </a>
              <!-- <span class="bar">|</span>
              <span class="link">NEWSLETTER YGRG</span> -->
            </div>
          {/if}
        </div>

      </div>

    </div>
  {/await}

  <!-- SIGN IN -->
  <div class="sign-in" class:open={profile} use:links>
    <SignIn />

    <a
      href="/ygrg"
      class="close"
      on:click={() => {
        showAbout.set(false);
      }}>
      <Cross />
    </a>

  </div>

</div>
