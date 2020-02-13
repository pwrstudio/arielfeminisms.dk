<script>
  // # # # # # # # # # # # # #
  //
  //  SLIDESHOW
  //
  // # # # # # # # # # # # # #

  // *** IMPORTS
  import { onMount, createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";
  import Flickity from "flickity";
  import { urlFor } from "../sanity.js";
  import getVideoId from "get-video-id";

  const dispatch = createEventDispatcher();

  // *** PROPS
  export let slideArray = [];
  export let isTextNavigation = false;

  // *** DOM REFERENCES
  let slideShowEl = {};

  // *** VARIABLES
  let flkty = {};

  console.log(slideArray);

  const flktyOption = isTextNavigation
    ? {
        prevNextButtons: false,
        pageDots: false
        // selectedAttraction: 0.2,
        // friction: 0.9,
        // wrapAround: true
      }
    : {
        prevNextButtons: true,
        pageDots: true,
        selectedAttraction: 0.2,
        friction: 0.9
      };

  // *** ON MOUNT
  onMount(async () => {
    try {
      flkty = new Flickity(slideShowEl, flktyOption);
      flkty.on("change", i => {
        console.log(i);
        dispatch("slideChange", { index: parseInt(i) });
      });
      if (isTextNavigation) {
        flkty.on("staticClick", (event, pointer, cellElement, cellIndex) => {
          console.log("/ygrg/text/" + slideArray[cellIndex].slug.current);
          window.location = "/ygrg/text/" + slideArray[cellIndex].slug.current;
          // navigate("/ygrg/text/" + slideArray[cellIndex].slug.current);
        });
      }
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

  .free {
    width: auto;
    height: 100%;
    object-fit: unset;
  }

  .slideshow {
    // background: red;
  }
</style>

<div class="carousel slideshow" bind:this={slideShowEl}>
  {#each slideArray as slide}
    <div class="carousel-cell slideshow__slide" class:free={isTextNavigation}>
      {#if isTextNavigation}
        <img
          class="slideshow__slide-textnav"
          src={urlFor(slide.image)
            .height(180)
            .quality(80)
            .auto('format')
            .url()}
          alt={slide.title} />
      {:else}
        <span />
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
      {/if}
    </div>
  {/each}
</div>
