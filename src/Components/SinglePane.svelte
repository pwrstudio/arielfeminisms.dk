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

  import { formattedDate } from "../global.js";

  // *** COMPONENTS
  import SlideShow from "../Components/SlideShow.svelte";

  // *** GRAPHICS
  import Cross from "../Graphics/Cross.svelte";

  // *** STORES
  import { isYGRG, isAriel, isAri } from "../stores.js";

  // *** PROPS
  export let slug = "";
  export let title = "";

  // *** VARIABLES
  const single = loadData("*[slug.current == $slug][0]", { slug: slug });
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
      text-transform: uppercase;
    }

    .date {
      text-align: center;
      margin-bottom: 40px;
    }

    .artist {
      text-align: center;
      text-transform: uppercase;
    }
  }
</style>

<div class="single {title}" in:fade>

  <!-- TOP BAR -->

  <div class="top-bar left" use:links>

    <div class="left active">
      {#if $isAriel}ARIEL PROGRAM{/if}
      {#if $isYGRG}YGRG ARCHIVE{/if}
    </div>
    <div class="right">
      {#if $isAriel}
        <a href="/" class="close">
          <Cross />
        </a>
      {/if}
      {#if $isYGRG}
        <a href="/ygrg" class="close">
          <Cross />
        </a>
      {/if}
    </div>

  </div>

  <!-- INNER CONTAINER -->
  <div class="inner-container" use:links>

    {#await single}
      <span />
    {:then single}

      {#if single.slideshow.length > 0}
        <SlideShow slideArray={single.slideshow} />
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
        <div class="date">
          {formattedDate(single.startDate, single.endDate)}
        </div>
      </div>

    {:catch error}
      File not Found (404)
      <br />
      <a href="/">Return to main page</a>
    {/await}

  </div>

</div>
