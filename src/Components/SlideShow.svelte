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
        pageDots: true
      });
    } catch (err) {
      console.error(err);
    }
  });
</script>

<style lang="scss">
  @import "../variables.scss";
</style>

<div class="carousel slideshow" bind:this={slideShowEl}>
  {#each slideArray as slide}
    <div class="carousel-cell slideshow__slide">
      {#if slide.videoUrl}
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
