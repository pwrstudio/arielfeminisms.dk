<script>
  // # # # # # # # # # # # # # # #
  //
  //  SINGLE PANE
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { links } from "svelte-routing";
  import { loadData, renderBlockText, toPlainText } from "../sanity.js";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";
  import get from "lodash/get";

  import { formattedDate } from "../global.js";

  // *** COMPONENTS
  import SlideShow from "../Components/SlideShow.svelte";
  import MetaData from "../Components/MetaData.svelte";

  // *** GRAPHICS
  import ReadIcon from "../Graphics/ReadIcon.svelte";

  // *** STORES
  import { isYGRG, isAriel, isAri } from "../stores.js";

  // *** PROPS
  export let slug = "";
  export let title = "";

  // *** VARIABLES
  const single = loadData(
    "*[slug.current == $slug][0]{slideshow[]{textLink->{slug}, ...}, ...}",
    { slug: slug }
  );

  let currentIndex = 0;
</script>

<style lang="scss">
  @import "../variables.scss";

  .single {
    display: inline-block;
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0;
    padding-bottom: 120px;
    padding-top: 10vh;
    font-size: $font-size-medium;

    @include screen-size("small") {
      padding-top: 20px;
      font-size: $font-size-mobile-medium;
    }

    .bottom-text {
      padding-top: $line-height * 2;
      width: 100%;
      // background: lightgreen;

      @include screen-size("small") {
        padding-top: $line-height;
        bottom: 100px;
      }

      .title {
        text-transform: uppercase;
        text-align: center;
        margin-bottom: $line-height;
        width: 90%;
        max-width: 50ch;

        margin-left: auto;
        margin-right: auto;
      }

      .date {
        text-transform: uppercase;
        text-align: center;
        margin-bottom: $line-height;
        width: 90%;
        max-width: 50ch;

        margin-left: auto;
        margin-right: auto;
      }

      .artist {
        text-transform: uppercase;
        margin-top: 20px;
        text-align: center;
        width: 90%;
        max-width: 50ch;
        margin-left: auto;
        margin-right: auto;
      }

      .text {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
      }
    }

    &.ariel {
      font-family: $font-stack-ariel;
    }

    &.ygrg {
      font-family: $font-stack-ygrg-extended;

      .bottom-text {
        padding-top: $line-height * 2;
        width: 100%;
        // background: lightgreen;

        @include screen-size("small") {
          padding-top: $line-height;

          bottom: 100px;
        }

        .title {
          text-align: center;
          margin-bottom: $line-height;
          width: 90%;
          max-width: 30ch;
        }

        .date {
          text-align: center;
          margin-bottom: $line-height;
          width: 90%;
          max-width: 30ch;
        }

        .artist {
          margin-top: 20px;
          text-align: center;
          width: 90%;
          max-width: 30ch;
        }

        .text {
          text-align: center;
          width: 90%;
          max-width: 30ch;
        }
      }
    }

    @include screen-size("small") {
      position: static;
      width: 100vw;
    }
  }

  .slideshow-container {
    width: 90%;
    height: 50vh;
    max-height: 350px;
    margin-left: 5%;
    margin-bottom: 50px;
    // background: lightcoral;

    @include screen-size("small") {
      width: 100%;
      margin-left: unset;
      height: 30vh;
      margin-bottom: 40px;
    }
  }

  .text-link {
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: center;
    font-family: $font-stack-ygrg-extended;
    font-size: $font-size-medium;

    @include screen-size("small") {
      font-size: $font-size-mobile-medium;
    }
  }

  .caption {
    padding-top: 40px;
    text-align: center;
    display: none;
    @include screen-size("small") {
      display: none;
    }
  }

  .read-icon {
    height: 40px;
    width: 40px;
    display: inline-block;
    position: relative;
    top: 15px;

    @include screen-size("small") {
      height: 30px;
      width: 30px;
      top: 12px;
    }
  }
</style>

<div class="single {title}" in:fade use:links>

  {#await single then single}

    <MetaData post={{ title: toPlainText(single.title) }} />

    {#if get(single, 'slideshow.length', 0) > 0}
      <div class="slideshow-container">
        <SlideShow
          on:slideChange={e => {
            currentIndex = e.detail.index;
          }}
          slideArray={single.slideshow} />
      </div>
    {/if}

    {#if single.slideshow && single.slideshow[currentIndex]}
      {#if single.slideshow[currentIndex].textLink}
        <div class="text-link" in:fade>
          <a
            href="/ygrg/texts/{single.slideshow[currentIndex].textLink.slug.current}">
            Read
            <div class="read-icon">
              <ReadIcon />
            </div>
          </a>
        </div>
      {/if}
      {#if single.slideshow[currentIndex].caption}
        <div class="caption" in:fade>
          {single.slideshow[currentIndex].caption}
        </div>
      {/if}
    {/if}

    <div class="bottom-text">
      <!-- // *** TITLE -->
      <div class="title">
        {#if single.title}
          {@html renderBlockText(single.title)}
        {/if}
      </div>
      <!-- // *** ARTIST(S) -->
      {#if $isAriel}
        <div class="artist">
          {#each single.artists as a, i}
            {#if i != single.artists.length - 1}{a + ', '}{:else}{a}{/if}
          {/each}
        </div>
      {/if}
      <!-- // *** DATE -->
      {#if $isYGRG || $isAriel}
        <div class="date">
          {formattedDate(single.startDate, single.endDate)}
        </div>
      {/if}
      <!-- TEXT -->
      {#if single.content}
        <div class="text">
          {@html renderBlockText(single.content)}
        </div>
      {/if}
    </div>

  {/await}

</div>
