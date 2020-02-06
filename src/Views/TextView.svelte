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

  import { auth } from "../identity.js";

  // *** GRAPHICS
  import Cross from "../Graphics/Cross.svelte";
  import SubmitArrow from "../Graphics/SubmitArrow.svelte";

  // *** COMPONENTS
  import Comment from "../Components/Comment.svelte";

  // *** STORES
  import { isText, loggedInUser } from "../stores.js";

  // Set globals
  isText.set(true);

  // *** PROPS
  export let title = "";
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
    "*[slug.current == $slug][0]{'id': _id, 'pdfFile': pdfFile.asset->url, title}",
    { slug: slug }
  );

  const getCurrentPage = () => {
    // console.dir(pdfViewerIframe.contentWindow.PDFViewerApplication);
    currentPage = get(
      pdfViewerIframe,
      "contentWindow.PDFViewerApplication.page",
      0
    );
  };

  const getTotalPages = () => {
    totalPages = get(
      pdfViewerIframe,
      "contentWindow.PDFViewerApplication.pagesCount",
      0
    );
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

    // LOGIC
    submitComment = () => {
      if (!$loggedInUser) return false;

      let jwt = $loggedInUser.jwt();

      jwt.then(jwt => {
        console.dir(jwt);
        console.log(t.id);

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
            console.dir(response);
            setTimeout(() => {
              comments = loadData(
                "*[_type == 'ygrgComment' && textReference._ref == $id] | order(_createdAt desc)",
                { id: t.id }
              );
            }, 5000);
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

      console.dir(user.user_metadata);

      const oldBookmarkList = user.user_metadata.bookmarks;
      const newBookmarkList = oldBookmarkList.includes(t.id)
        ? oldBookmarkList.filter(item => item !== t.id)
        : [...oldBookmarkList, t.id];

      console.dir(newBookmarkList);

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
    width: 60vw;

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
    right: 60px;
    top: 40px;
    height: 20px;
    overflow: visible;
    width: 60vw;

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
    width: 30vw;
    height: calc(100vh - 100px);
    overflow-y: auto;
  }

  .comment {
    width: 100%;
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
      background: $brown;
      resize: none;
      color: white;

      &::placeholder {
        color: white;
      }

      @include screen-size("small") {
        border: 1px solid white;
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

  .page-info {
    float: left;
    font-weight: 200;
    color: white;
    font-family: $font-stack-ygrg-regular;
    // font-size: $font-size-small;
  }

  .buttons {
    float: right;
  }
</style>

<div class="text-view" use:links>

  {#await text}
    <span />
  {:then text}

    <div class="title">{text.title}</div>

    <div class="comment-container">

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
      </div>
      <button disabled={!$loggedInUser} on:click={submitComment}>
        {#if $loggedInUser}Send comment{:else}Sign in to comment{/if}
      </button>

      {#await comments then comments}

        {#each comments as c}
          <Comment
            commentId={c._id}
            authorId={c.authorId}
            authorName={c.authorName}
            date={c._createdAt}
            location={c.location}
            content={c.content} />
        {/each}

      {/await}

    </div>

    <div class="pdf-viewer">
      <iframe
        title={text.title}
        bind:this={pdfViewerIframe}
        src={'/pdfjs/web/viewer.html?file=' + encodeURIComponent(text.pdfFile)} />
    </div>

    <div class="menu-bar">
      {#if currentPage && totalPages}
        <div class="page-info">{currentPage} / {totalPages}</div>
      {/if}

      <!-- DOWNLOAD -->
      <div class="buttons">

        <a
          href={text.pdfFile}
          target="_blank"
          download={slug}
          class="menu-bar-item download">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 11.6 23.32"
            class="download">
            <polygon
              class="cls-1"
              points="4.76 0 4.8 18.91 2.57 17 0.04 17.03 5.76 21.71 0.02 21.67
              0 23.32 11.58 23.24 11.6 21.75 5.78 21.69 11.58 17.09 9.09 17.07
              6.75 18.91 6.69 0.02 4.76 0" />
          </svg>
        </a>

        <div
          class="menu-bar-item bookmark"
          class:disabled={!$loggedInUser}
          class:marked
          on:click={submitBookmark}>
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
      </div>
    </div>

    <a href="/ygrg" class="close">
      <Cross />
    </a>

  {:catch error}
    File not Found (404)
    <br />
    <a href="/">Return to main page</a>

  {/await}

</div>
