<script>
  // # # # # # # # # # # # # # # #
  //
  //  Event
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { Route, links } from "svelte-routing";
  import { loadData, renderBlockText } from "../sanity.js";
  import SlideShow from "../Components/SlideShow.svelte";

  // *** COMPONENTS
  import ArielVerticalLogo from "../Components/ArielVerticalLogo.svelte";

  export let title = "";
  export let slug = "";
  export let location = {};

  const single = loadData("*[slug.current == $slug][0]", { slug: slug });

  let showAbout = false;

  const aboutYGRG = loadData('*[_id == "aboutYGRG"][0]', {});
  const texts = loadData('*[_type in [ "ygrgText"]]', {});

  console.dir(single);
</script>

<style lang="scss">
  @import "../variables.scss";

  main {
    position: fixed;
    right: 0;
    top: 0;
    width: calc(100vw - 80px);
    height: 100vh;
    margin: 0;
    padding: 0;
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
    user-select: none;

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
    left: 0;
    height: 100vh;
    width: 80px;
    background: $grey;
    border-right: $line-style;
    user-select: none;

    .inner {
      position: absolute;
      top: 0;
      left: 0px;
      height: 100vh;
      width: 80px;
      display: block;
      transform-origin: 0% 0%;
      //   transform: rotateZ(90deg);
      line-height: 80px;
      padding-left: 15px;
      padding-top: 30px;
      font-size: 42px;
    }
  }

  .program {
    font-family: $font-stack-ygrg-extended;

    .title {
      text-align: center;
    }
    .date {
      text-align: center;
    }
    .artist {
      text-align: center;
    }
  }

  .active {
    font-style: italic;
  }

  .about-pane {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: calc(50vw - 30px);
    background: $grey;
    z-index: 10000;
    transform: translateX(100%);
    background: $red-gradient;
    opacity: 1;
    font-family: $font-stack-ygrg-regular;

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
      left: 20px;
      top: 20px;
      font-size: $font-size-large;
    }
  }
  .pseudo-link {
    cursor: pointer;
  }
  .tile {
    border: $line-style;
    border-radius: 4px;
    height: 160px;
    width: calc(32% - 10px);
    display: block;
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
    text-align: center;
    padding-top: 40px;
    font-family: $font-stack-ygrg-regular;

    .time {
      font-size: $font-size-small;
      margin-bottom: 20px;
    }

    .preview {
      font-size: $font-size-small;
    }
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
        <span on:click={() => (showAbout = !showAbout)} class="pseudo-link">
          ABOUT YGRG
        </span>
      </div>
      <div class="right">SIGN IN</div>
    </div>

    <!-- INNER CONTAINER -->
    <div class="inner-container">

      <div class="tile-container" use:links>

        {#await texts then texts}
          {#each texts as t}
            <a class="tile" href="/ygrg/text/{t.slug.current}">
              <div class="title">{t.title}</div>
              <div class="time">About 2 months ago</div>
              <div class="preview">Preview</div>
            </a>
          {/each}
          {#each texts as t}
            <a class="tile" href="/ygrg/text/{t.slug.current}">
              <div class="title">{t.title}</div>
              <div class="time">About 2 months ago</div>
              <div class="preview">Preview</div>
            </a>
          {/each}
        {/await}
      </div>

    </div>

  </div>

  <div class="half-pane right">
    <!-- TOP BAR -->
    <div class="top-bar right">
      <div class="left active">YGRG ARCHIVE</div>
    </div>

    <!-- INNER CONTAINER -->
    <div class="inner-container">

      {#await single then single}

        <SlideShow slideArray={single.slideshow} />

        <div class="bottom-text">
          <div class="title">{single.title}</div>
          <div class="date">
            {single.startDate.substring(0, 9)} – {single.endDate.substring(0, 9)}
          </div>
        </div>

      {/await}

    </div>

  </div>

  <div class="side-bar left" use:links>
    <a href="/" class="inner">
      <ArielVerticalLogo />
    </a>
  </div>

  <div class="about-pane" class:open={showAbout}>
    <div class="inner-container">

      {#await aboutYGRG then aboutYGRG}
        <div class="text">
          {@html renderBlockText(aboutYGRG.content)}
        </div>
      {/await}

    </div>

    <div class="close" on:click={() => (showAbout = false)}>X</div>

  </div>

</main>
