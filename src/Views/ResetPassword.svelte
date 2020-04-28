<script>
  // # # # # # # # # # # # # # # #
  //
  //  RESET PASSWORD FORM
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { navigate } from "svelte-routing";
  import get from "lodash/get";

  // *** GLOBALS
  import { auth } from "../global.js";

  // *** GRAPHICS
  import Cross from "../Graphics/Cross.svelte";

  // *** STORES
  import { loggedInUser } from "../stores.js";

  let newPassword = "";
  let repeatPassword = "";

  // *** PROPS
  export let slug = "";
  export let location = {};

  const changePassword = e => {
    if (newPassword === repeatPassword) {
      navigate("/ygrg/profile/");
    } else {
      window.alert("The two passwords do not match. Try again. ");
      newPassword = "";
      repeatPassword = "";
    }
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .reset-form {
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

  input {
    font-size: $font-size-medium;
    width: 100%;
    outline: none;
    line-height: $line-height;
    height: $line-height * 2.5;
    padding: 5px;
    border-radius: 5px;
    background: transparent;
    border: 2px solid white;
    color: black;
    margin-bottom: $line-height;

    &::placeholder {
      color: $muted-grey;
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    @include screen-size("small") {
      border: 1px solid white;
    }
  }

  .action {
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
    font-family: $font-stack-ariel;
    font-size: $font-size-medium;
    user-select: none;

    &.small {
      width: 200px;
      height: 40px;
      line-height: 40px;
      float: right;
    }

    &:hover {
      background: rgba(40, 40, 40, 1);
    }

    &.minor {
      background: transparent;
      width: auto;
      line-height: 1.2em;
      height: auto;
      float: right;
      color: black;
      border-bottom: 2px solid black;
      border-radius: 0;

      &:hover {
        background: transparent;
        border-bottom: 2px solid transparent;
      }
    }

    &.done {
      background: transparent;
      color: black;
      pointer-events: none;
    }
  }

  .form-container {
    width: 600px;
    max-width: 90%;
    margin-top: 60px;
    margin-left: auto;
    margin-right: auto;
  }

  fieldset {
    width: 100%;
    display: inline-block;
    border: none;

    &.error {
      cursor: pointer;
    }
  }

  .top {
    margin-bottom: 20px;
  }
</style>

<div class="reset-form">

  {#if $loggedInUser}
    <div class="form-container">
      <fieldset>

        <div class="profile-section top">
          <div>
            Change password for user: {$loggedInUser.user_metadata.name} ({$loggedInUser.email})
          </div>
        </div>

      </fieldset>

      <fieldset>
        <div class="profile-section">
          <label>New password</label>
          <input type="password" bind:value={newPassword} />
        </div>

        <div class="profile-section">
          <label>Repeat new password</label>
          <input type="password" bind:value={repeatPassword} />
        </div>
      </fieldset>

      <fieldset>
        <div class="action" on:click={changePassword}>Change password</div>
      </fieldset>
    </div>
  {/if}

  <a href="/ygrg" class="close">
    <Cross />
  </a>

</div>
