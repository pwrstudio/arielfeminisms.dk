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

  console.log("ygrg", $isYGRG);
  console.log("ariel", $isAriel);
  console.log("ari", $isAri);

  // *** PROPS
  export let slug = "";
  export let title = "";

  // *** VARIABLES
  const single = loadData(
    "*[slug.current == $slug][0]{slideshow[]{textLink->{slug}, ...}, ...}",
    { slug: slug }
  );

  let currentIndex = 0;

  console.dir(single);
</script>

<style lang="scss">
  @import "../variables.scss";

  .single {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;

    &.ariel {
      font-family: $font-stack-ariel;
    }

    &.ygrg {
      font-family: $font-stack-ygrg-extended;
    }

    @include screen-size("small") {
      position: static;
      width: 100vw;
    }
  }

  .inner-container {
    margin-top: $top-bar-height + 20px;
    margin-right: 30px;
    margin-left: 30px;
    font-size: $font-size-medium;
    font-weight: bold;

    @include screen-size("small") {
      margin-top: 50px;
    }
  }

  .bottom-text {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    @include screen-size("small") {
      margin-top: $line-height * 6;
      position: static;
    }

    .title {
      text-align: center;
      margin-bottom: 20px;
    }

    .date {
      text-align: center;
      margin-bottom: 40px;
    }

    .artist {
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
  }

  .read-icon {
    height: 50px;
    width: 50px;
    display: inline-block;
    position: relative;
    top: 20px;
  }
</style>

<div class="single {title}" in:fade>

  <!-- INNER CONTAINER -->
  <div class="inner-container" use:links>

    {#await single then single}

      {#if get(single, 'slideshow.length', 0) > 0}
        <SlideShow
          on:slideChange={e => {
            currentIndex = e.detail.index;
          }}
          slideArray={single.slideshow} />
      {/if}

      {#if single.slideshow}
        {#if single.slideshow[currentIndex].textLink}
          <div class="text-link" in:fade>
            <a
              href="/ygrg/text/{single.slideshow[currentIndex].textLink.slug.current}">
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
        <div class="title">{single.title}</div>
        <!-- // *** ARTIST(S) -->
        {#if $isAriel}
          <div class="artist">
            {#each single.artists as a}
              <span>{a},</span>
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

</div>
