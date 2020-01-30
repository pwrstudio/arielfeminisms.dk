<script>
  // # # # # # # # # # # # # # # #
  //
  //  arielfeminisms.dk
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { Router, Route, links } from "svelte-routing";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";

  // *** COMPONENTS
  import ArielNavigation from "./Components/ArielNavigation.svelte";
  import YGRGNavigation from "./Components/YGRGNavigation.svelte";
  import TopBar from "./Components/TopBar.svelte";

  // *** STORES
  import { isYGRG, isAriel, isText } from "./stores.js";

  // ** VIEWS
  import ArielView from "./Views/ArielView.svelte";
  import YGRGView from "./Views/YGRGView.svelte";
  import TextView from "./Views/TextView.svelte";
  import Error404 from "./Views/Error404.svelte";
</script>

<style lang="scss" global>
  @import "./variables.scss";

  body,
  html {
    background: $grey;
    margin: 0;
    padding: 0;
    color: $black;
    font-family: $font-stack-ariel;
  }

  a {
    color: $black;
    text-decoration: none;

    &:hover {
      color: $black;
      text-decoration: none;
    }
    &:visited {
      color: $black;
    }
  }

  .pseudo-link {
    &:hover {
      font-style: italic;
    }
  }

  * {
    box-sizing: border-box;
  }

  .slideshow {
    width: 100%;
    height: 300px;
  }

  .slideshow__slide {
    width: 100%;
    height: 100%;
    overflow: hidden;

    iframe {
      max-width: 90%;
      max-height: 90%;
      margin-left: 5%;
    }
  }

  .slideshow__slide-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .flickity-enabled {
    position: relative;
  }

  .flickity-enabled:focus {
    outline: none;
  }

  .flickity-viewport {
    overflow: hidden;
    position: relative;
    height: 100%;
  }

  .flickity-slider {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  /* draggable */

  .flickity-enabled.is-draggable {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .flickity-enabled.is-draggable .flickity-viewport {
    cursor: move;
    cursor: -webkit-grab;
    cursor: grab;
  }

  .flickity-enabled.is-draggable .flickity-viewport.is-pointer-down {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

  /* ---- flickity-button ---- */

  .flickity-button {
    position: absolute;
    background: hsla(0, 0%, 100%, 0.75);
    border: none;
    color: #333;
  }

  .flickity-button:hover {
    background: white;
    cursor: pointer;
  }

  .flickity-button:focus {
    outline: none;
    box-shadow: 0 0 0 5px #19f;
  }

  .flickity-button:active {
    opacity: 0.6;
  }

  .flickity-button:disabled {
    opacity: 0.3;
    cursor: auto;
    /* prevent disabled button from capturing pointer up event. #716 */
    pointer-events: none;
  }

  .flickity-button-icon {
    fill: currentColor;
  }

  /* ---- previous/next buttons ---- */

  .flickity-prev-next-button {
    top: 50%;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    /* vertically center */
    transform: translateY(-50%);
  }

  .flickity-prev-next-button.previous {
    left: 10px;
  }
  .flickity-prev-next-button.next {
    right: 10px;
  }
  /* right to left */
  .flickity-rtl .flickity-prev-next-button.previous {
    left: auto;
    right: 10px;
  }
  .flickity-rtl .flickity-prev-next-button.next {
    right: auto;
    left: 10px;
  }

  .flickity-prev-next-button .flickity-button-icon {
    position: absolute;
    left: 20%;
    top: 20%;
    width: 60%;
    height: 60%;
  }

  /* ---- page dots ---- */

  .flickity-page-dots {
    position: absolute;
    width: 100%;
    bottom: -25px;
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center;
    line-height: 1;
  }

  .flickity-rtl .flickity-page-dots {
    direction: rtl;
  }

  .flickity-page-dots .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 8px;
    background: #333;
    border-radius: 50%;
    opacity: 0.25;
    cursor: pointer;
  }

  .flickity-page-dots .dot.is-selected {
    opacity: 1;
  }
</style>

<main>

  <Router>
    <Route path="/" component={ArielView} title="ariel" />

    <Route path="/ari" component={ArielView} title="ari" />

    <Route path="/:slug" component={ArielView} title="ariel" />

    <!-- <Route path="/ari/reading/:slug" component={readingView} /> -->

    <Route path="/ygrg" component={YGRGView} />
    <Route path="/ygrg/text/:slug" component={TextView} />

    <Route path="/ygrg/:slug" component={YGRGView} />

    <!-- <Route path="/ygrg/signup" component={signupView} />
    <Route path="/ygrg/signIn" component={signupView} />
    <Route path="/ygrg/profile" component={propfileView} /> -->
    <Route component={Error404} title="404" />
  </Router>

  <!-- TODO: PhoneNavigation -->
  <MediaQuery query="(max-width: 700px)" let:matches>
    {#if matches}
      <TopBar />
    {/if}
  </MediaQuery>

  {#if $isYGRG && !$isText}
    <ArielNavigation />
  {/if}

  {#if $isAriel && !$isText}
    <YGRGNavigation />
  {/if}

</main>
