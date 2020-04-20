<script>
  // # # # # # # # # # # # # # # #
  //
  //  Listing
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

  // *** GLOBALS
  import { formattedDate } from "../global.js";

  // *** COMPONENTS

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
    activeSection,
    postType,
    loggedInUser
  } from "../stores.js";

  // *** PROPS
  export let location = {};

  // *** VARIABLES
  let listing = "";
  if ($isAriel)
    listing = loadData('*[_type in [ "program"]] | order(startDate desc)', {});
  if ($isAri)
    listing = loadData('*[_type in [ "reading"]] | order(startDate desc)', {});
  if ($isYGRG)
    listing = loadData('*[_type in [ "event"]] | order(startDate desc)', {});

  let filteredListing = [];

  // READINGS
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

  listing.then(results => {
    filteredListing = results;
    results.forEach(r => {
      r.plainText = toPlainText(r.content);
    });
    fuseReadings = new Fuse(results, optionsReadingsFilter);
    filterReadings = () => {
      filteredReadings =
        queryReadingsFilter.length == 0
          ? results
          : fuseReadings.search(queryReadingsFilter);
    };
  });

  const scrollNavigate = e => {
    const newHash = e.target.dataset.target;
    const targetEl = document.querySelector(newHash);
    if (history.pushState) {
      history.pushState(null, null, newHash);
    } else {
      location.hash = newHash;
    }
    targetEl.scrollIntoView({ behavior: "smooth" });
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .listing {
    font-size: $font-size-medium;

    @include screen-size("small") {
      padding-bottom: 300px;
      font-size: $font-size-mobile-medium;
    }

    .list-item {
      margin-bottom: $line-height * 3;
      display: inline-block;
      width: 100%;
      cursor: pointer;

      @include screen-size("small") {
        margin-bottom: $line-height * 2;
      }

      .title {
        text-align: center;
        // margin-bottom: $line-height;
        pointer-events: none;

        @include screen-size("small") {
          margin-bottom: $line-height * 0.5;
        }

        margin-left: auto;
        margin-right: auto;
      }

      .date {
        text-align: left;
        margin-left: auto;
        margin-right: auto;
        pointer-events: none;
      }

      .artist {
        text-align: left;
        text-transform: uppercase;
        margin-left: auto;
        margin-right: auto;
        pointer-events: none;
      }

      &:hover {
        color: $purple;
      }

      &:active {
        text-decoration: underline;
      }
    }

    &.ariel {
      font-family: $font-stack-ariel;

      .title {
        text-transform: uppercase;
      }
    }

    &.ari {
      font-family: $font-stack-ariel;

      .title {
        text-transform: uppercase;
      }

      .date {
        text-align: center;
        margin-bottom: $line-height;

        @include screen-size("small") {
          margin-bottom: $line-height * 0.5;
        }
      }
    }

    &.ygrg {
      font-family: $font-stack-ygrg-extended;

      .title {
        width: 90%;
        max-width: 30ch;
      }

      .date {
        width: 90vw;
        max-width: 30ch;
      }

      .artist {
        width: 90%;
        max-width: 30ch;
      }

      .text {
        width: 90%;
        max-width: 30ch;
        text-align: center;
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

<div class="listing {$activeSection}">
  {#await listing then listing}

    <!-- ARIEL -->
    {#each listing as item}
      <div
        data-target={'#' + item.slug.current}
        class="list-item"
        on:click={scrollNavigate}>

        <!-- TITLE -->
        <div class="title">
          {@html renderBlockText(item.title)}
        </div>

        <!-- ARTIST -->
        {#if $isAriel}
          <div class="artist">
            {#each item.artists as a, i}
              {#if i != item.artists.length - 1}{a + ', '}{:else}{a}{/if}
            {/each}
          </div>
        {/if}

        <!-- DATE -->
        {#if $isYGRG || $isAriel}
          <div class="date">{formattedDate(item.startDate, item.endDate)}</div>
        {/if}

      </div>
    {/each}
  {/await}

</div>
