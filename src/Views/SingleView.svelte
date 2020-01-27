<script>
  // *** IMPORT
  import { onMount } from "svelte";
  import { Route, links } from "svelte-routing";
  import { loadData, renderBlockText, urlFor } from "../sanity.js";

  // *** COMPONENTS
  import ArielLogo from "../Components/ArielLogo.svelte";
  import AriLogo from "../Components/AriLogo.svelte";
  import SlideShow from "../Components/SlideShow.svelte";

  export let title = "";
  export let slug = "";
  export let location = {};

  const single = loadData("*[slug.current == $slug][0]", { slug: slug });

  let showAbout = false;

  const isAriel = title === "ariel";
  const isAri = title === "ari";

  const aboutAriel = loadData('*[_id == "aboutAriel"][0]', {});
  const aboutAri = loadData('*[_id == "aboutAri"][0]', {});
  const generalInformation = loadData('*[_id == "generalInformation"][0]', {});
</script>

<style lang="scss">
  @import "../variables.scss";

  main {
    position: fixed;
    left: 0;
    top: 0;
    width: calc(100vw - 80px);
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: $font-stack-ariel;
  }

  .half-pane {
    position: absolute;
    top: 0;
    height: 100vh;
    width: 50%;
    overflow-y: auto;
    @include hide-scroll;

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }

    .inner-container {
      margin-top: $top-bar-height + 20px;
      margin-right: 30px;
      margin-left: 30px;
      font-size: $font-size-medium;
      font-weight: bold;
    }

    .bottom-meta {
      margin-top: 30px;
      text-align: center;
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

    &.left {
      //   background: $black;
      left: 0;
      //   background: red;
      box-sizing: border-box;
    }

    &.right {
      //   background: white;
      right: 0;
      //   background: green;
      box-sizing: border-box;
    }

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }

  .side-bar {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 80px;
    background: $grey;
    border-left: $line-style;

    .inner {
      position: absolute;
      top: 0;
      left: 80px;
      width: 100vh;
      height: 80px;
      display: block;
      transform-origin: 0% 0%;
      transform: rotateZ(90deg);
      line-height: 80px;
      padding-left: 30px;
      font-size: 36px;
      font-family: $font-stack-ygrg-extended;

      &:hover {
        text-decoration: none;
      }
    }

    .side-bar-background {
      position: absolute;
      top: 0;
      right: 0;
      height: 100vh;
      width: 78px;
      background: $grey;
      background: $red-gradient;
      pointer-events: none;
      transform: translateX(100%);
      transition: transform 1s $easing, opacity 1s $easing;
      opacity: 0;
    }

    &:hover {
      .side-bar-background {
        transform: translateX(0);
        transition: transform 0.3s $easing, opacity 0.5s $easing;
        opacity: 1;
      }
    }
  }

  .program {
    text-decoration: none;
    &:hover {
      text-decoration: none;
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

  .active {
    font-style: italic;
  }

  .about-pane {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: calc(50vw - 30px);
    background: pink;
    z-index: 10000;
    transform: translateX(-100%);
    background: $purple-gradient;
    font-size: $font-size-large;
    opacity: 0;
    overflow-y: auto;
    @include hide-scroll;

    &.open {
      transition: transform 0.2s $easing, opacity 0.3s $easing;
      transform: translateX(0);
      opacity: 1;
    }

    .inner-container {
      margin-top: $top-bar-height + 20px;
      margin-right: 30px;
      margin-left: 30px;
      font-size: $font-size-large;
      font-weight: bold;
    }

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: $font-size-large;
    }
  }
  .pseudo-link {
    cursor: pointer;
  }

  .bottom-text {
    position: absolute;
    bottom: 0;
    width: 100%;
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

<main>
  <div class="half-pane left">

    <!-- TOP BAR -->
    <div class="top-bar left" use:links>
      <div class="left">
        <a href="/" class:active={isAriel}>ARIEL</a>
        |
        <a href="/ari" class:active={isAri}>ARI</a>
      </div>
      <div class="right">
        <span on:click={() => (showAbout = true)} class="pseudo-link">
          ABOUT
        </span>
      </div>
    </div>

    <!-- INNER CONTAINER -->
    <div class="inner-container">

      <!-- LOGO -->
      <ArielLogo />

      <!-- BOTTOM META-->
      {#await generalInformation then generalInformation}
        <div class="bottom-meta">
          <div class="tagline">{generalInformation.tagline}</div>
          <div class="address">
            {@html generalInformation.address}
          </div>
        </div>
      {/await}
    </div>

  </div>

  <div class="half-pane right">
    <!-- TOP BAR -->
    <div class="top-bar right">
      {#if isAriel}
        <div class="left active">ARIEL PROGRAM</div>
      {/if}
      {#if isAri}
        <div class="left active">ARI READINGS</div>
      {/if}
    </div>

    <!-- INNER CONTAINER -->
    <div class="inner-container" use:links>

      {#await single then single}

        <SlideShow slideArray={single.slideshow} />

        <div class="bottom-text">
          <div class="title">{single.title}</div>
          <div class="artist">
            {#each single.artists as a}
              <span>{a},</span>
            {/each}
          </div>
          <div class="date">
            {single.startDate.substring(0, 9)} – {single.endDate.substring(0, 9)}
          </div>
        </div>

      {/await}

    </div>

  </div>

  <div class="side-bar left" use:links>
    <div class="side-bar-background" />
    <a href="/ygrg" class="inner">YGRG Archive</a>
  </div>

  <div class="about-pane" class:open={showAbout}>
    <div class="inner-container">

      {#await aboutAriel then aboutAriel}
        <div class="text">
          {@html renderBlockText(aboutAriel.content)}
        </div>
      {/await}

    </div>

    <div class="close" on:click={() => (showAbout = false)}>X</div>

  </div>

</main>
