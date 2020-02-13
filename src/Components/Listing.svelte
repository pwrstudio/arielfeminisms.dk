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

  console.log("postType:", $postType);
  console.log("activeSection:", $activeSection);

  // *** VARIABLES
  let listing = "";
  if ($isAriel) listing = loadData('*[_type in [ "program"]]', {});
  if ($isAri) listing = loadData('*[_type in [ "reading"]]', {});
  if ($isYGRG) listing = loadData('*[_type in [ "event"]]', {});

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

  .listing {
    font-size: $font-size-medium;

    @include screen-size("small") {
      padding-bottom: 300px;
      font-size: $font-size-mobile-medium;
    }

    .list-item {
      margin-bottom: 20px;
      display: inline-block;
      width: 100%;
      cursor: pointer;

      .title {
        text-align: center;
        margin-bottom: $line-height;
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
        margin-bottom: $line-height * 1;
      }
    }

    &.ygrg {
      font-family: $font-stack-ygrg-extended;
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
      <a
        href={'/' + $activeSection + '/' + $postType + '/' + item.slug.current}
        class="list-item">

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

        <!-- TEXT -->
        {#if $isAri || $isAriel}
          <div class="text">
            {@html renderBlockText(item.content)}
          </div>
        {/if}
      </a>
    {/each}
  {/await}

</div>