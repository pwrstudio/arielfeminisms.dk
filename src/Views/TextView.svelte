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
  import { fade, slide } from "svelte/transition";
  import { format, getYear } from "date-fns";
  import get from "lodash/get";

  // *** GLOBALS
  import { auth } from "../global.js";

  // *** GRAPHICS
  import Cross from "../Graphics/Cross.svelte";
  import SubmitArrow from "../Graphics/SubmitArrow.svelte";

  // *** COMPONENTS
  import Comment from "../Components/Comment.svelte";
  import SlideShow from "../Components/SlideShow.svelte";
  import MetaData from "../Components/MetaData.svelte";

  // *** STORES
  import { isText, isYGRG, isAriel, isAri, loggedInUser } from "../stores.js";

  // Set globals
  isText.set(true);
  isAriel.set(false);
  isAri.set(false);
  isYGRG.set(true);

  // *** PROPS
  export let slug = "";
  export let location = {};

  // DOM References
  let pdfViewerIframe = {
    contentWindow: {
      PDFViewerApplication: {
        page: 0,
        pagesCount: 0
      }
    }
  };

  // *** VARIABLES
  let submitComment = {};
  let submitBookmark = {};
  let newComment = "";
  let comments = [];
  let marked = false;
  let currentPage = false;
  let totalPages = false;

  // $: currentPage = get(
  //   pdfViewerIframe,
  //   "contentWindow.PDFViewerApplication.page",
  //   0
  // );

  // $: totalPages = get(
  //   pdfViewerIframe,
  //   "contentWindow.PDFViewerApplication.pagesCount",
  //   0
  // );

  // $: {
  //   if (
  //     pdfViewerIframe.contentDocument &&
  //     pdfViewerIframe.contentDocument.getElementById("pageNumber")
  //   ) {
  //     currentPage = pdfViewerIframe.contentDocument.getElementById("pageNumber")
  //       .value;
  //   }
  // }

  const text = loadData(
    "*[slug.current == $slug][0]{'id': _id, 'pdfFile': pdfFile.asset->url, title, relatedTexts[]->{title, image, slug}}",
    { slug: slug }
  );

  console.dir(text);

  const getCurrentPage = () => {
    if (pdfViewerIframe) {
      currentPage = get(
        pdfViewerIframe,
        "contentWindow.PDFViewerApplication.page",
        0
      );
    }
  };

  const getTotalPages = () => {
    if (pdfViewerIframe) {
      totalPages = get(
        pdfViewerIframe,
        "contentWindow.PDFViewerApplication.pagesCount",
        0
      );
    }
  };

  const getSelection = () => {
    console.dir(pdfViewerIframe.contentWindow.getSelection());
  };

  text.then(t => {
    marked = get($loggedInUser, "user_metadata.bookmarks", []).includes(t.id);

    comments = loadData(
      "*[_type == 'ygrgComment' && textReference._ref == $id] | order(_createdAt desc)",
      { id: t.id }
    );

    // HACK
    setInterval(getCurrentPage, 200);
    setInterval(getTotalPages, 2000);

    console.dir(t);

    // LOGIC
    submitComment = () => {
      if (!$loggedInUser) return false;

      comments = [];

      let jwt = $loggedInUser.jwt();

      jwt.then(jwt => {
        getCurrentPage();

        const url =
          "https://arielfeminisms.netlify.com/.netlify/functions/comment?comment=" +
          encodeURIComponent(newComment) +
          "&id=" +
          encodeURIComponent(t.id) +
          "&title=" +
          encodeURIComponent(t.title) +
          "&location=" +
          encodeURIComponent(currentPage);

        fetch(url, {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + jwt
          })
        })
          .then(response => {
            console.log("SUCCESS");
            newComment = "";
            comments = loadData(
              "*[_type == 'ygrgComment' && textReference._ref == $id] | order(_createdAt desc)",
              { id: t.id }
            );
          })
          .catch(err => {
            console.log("ERROR");
            console.error(err);
          });
      });
    };

    submitBookmark = () => {
      const user = auth.currentUser();

      if (!user) return false;

      const oldBookmarkList = user.user_metadata.bookmarks;
      const newBookmarkList = oldBookmarkList.includes(t.id)
        ? oldBookmarkList.filter(item => item !== t.id)
        : [...oldBookmarkList, t.id];

      user
        .update({ data: { bookmarks: newBookmarkList } })
        .then(user => {
          console.log("Updated user bookmarks %s", user);
          marked = get(user, "user_metadata.bookmarks", []).includes(t.id);
        })
        .catch(error => {
          console.log("Failed to update user: %o", error);
          throw error;
        });
    };
  });

  const goToPage = e => {
    pdfViewerIframe.contentWindow.PDFViewerApplication.page =
      e.detail.page == 0 ? 1 : e.detail.page;
  };

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
    background: $red-gradient;
    z-index: 100;
  }

  .pdf-viewer {
    position: absolute;
    top: 70px;
    right: 60px;
    height: calc(100vh - 70px);
    width: calc(100vw - 500px);

    @include screen-size("small") {
      top: 90px;
      right: 0px;
      height: calc(100vh - 70px);
      width: 100vw;
    }

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

  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    color: white;
    font-family: $font-stack-ygrg-regular;
  }

  .menu-bar {
    position: absolute;
    right: 60px;
    top: 40px;
    height: 20px;
    overflow: visible;
    width: calc(100vw - 480px);

    @include screen-size("small") {
      display: none;
    }

    .menu-bar-item {
      display: inline-flex;
      height: 20px;
      width: 20px;
      justify-content: center;
      overflow: visible;
      cursor: pointer;

      &.reload {
        margin-left: 5px;
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
    width: 400px;
    height: calc(100vh - 70px);
    overflow-y: auto;
    padding-bottom: 140px;
    @include hide-scroll;
    @include screen-size("small") {
      display: none;
    }
  }

  .text-navigation {
    position: absolute;
    left: 20px;
    bottom: 0px;
    width: 380px;
    overflow-y: auto;
    height: 140px;
    background: $red-gradient;
    padding-bottom: 10px;
    padding-top: 10px;

    @include screen-size("small") {
      display: none;
    }
  }

  .blur {
    position: absolute;
    left: 20px;
    bottom: 200px;
    width: 380px;
    overflow-y: auto;
    height: 180px;
    // background: green;
    display: none;
  }

  .comment {
    width: 380px;
    position: relative;

    .comment-input {
      font-size: $font-size-medium;
      width: 100%;
      border: 2px solid white;
      outline: none;
      line-height: $line-height;
      height: $line-height * 6;
      padding: 5px;
      border-radius: 5px;
      background: $red-gradient;
      resize: none;
      color: white;

      &::placeholder {
        color: white;
      }

      @include screen-size("small") {
        border: 1px solid white;
        font-size: $font-size-mobile-medium;
      }
    }

    .comment-icon {
      position: absolute;
      right: $line-height * 0.35;
      top: $line-height * 0.35;
      width: $line-height * 1.25;
      height: $line-height * 1.25;

      svg {
        fill: white !important;
        path {
          fill: white !important;
        }
      }
    }
  }

  .bookmark {
    svg {
      polygon {
        fill: none;
        stroke: white;
        stroke-miterlimit: 10;
        stroke-width: 2px;
      }
    }

    &.marked {
      svg {
        polygon {
          fill: white;
        }
      }
    }
  }

  .download {
    svg {
      polygon {
        fill: white;
      }
    }
  }

  .page-info {
    float: left;
    font-weight: 200;
    color: white;
    font-family: $font-stack-ygrg-regular;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .buttons {
    float: right;
  }

  .black-button {
    background: black;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    border: 0;
    outline: none;
    font-family: $font-stack-ygrg-regular;
    font-size: $font-size-medium;
    display: block;

    &:hover {
      background: rgba(40, 40, 40, 1);
    }
  }

  .pop-over {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 500px;
    max-width: 90vw;
    padding: 20px;
    padding-bottom: 40px;

    p {
      text-align: center;
      font-family: $font-stack-ygrg-extended;
      font-size: $font-size-large;
    }
  }
</style>

<div class="text-view" use:links>

  {#if $loggedInUser}
    {#await text then text}

      <MetaData post={text} />

      <div class="title">{text.title}</div>

      <div class="comment-container">

        <!-- <button on:click={getSelection}>Get selection</button> -->
        <div class="comment">
          <textarea
            class:disabled={!$loggedInUser}
            bind:value={newComment}
            class="comment-input"
            type="text"
            placeholder="Make a comment..." />
          <div class="comment-icon" class:disabled={!$loggedInUser}>
            <SubmitArrow />
          </div>
          <button
            class="black-button"
            disabled={!$loggedInUser}
            on:click={submitComment}>
            Send comment
          </button>
        </div>

        <div class="comment-list">
          {#await comments then comments}

            {#each comments as c}
              <Comment
                on:goto={goToPage}
                commentId={c._id}
                authorId={c.authorId}
                authorName={c.authorName}
                date={c._createdAt}
                location={c.location}
                content={c.content} />
            {/each}

          {/await}

        </div>

      </div>

      {#if text.relatedTexts}
        <div class="blur" />
        <div class="text-navigation">
          <SlideShow slideArray={text.relatedTexts} isTextNavigation={true} />
        </div>
      {/if}

      <div class="pdf-viewer">
        <iframe
          title={text.title}
          bind:this={pdfViewerIframe}
          src={'/pdfjs/web/viewer.html?file=' + encodeURIComponent(text.pdfFile) + '#page=1&zoom=page-width'} />
      </div>

      <div class="menu-bar">
        {#if currentPage && totalPages}
          <div class="page-info">{currentPage} / {totalPages}</div>
        {/if}

        <div class="buttons">
          <!-- BOOKMARK -->
          <div
            class="menu-bar-item bookmark"
            class:disabled={!$loggedInUser}
            class:marked
            on:click={submitBookmark}>
            <svg
              class="bookmark"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 14.07 23.74">
              <defs>
                <clipPath id="clip-path" transform="translate(0 0)">
                  <rect class="cls-1" width="14.07" height="23.74" />
                </clipPath>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <g class="cls-2">
                    <polygon
                      class="cls-3"
                      points="0.75 0.75 0.75 22.2 6.95 17.35 13.32 22.2 13.32
                      0.75 0.75 0.75" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

    {/await}
  {:else}
    <div class="pop-over">
      <p>Please sign in to read the text and comment</p>
      <a href="/ygrg/profile" class="black-button">Sign in</a>
    </div>
  {/if}

  <a href="/ygrg" class="close">
    <Cross />
  </a>

</div>
