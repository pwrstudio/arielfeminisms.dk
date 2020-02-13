<script>
  // # # # # # # # # # # # # # # #
  //
  //  Main View
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { links } from "svelte-routing";
  import { loadData, renderBlockText, toPlainText } from "../sanity.js";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";
  import { format, getYear } from "date-fns";
  import Fuse from "fuse.js";

  import { formattedDate } from "../global.js";

  // *** COMPONENTS
  import SinglePane from "../Components/SinglePane.svelte";
  import SignIn from "../Components/SignIn.svelte";
  import TextTile from "../Components/TextTile.svelte";

  // *** GRAPHICS
  import ArielLogo from "../Graphics/ArielLogo.svelte";
  import AriLogo from "../Graphics/AriLogo.svelte";
  import Cross from "../Graphics/Cross.svelte";
  import SubmitArrow from "../Graphics/SubmitArrow.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isAri,
    showAbout,
    showProgram,
    showEvents,
    showReadings,
    loggedInUser
  } from "../stores.js";

  // *** PROPS
  export let title = "";
  export let slug = "";
  export let location = {};

  // Set globals
  showAbout.set(false);
  isAriel.set(title === "ariel");
  isAri.set(title === "ari");
  isYGRG.set(title === "ygrg");

  // *** VARIABLES

  let showSignIn = false;
  let secondaryNavigation = false;

  const generalInformation = loadData('*[_id == "generalInformation"][0]', {});
  const program = loadData('*[_type in [ "program"]]', {});
  const events = loadData('*[_type in [ "event"]]', {});

  console.dir(program);

  // TEXTS
  const texts = loadData('*[_type in [ "ygrgText"]]', {});
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

  // READINGS
  const readings = loadData('*[_type in [ "reading"]]', {});
  let filteredReadings = [];
  let filterReadings = () => {};
  let fuseReadings = {};
  let queryReadingsFilter = "";
  const optionsReadingsFilter = {
    keys: ["plainText"],
    shouldSort: true,
    tokenize: true,
    threshold: 0.4,
    minMatchCharLength: 2
  };

  // ABOUT
  let aboutQuery = "";
  if ($isAriel) aboutQuery = '*[_id == "aboutAriel"][0]';
  if ($isAri) aboutQuery = '*[_id == "aboutAri"][0]';
  if ($isYGRG) aboutQuery = '*[_id == "aboutYGRG"][0]';
  const about = loadData(aboutQuery, {});

  const setSlug = s => {
    slug = s;
  };

  onMount(async () => {
    window.scrollTo(0, 0);
  });

  texts.then(results => {
    filteredTexts = results;
    fuseTexts = new Fuse(results, optionsTextsFilter);
    filterTexts = () => {
      console.log(queryTextsFilter);
      filteredTexts =
        queryTextsFilter.length == 0
          ? results
          : fuseTexts.search(queryTextsFilter);
    };
  });

  readings.then(results => {
    filteredReadings = results;
    results.forEach(r => {
      r.plainText = toPlainText(r.content);
    });
    fuseReadings = new Fuse(results, optionsReadingsFilter);
    filterReadings = () => {
      console.log(queryReadingsFilter);
      filteredReadings =
        queryReadingsFilter.length == 0
          ? results
          : fuseReadings.search(queryReadingsFilter);
    };
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
      @include screen-size("small") {
        // background: orange;
      }
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
        }
      }
    }
  }

  .program {
    margin-bottom: 20px;
    display: inline-block;
    width: 100%;
    cursor: pointer;

    .title {
      text-align: center;
      margin-bottom: $line-height;
      text-transform: uppercase;

      p {
        margin: 0;
      }
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

  .reading {
    margin-bottom: 20px;
    display: inline-block;
    width: 100%;
    cursor: pointer;

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

  .event {
    margin-bottom: 40px;
    display: inline-block;
    width: 100%;
    font-family: $font-stack-ygrg-extended;
    cursor: pointer;

    .title {
      text-align: center;
      margin-bottom: 1em;
    }

    .date {
      text-align: center;
      margin-bottom: 2em;
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
      height: calc(100% - 90px);
      overflow: auto;
      // background: red;
      @include hide-scroll;

      @include screen-size("small") {
        width: 100%;
      }

      .text {
        margin-right: 30px;
        margin-left: 30px;
        // background: green;
        // box-shadow: inset 0 0 10px #ff0000;
        @include screen-size("small") {
          padding-top: 40px;
          margin-right: 20px;
          margin-left: 20px;
        }
      }
    }

    .bottom-text {
      margin-top: $line-height;
      text-align: center;
      margin-bottom: $line-height * 4;
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
    margin-bottom: $line-height * 2;
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
    }
  }
</style>

<div class="main-view" in:fade>

  <!-- LEFT PANE -->
  {#if !($showReadings || $showEvents || $showProgram)}
    <div class="half left">

      <!-- TOP BAR -->
      <div class="top-bar left" use:links>
        <div class="right">
          {#if $isAriel || $isAri}
            <a href="/" class:active={$isAriel}>ARIEL</a>
            |
            <a href="ari" class:active={$isAri}>ARI.</a>
          {/if}
          {#if $isYGRG}
            <span
              class="pseudo-link"
              on:click={() => {
                showAbout.set(false);
                showSignIn = !showSignIn;
              }}>
              {#if $loggedInUser}MY PROFILE{:else}SIGN IN{/if}
            </span>
          {/if}
        </div>
        <div class="left">
          <span
            on:click={() => {
              showSignIn = false;
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
            <div on:click={filterTexts} class="filter-icon">
              <SubmitArrow />
            </div>
          </div>

          <div class="tile-container" use:links>
            {#each filteredTexts as t}
              <TextTile
                id={t._id}
                title={t.title}
                slug={t.slug.current}
                date={t._createdAt} />
            {/each}
          </div>
        {/if}
      </div>

    </div>
  {/if}

  <!-- RIGHT PANE -->
  <MediaQuery query="(min-width: 700px)" let:matches>
    {#if matches || $showReadings || $showEvents || $showProgram}
      <div class="half right">

        <div class="top-bar right">
          {#if $isAriel}
            <div class="left">
              {#await program then program}
                <span
                  class="pseudo-link"
                  on:click={() => {
                    setSlug(program[0].slug.current);
                  }}>
                  PROGRAM
                </span>
              {/await}
            </div>
            {#if slug}
              <div class="right">
                <span
                  class="close"
                  on:click={() => {
                    setSlug(false);
                  }}>
                  <Cross />
                </span>
              </div>
            {/if}
          {/if}
          {#if $isAri}
            <div class="left">
              <span>READINGS</span>
            </div>
            {#if slug}
              <div class="right">
                <span
                  class="close"
                  on:click={() => {
                    setSlug(false);
                  }}>
                  <Cross />
                </span>
              </div>
            {:else}
              <div class="search">
                <input
                  class="search-input"
                  type="text"
                  bind:value={queryReadingsFilter}
                  on:keyup={filterReadings}
                  placeholder="Search in ARI..." />
                <div class="search-icon" on:click={filterReadings}>
                  <SubmitArrow />
                </div>
              </div>
            {/if}
          {/if}
          {#if $isYGRG}
            <div class="left">YGRG ARCHIVE</div>
            {#if slug}
              <div class="right">
                <span
                  class="close"
                  on:click={() => {
                    setSlug(false);
                  }}>
                  <Cross />
                </span>
              </div>
            {/if}
          {/if}
        </div>

        {#if slug}
          <SinglePane {slug} {title} />
        {:else}
          <div class="inner-container" use:links>

            <!-- ARIEL -->
            {#if $isAriel}
              {#await program then program}
                {#each program as p}
                  <div
                    class="program"
                    on:click={() => {
                      setSlug(p.slug.current);
                    }}>
                    <div class="title">
                      {@html renderBlockText(p.title)}
                    </div>
                    <div class="artist">
                      {#each p.artists as a, i}
                        {#if i != p.artists.length - 1}{a + ', '}{:else}{a}{/if}
                      {/each}
                    </div>
                    <div class="date">
                      {formattedDate(p.startDate, p.endDate)}
                    </div>
                    <div class="text">
                      {@html renderBlockText(p.content)}
                    </div>
                  </div>
                {/each}
              {/await}
            {/if}

            <!-- ARI -->
            {#if $isAri}
              {#each filteredReadings as r}
                <div
                  class="reading"
                  on:click={() => {
                    setSlug(r.slug.current);
                  }}>
                  <div class="title">
                    {@html renderBlockText(r.title)}
                  </div>
                  <div class="text">
                    {@html renderBlockText(r.content)}
                  </div>
                </div>
              {/each}
            {/if}

            <!-- YGRG -->
            {#if $isYGRG}
              {#await events then events}
                {#each events as e}
                  <div
                    class="event"
                    on:click={() => {
                      setSlug(e.slug.current);
                    }}>
                    <div class="title">
                      {@html renderBlockText(e.title)}
                    </div>
                    <div class="date">
                      {formattedDate(e.startDate, e.endDate)}
                    </div>
                  </div>
                {/each}
              {/await}
            {/if}

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
  <div class="sign-in" class:open={showSignIn}>
    <SignIn />

    <div
      class="close"
      on:click={() => {
        showSignIn = false;
      }}>
      <Cross />
    </div>

  </div>

</div>
