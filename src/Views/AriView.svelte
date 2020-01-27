<script>
  // *** IMPORT
  import { onMount } from "svelte";
  import { Route, links } from "svelte-routing";
  import { loadData, renderBlockText } from "../sanity.js";

  // *** COMPONENTS
  import ArielLogo from "../Components/ArielLogo.svelte";

  const abouts = loadData('*[_type in [ "about"]]', {});
  const generalInformation = loadData('*[_id == "generalInformation"][0]', {});
  const readings = loadData('*[_type in [ "reading"]]', {});
</script>

<style lang="scss">
  @import "../variables.scss";

  .half-pane {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 50vw;

    &.left {
      //   background: $red;
      left: 0;
    }

    &.right {
      //   background: $purple;
      right: 0;
    }
  }

  .top-bar {
    position: fixed;
    top: 0;
    height: 60px;
    width: 50vw;

    &.left {
      //   background: $black;
      left: 0;
    }

    &.right {
      //   background: white;
      right: 0;
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
    background: yellow;
  }
</style>

<main>
  <div class="half-pane left">
    <div class="top-bar left" use:links>
      <div class="left">
        <a href="/">ARIEL</a>
        |
        <a href="ari">ARI</a>
      </div>
      <div class="right">
        <a href="about">ABOUT</a>
      </div>
    </div>
    <ArielLogo />
    {#await generalInformation then generalInformation}
      <div class="bottom-meta">
        <div class="tagline">{generalInformation.tagline}</div>
        <div class="address">
          {@html generalInformation.address}
        </div>
      </div>
    {/await}
  </div>

  <div class="half-pane right">
    <div class="top-bar right">
      <div class="left">ARI READINGS</div>
      <div class="right" />
    </div>
    {#await readings then readings}
      {#each readings as r}
        <div class="program">
          <div class="title">r.title</div>
          <div class="artist">MATHILDE CARBEL</div>
          <div class="date">{r.date}</div>
          <div class="text">
            {@html renderBlockText(r.content)}
          </div>
        </div>
      {/each}

    {/await}

  </div>

  <div class="side-bar left">YGRG Archive</div>

</main>
