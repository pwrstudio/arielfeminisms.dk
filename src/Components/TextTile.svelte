<script>
  // # # # # # # # # # # # # # # #
  //
  //  TEXT TILE
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { Route, links } from "svelte-routing";
  import MediaQuery from "svelte-media-query";
  import { formatDistanceToNow } from "date-fns";
  import get from "lodash/get";

  // *** STORES
  import { loggedInUser } from "../stores.js";

  // *** PROPS
  export let title = "";
  export let slug = "";
  export let date = "";
  export let id = "";

  $: marked = get($loggedInUser, "user_metadata.bookmarks", []).includes(id);

  const formattedDuration = date =>
    formatDistanceToNow(Date.parse(date), { addSuffix: true });
</script>

<style lang="scss">
  @import "../variables.scss";

  .tile {
    border: $line-style;
    border-radius: 8px;
    height: 140px;
    width: 140px;
    display: block;
    float: left;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: center;
    padding-top: 20px;
    font-family: $font-stack-ygrg-regular;
    line-height: $line-height;
    position: relative;
    overflow: hidden;

    @include screen-size("small") {
      font-size: $font-size-mobile-medium;
      border: $mobile-line-style;
      height: 105px;
      width: 105px;
      padding-top: 15px;
    }

    &:hover {
      background: $accent-grey;
    }

    .bookmark {
      height: 10px;
      position: absolute;
      top: 3px;
      right: 3px;

      @include screen-size("small") {
        display: none;
      }

      svg {
        polygon {
          fill: none;
        }
      }

      &.marked {
        svg {
          polygon {
            fill: $black;
          }
        }
      }
    }

    .title {
      padding-left: 10px;
      padding-right: 10px;
      overflow: hidden;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 3;
      -webkit-line-clamp: 3;

      @include screen-size("small") {
        padding-left: 5px;
        padding-right: 5px;
      }
    }

    .time {
      position: absolute;
      top: 80px;
      width: 100%;

      font-size: $font-size-small;

      @include screen-size("small") {
        top: 70px;
      }
    }

    .preview {
      font-size: $font-size-small;
      position: absolute;
      top: 110px;
      width: 100%;

      span {
        border-bottom: 1px solid $black;
      }

      @include screen-size("small") {
        display: none;
      }
    }
  }
</style>

<a class="tile" href="/ygrg/texts/{slug}">
  {#if $loggedInUser}
    <div class="bookmark" class:marked>
      <!-- BOOKMARK -->
      <svg
        class="bookmark"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 14.07 23.74">
        <defs>
          <style>
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
  {/if}
  <div class="title">{title}</div>
  <div class="time">{formattedDuration(date)}</div>
  <div class="preview">
    <span>Preview</span>
  </div>
</a>
