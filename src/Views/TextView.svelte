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

  // *** STORES
  import { isText } from "../stores.js";

  // Set globals
  isText.set(true);

  // *** PROPS
  export let title = "";
  export let slug = "";
  export let location = {};

  const text = loadData(
    "*[slug.current == $slug][0]{'pdfFile': pdfFile.asset->url}",
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
    top: 60px;
    right: 40px;
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
    right: 20px;
    top: 20px;
    height: 24px;
    width: 24px;
    transition: transform 0.3s $easing;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }
</style>

<div class="text-view" use:links>

  {#await text then text}
    <div class="pdf-viewer">
      <iframe src={text.pdfFile} />
    </div>
  {/await}

  <a href="/ygrg" class="close">
    <Cross />
  </a>

</div>
