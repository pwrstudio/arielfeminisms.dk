<script>
  // # # # # # # # # # # # # #
  //
  //  SLIDESHOW
  //
  // # # # # # # # # # # # # #

  // *** IMPORTS
  import { onMount } from "svelte";
  import Flickity from "flickity";
  import { urlFor } from "../sanity.js";
  import getVideoId from "get-video-id";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // *** PROPS
  export let slideArray = [];

  // *** DOM REFERENCES
  let slideShowEl = {};

  // *** VARIABLES
  let flkty = {};

  // *** ON MOUNT
  onMount(async () => {
    try {
      flkty = new Flickity(slideShowEl, {
        prevNextButtons: true,
        pageDots: true,
        selectedAttraction: 0.2,
        friction: 0.9
      });
      flkty.on("change", i => {
        console.log(i);
        dispatch("slideChange", { index: parseInt(i) });
      });
    } catch (err) {
      console.error(err);
    }
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .responsive-container {
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
    transform: translateY(20%);

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
</style>

<div class="carousel slideshow" bind:this={slideShowEl}>
  {#each slideArray as slide}
    <div class="carousel-cell slideshow__slide">
      {#if slide.videoUrl}
        <div class="responsive-container">
          {#if slide.videoUrl.includes('youtube')}
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/{getVideoId(slide.videoUrl).id}"
              frameborder="0"
              title="ariel"
              allow="accelerometer; autoplay; encrypted-media; gyroscope;
              picture-in-picture"
              allowfullscreen />
          {/if}
          {#if slide.videoUrl.includes('vimeo')}
            <iframe
              src="https://player.vimeo.com/video/{getVideoId(slide.videoUrl).id}"
              width="1280"
              height="720"
              title="ariel"
              frameborder="0"
              byline="false"
              color="#ffffff"
              allow="autoplay; fullscreen"
              allowfullscreen />
          {/if}
        </div>
      {:else}
        <img
          class="slideshow__slide-image"
          alt="ariel"
          src={urlFor(slide.img)
            .height(600)
            .quality(80)
            .auto('format')
            .url()} />
      {/if}
    </div>
  {/each}
</div>
