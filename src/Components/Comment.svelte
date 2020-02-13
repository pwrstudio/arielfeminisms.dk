<script>
  // # # # # # # # # # # # # # # #
  //
  //  Comment
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { createEventDispatcher } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { formatDistanceToNow } from "date-fns";
  import get from "lodash/get";

  import { auth } from "../global.js";

  // *** COMPONENTS
  import Cross from "../Graphics/Cross.svelte";

  // *** STORES
  import { loggedInUser } from "../stores.js";

  // *** PROPS
  export let commentId = "";
  export let authorId = "";
  export let authorName = "";
  export let date = "";
  export let location = "";
  export let content = "";
  export let delay = 0;

  let editMode = false;
  let editedContent = content;

  const dispatch = createEventDispatcher();

  const deleteComment = () => {
    if (!$loggedInUser) return false;

    let jwt = $loggedInUser.jwt();

    jwt.then(jwt => {
      console.dir(jwt);
      console.log(commentId);

      const url =
        "https://arielfeminisms.netlify.com/.netlify/functions/comment?id=" +
        encodeURIComponent(commentId);

      fetch(url, {
        method: "DEL",
        headers: new Headers({
          Authorization: "Bearer " + jwt
        })
      })
        .then(response => {
          console.log("SUCCESS");
          console.dir(response);
        })
        .catch(err => {
          console.log("ERROR");
          console.error(err);
        });
    });
  };

  const editComment = () => {
    if (!$loggedInUser) return false;

    let jwt = $loggedInUser.jwt();

    jwt.then(jwt => {
      console.dir(jwt);
      console.log(commentId);

      const url =
        "https://arielfeminisms.netlify.com/.netlify/functions/comment?comment=" +
        encodeURIComponent("EDITED: XXXX") +
        "&id=" +
        encodeURIComponent(commentId);

      fetch(url, {
        method: "PUT",
        headers: new Headers({
          Authorization: "Bearer " + jwt
        })
      })
        .then(response => {
          console.log("SUCCESS");
          newComment = "";
          console.dir(response);
        })
        .catch(err => {
          console.log("ERROR");
          console.error(err);
        });
    });
  };

  const formattedDuration = date =>
    formatDistanceToNow(Date.parse(date), { addSuffix: true });
</script>

<style lang="scss">
  @import "../variables.scss";

  .comment-box {
    width: 380px;
    background: $grey;
    padding: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    overflow: hidden;
    font-family: $font-stack-ygrg-regular;
    font-size: $font-size-medium;

    .meta {
      font-size: $font-size-small;
      margin-bottom: 0.5em;
    }

    .location {
      font-family: $font-stack-ariel;
      font-size: $font-size-small;
      margin-bottom: 1em;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .actions {
    margin-top: 10px;
  }

  .delete {
    cursor: pointer;
    font-size: $font-size-small;
    background: $red;
    padding: 5px;
    border-radius: 4px;
  }
</style>

<div class="comment-box" in:slide={{ duration: 100 + delay * 100 }}>
  <div class="meta">Posted {formattedDuration(date)} by {authorName}</div>
  <div
    class="location"
    on:click={() => {
      dispatch('goto', { page: parseInt(location) });
    }}>
    ⇒ Page {location}
  </div>
  <div class="comment-text">{content}</div>
  {#if $loggedInUser && $loggedInUser.id == authorId}
    <div class="actions">
      <span class="delete" on:click={deleteComment}>Delete comment</span>
    </div>
    <!-- <span
        class="edit"
        on:click={() => {
          editMode = true;
        }}>
        EDIT
      </span>
    </div>
    {#if editMode}
      <textarea bind:value={editedContent} class="comment-input" type="text" />
      <button disabled={!$loggedInUser} on:click={submitComment}>
        {#if $loggedInUser}Send comment{:else}Sign in to comment{/if}
      </button>
    {/if} -->
  {/if}
</div>
