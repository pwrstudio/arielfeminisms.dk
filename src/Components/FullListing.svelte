<script>
  // # # # # # # # # # # # # # # #
  //
  //  Full Listing
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { links } from "svelte-routing";
  import { loadData, renderBlockText, toPlainText } from "../sanity.js";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";
  import { format, getYear } from "date-fns";
  import get from "lodash/get";

  // *** GLOBALS
  import { formattedDate } from "../global.js";

  // *** COMPONENTS
  import SlideShow from "../Components/SlideShow.svelte";

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
  let currentIndex = 0;
</script>

<style lang="scss">
  @import "../variables.scss";

  .full-listing {
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

      .slideshow-container {
        width: 100%;
        height: 50vh;
        max-height: 350px;
        margin-bottom: 50px;

        @include screen-size("small") {
          width: 100%;
          margin-left: unset;
          height: 30vh;
          margin-bottom: 40px;
        }
      }

      .title {
        text-align: center;
        margin-bottom: $line-height;

        @include screen-size("small") {
          margin-bottom: $line-height * 0.5;
        }

        margin-left: auto;
        margin-right: auto;
      }

      .date {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
      }

      .artist {
        text-align: center;
        text-transform: uppercase;
        margin-left: auto;
        margin-right: auto;
      }

      .text {
        margin-left: auto;
        margin-right: auto;
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
</style>

<div class="full-listing {$activeSection}">
  {#await listing then listing}

    <!-- ARIEL -->
    {#each listing as item}
      <div
        href={'/' + $activeSection + '/' + $postType + '/' + item.slug.current}
        class="list-item">

        <!-- SLIDESHOW -->
        {#if get(item, 'slideshow.length', 0) > 0}
          <div class="slideshow-container">
            <SlideShow
              on:slideChange={e => {
                currentIndex = e.detail.index;
              }}
              slideArray={item.slideshow} />
          </div>
        {/if}

        {#if item.slideshow && item.slideshow[currentIndex]}
          {#if item.slideshow[currentIndex].textLink}
            <div class="text-link" in:fade>
              <a
                href="/ygrg/texts/{item.slideshow[currentIndex].textLink.slug.current}">
                Read
                <div class="read-icon">
                  <ReadIcon />
                </div>
              </a>
            </div>
          {/if}
          <!-- {#if item.slideshow[currentIndex].caption}
            <div class="caption" in:fade>
              {item.slideshow[currentIndex].caption}
            </div>
          {/if} -->
        {/if}

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
        {#if $isAriel}
          <div class="date">{formattedDate(item.startDate, item.endDate)}</div>
        {/if}

        <!-- TEXT -->
        {#if item.content}
          <div class="text">
            {@html renderBlockText(item.content)}
          </div>
        {/if}
      </div>
    {/each}
  {/await}

</div>
