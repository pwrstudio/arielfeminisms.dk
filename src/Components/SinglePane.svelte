<script>
  // # # # # # # # # # # # # # # #
  //
  //  SINGLE PANE
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { links } from "svelte-routing";
  import { loadData, renderBlockText } from "../sanity.js";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";
  import get from "lodash/get";

  import { formattedDate } from "../global.js";

  // *** COMPONENTS
  import SlideShow from "../Components/SlideShow.svelte";

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
    width: 100%;
    height: calc(100vh - 80px);
    height: 100vh;
    margin: 0;
    padding: 0;
    padding-top: 20vh;
    font-size: $font-size-medium;

    @include screen-size("small") {
      padding-top: 15vh;
      width: 100%;
      height: calc(100vh - 160px);
      font-size: $font-size-mobile-medium;
    }

    &.ariel {
      font-family: $font-stack-ariel;

      .bottom-text {
        text-transform: uppercase;
      }
    }

    &.ygrg {
      font-family: $font-stack-ygrg-extended;
    }

    @include screen-size("small") {
      position: static;
      width: 100vw;
    }
  }

  .slideshow-container {
    width: 90%;
    height: 40vh;
    margin-left: 5%;

    @include screen-size("small") {
      width: 100%;
      margin-left: unset;
      height: 30vh;
    }
  }

  .bottom-text {
    position: absolute;
    bottom: 40px;
    left: 0;
    width: 100%;

    @include screen-size("small") {
      bottom: 100px;
    }

    .title {
      text-align: center;
    }

    .date {
      text-align: center;
    }

    .artist {
      margin-top: 20px;
      text-align: center;
    }
  }

  .text-link {
    padding-top: 40px;
    text-align: center;
    font-family: $font-stack-ygrg-extended;
    font-size: $font-size-large;
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
    height: 50px;
    width: 50px;
    display: inline-block;
    position: relative;
    top: 20px;

    @include screen-size("small") {
      height: 40px;
      width: 40px;
      top: 15px;
    }
  }
</style>

<div class="single {title}" in:fade use:links>

  {#await single then single}

    {#if get(single, 'slideshow.length', 0) > 0}
      <div class="slideshow-container">
        <SlideShow
          on:slideChange={e => {
            currentIndex = e.detail.index;
          }}
          slideArray={single.slideshow} />
      </div>
    {/if}

    {#if single.slideshow}
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
        {@html renderBlockText(single.title)}
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
    </div>

  {/await}

</div>
