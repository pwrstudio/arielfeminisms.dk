<script>
  // # # # # # # # # # # # # # # #
  //
  //  Comment
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { createEventDispatcher } from "svelte";
  import { fade, slide } from "svelte/transition";
  import get from "lodash/get";
  import { loadData } from "../sanity.js";

  // *** GLOBALS
  import { auth, formattedDuration } from "../global.js";

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

  // *** VARIABLES
  let editMode = false;
  let editedContent = content;
  let avatarImage = false;

  const dispatch = createEventDispatcher();

  const deleteComment = () => {
    if (!$loggedInUser) return false;

    let jwt = $loggedInUser.jwt();

    jwt.then(jwt => {
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
        })
        .catch(err => {
          console.log("ERROR");
          console.error(err);
        });
    });
  };

  let avatar = loadData("*[_type == 'userAvatar' && _id == $id][0]", {
    id: authorId
  });
  console.dir(avatar);
  avatar
    .then(a => {
      console.dir(a);
      avatarImage = a.image;
    })
    .catch(err => {
      console.dir(err);
    });
</script>

<style lang="scss">
  @import "../variables.scss";

  .comment-box {
    width: 380px;
    background: $grey;
    padding: 15px;
    padding-top: 10px;
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
      margin-bottom: 1.5em;
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
    color: $red;
    text-decoration: none;
    padding-left: 15px;
    border-radius: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  .avatar {
    height: 50px;
    width: 50px;
    object-fit: cover;
    border-radius: 50px;
    float: right;
    border: 2px solid $accent-grey;
    position: relative;
    top: -3px;
    right: -7px;
  }
</style>

<div class="comment-box" in:slide={{ duration: 100 + delay * 100 }}>
  {#if avatarImage}
    <img src={avatarImage} class="avatar" />
  {/if}
  <div class="meta">
    {authorName}
    {#if $loggedInUser && $loggedInUser.id == authorId}
      <span class="delete" on:click={deleteComment}>(Delete comment)</span>
    {/if}
  </div>
  <div class="meta">{formattedDuration(date)}</div>
  <div
    class="location"
    on:click={() => {
      dispatch('goto', { page: parseInt(location) });
    }}>
    ⇒ Page {location}
  </div>
  <div class="comment-text">{content}</div>
  {#if $loggedInUser && $loggedInUser.id == authorId}
    <!-- <div class="actions">
    </div> -->
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
