<script>
  // # # # # # # # # # # # # # # #
  //
  //  View: Text
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Route, links } from "svelte-routing";
  import { loadData, renderBlockText } from "../sanity.js";

  // *** COMPONENTS
  import Cross from "../Components/Cross.svelte";
  import SubmitArrow from "../Components/SubmitArrow.svelte";

  // *** STORES
  import { isText } from "../stores.js";

  // Set globals
  isText.set(true);

  // *** PROPS
  export let title = "";
  export let slug = "";
  export let location = {};

  const text = loadData(
    "*[slug.current == $slug][0]{'pdfFile': pdfFile.asset->url, title}",
    { slug: slug }
  );

  // *** ON DESTROY
  onDestroy(async () => {
    isText.set(false);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .text-view {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background: $brown;
  }

  .pdf-viewer {
    position: absolute;
    top: 70px;
    right: 60px;
    height: calc(100vh - 100px);
    width: 70vw;

    iframe {
      height: 100%;
      width: 100%;
      border: 0;
      outline: 0;
    }
  }

  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    height: 24px;
    width: 24px;
    transition: transform 0.3s $easing;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }

  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    color: white;
    font-family: $font-stack-ygrg-regular;
  }

  .menu-bar {
    position: absolute;
    right: 55px;
    top: 40px;
    height: 20px;
    overflow: visible;

    .menu-bar-item {
      display: inline-flex;
      height: 20px;
      width: 20px;
      justify-content: center;
      overflow: visible;
      cursor: pointer;

      .cls-1 {
        fill: #000;
      }

      &.reload {
        margin-left: 5px;
      }

      &.download {
      }

      &.print {
      }

      &.bookmark {
      }

      svg {
        height: 20px;

        &.reload {
          height: 20px;
        }
      }
    }
  }

  .comment-container {
    position: absolute;
    left: 20px;
    top: 70px;
    width: 20vw;
  }

  .comment {
    width: 100%;
    position: relative;

    .comment-input {
      font-size: $font-size-medium;
      width: 100%;
      border: $line-style;
      outline: none;
      line-height: $line-height;
      height: $line-height * 6;
      padding: 5px;
      border-radius: 5px;
      background: $grey;

      @include screen-size("small") {
        border: $mobile-line-style;
      }
    }

    .comment-icon {
      position: absolute;
      right: $line-height * 0.35;
      top: $line-height * 0.35;
      width: $line-height * 1.25;
      height: $line-height * 1.25;
    }
  }
</style>

<div class="text-view" use:links>

  {#await text then text}

    <div class="title">{text.title}</div>

    <div class="comment-container">
      <div class="comment">
        <textarea
          class="comment-input"
          type="text"
          placeholder="Comment a text... ..." />
        <div class="comment-icon">
          <SubmitArrow />
        </div>
      </div>
    </div>

    <div class="pdf-viewer">
      <iframe src={text.pdfFile} />
    </div>
  {/await}

  <div class="menu-bar">

    <div class="menu-bar-item reload">
      <!-- RELOAD -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 22.32 22.83">
        <defs>
          <style>
            .cls-1 {
              fill: none;
            }
            .cls-2 {
              clip-path: url(#clip-path);
            }
            .cls-3 {
              fill: #000;
              width: 20px;
            }
          </style>
          <clipPath id="clip-path" transform="translate(0 0)">
            <rect class="cls-1" width="32.33" height="30.83" />
          </clipPath>
        </defs>
        <title>Asset 7</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <g class="cls-2">
              <path
                class="cls-3"
                d="M14.59,7.73l6.82-.91L22.33,0,20.51,1.82l-.33,2.75A11.15,11.15,0,0,0,11.32.23h0a11.3,11.3,0,1,0,9.66,17.18l-1.28-.79A9.79,9.79,0,1,1,11.3,1.73a9.71,9.71,0,0,1,7.77,3.86l-2.61.27Z"
                transform="translate(0 0)" />
            </g>
          </g>
        </g>
      </svg>
    </div>

    <div class="menu-bar-item download">
      <!-- DOWNLOAD -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 11.6 23.32"
        class="download">
        <polygon
          class="cls-1"
          points="4.76 0 4.8 18.91 2.57 17 0.04 17.03 5.76 21.71 0.02 21.67 0
          23.32 11.58 23.24 11.6 21.75 5.78 21.69 11.58 17.09 9.09 17.07 6.75
          18.91 6.69 0.02 4.76 0" />
      </svg>
    </div>
    <div class="menu-bar-item print">
      <!-- PRINT -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 19.95 23.32"
        class="print">
        <defs>
          <style>

          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <path
              class="cls-1"
              d="M8.16,15.63v1.9h-2L9.9,21.25l3.76-3.72h-2v-1.9Zm-5.4-1.71H17.22v8.13H2.76ZM1.27,9.53H18.68v3.14H1.27ZM12.55,2l3.84,3.87H12.55ZM2.76,1.27h8.61v5.8h5.85V8.26H2.76ZM1.51,0V8.26H0v5.66H1.51v9.4h17v-9.4H20V8.26H18.49v-2L12.26,0Z" />
          </g>
        </g>
      </svg>
    </div>

    <div class="menu-bar-item bookmark">
      <!-- BOOKMARK -->
      <svg
        class="bookmark"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 14.07 23.74">
        <defs>
          <style>
            .cls-1,
            .cls-3 {
              fill: none;
            }
            .cls-2 {
              clip-path: url(#clip-path);
            }
            .cls-3 {
              stroke: #000;
              stroke-miterlimit: 10;
              stroke-width: 1.5px;
            }
          </style>
          <clipPath id="clip-path" transform="translate(0 0)">
            <rect class="cls-1" width="14.07" height="23.74" />
          </clipPath>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <g class="cls-2">
              <polygon
                class="cls-3"
                points="0.75 0.75 0.75 22.2 6.95 17.35 13.32 22.2 13.32 0.75
                0.75 0.75" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>

  <a href="/ygrg" class="close">
    <Cross />
  </a>

</div>
