<script>
  // # # # # # # # # # # # # # # #
  //
  //  SIGN IN
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { links } from "svelte-routing";
  import MediaQuery from "svelte-media-query";
  import { fade } from "svelte/transition";
  import * as Cookies from "es-cookie";
  import get from "lodash/get";
  import Dropzone from "svelte-dropzone";

  const addedfile = file => {
    console.log(file);
  };

  const drop = event => {
    console.log(event);
  };

  const init = () => console.log("dropzone init ! 😍");

  // *** GLOBALS
  import { auth } from "../global.js";

  // *** GRAPHICS
  import Ellipse from "../Graphics/Ellipse.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isAri,
    loggedInUser,
    userLoaded
  } from "../stores.js";

  // *** PROPS

  // *** VARIABLES
  let email = "";
  let password = "";
  let emailUp = "";
  let passwordUp = "";
  let nameUp = "";
  let processing = false;
  let msgSignUp = false;
  let msgSignIn = false;
  let signUpActive = false;
  let signUpMessage = false;
  let myDropzone = {};

  // *** DOM REFERENCES
  let bioEl = {};
  let uploadEl = {};

  const signIn = () => {
    processing = true;
    msgSignUp = false;
    msgSignIn = false;

    auth
      .login(email, password)
      .then(response => {
        // HACK
        Cookies.set(
          "ygrgLoggedInUser",
          JSON.stringify({
            email: email,
            password: password
          }),
          { expires: 7 }
        );
        processing = false;
        email = "";
        password = "";
        loggedInUser.set(auth.currentUser());
      })
      .catch(err => {
        processing = false;
        console.dir(err);
        msgSignIn = "Sign in failed: " + err.json.error_description;
      });
  };

  const signUp = () => {
    processing = true;
    msgSignIn = false;
    msgSignUp = false;

    auth
      .signup(emailUp, passwordUp, {
        name: nameUp,
        bookmarks: [],
        biography: ""
      })
      .then(response => {
        // RESET
        processing = false;
        signUpActive = false;
        emailUp = "";
        passwordUp = "";
        nameUp = "";
        msgSignIn =
          "A confirmation email has been sent to your address. Please click the link in the email to activate your account.";
      })
      .catch(err => {
        processing = false;
        console.dir(err.json.msg);
        msgSignUp = "Account creation failed. " + get(err, "json.msg", "");
      });
  };

  const logOut = () => {
    const user = auth.currentUser();
    user
      .logout()
      .then(response => {
        console.log("User logged out");
        msgSignUp = false;
        msgSignIn = "Logged out";
        Cookies.remove("ygrgLoggedInUser");
        loggedInUser.set(false);
      })
      .catch(error => {
        console.log("Failed to logout user: %o", error);
        throw error;
      });
  };

  const updateProfile = () => {
    const user = auth.currentUser();

    if (!user) return false;

    const newBiography = bioEl.value;

    user
      .update({ data: { biography: newBiography } })
      .then(user => {
        console.log("Updated user biography %s", user);
        console.dir(user);
      })
      .catch(error => {
        console.log("Failed to update user: %o", error);
        throw error;
      });
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .identity {
    width: 100%;
    height: auto;
    margin-top: 60px;
    font-size: $font-size-large;
    font-family: $font-stack-ariel;
    margin-right: 15px;
    margin-left: 15px;
    line-height: $line-height;
    width: calc(100% - 60px);

    @include screen-size("small") {
      width: calc(100% - 30px);
    }

    input {
      font-size: $font-size-medium;
      width: 100%;
      outline: none;
      line-height: $line-height;
      height: $line-height * 2.5;
      padding: 5px;
      border-radius: 5px;
      background: $brown;
      border: 2px solid white;
      color: white;
      margin-bottom: $line-height;

      &::placeholder {
        color: white;
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
    }

    .loading {
      display: block;
      float: right;
      background: transparent;
      font-size: $font-size-large;
      border: 0;
      font-family: $font-stack-ariel;
      font-weight: bold;
      margin: 0;
      padding: 0;
    }

    .sign-up-link {
      margin-top: $line-height;
      float: right;
    }
  }

  fieldset {
    width: 100%;
    display: inline-block;
    border: none;

    &.error {
      cursor: pointer;
    }
  }

  .profile {
    .profile-header {
      text-align: right;
      margin-bottom: $line-height;
    }

    .profile-picture {
      font-size: $font-size-medium;
      width: 150px;
      outline: none;
      line-height: $line-height;
      height: 200px;
      // line-height: 200px;
      text-align: center;
      padding: 5px;
      border-radius: 5px;
      background: $brown;
      border: 2px solid white;
      color: white;
      margin-bottom: $line-height;

      @include screen-size("small") {
        display: none;
      }
    }

    // .avatar-upload {
    //   background: red;
    //   font-size: $font-size-medium;
    //   width: auto;
    //   outline: none;
    //   line-height: $line-height;
    //   height: auto;
    //   text-align: center;
    //   padding: 5px;
    //   border-radius: 5px;
    //   background: $brown;
    //   border: 2px solid white;
    //   color: white;

    //   @include screen-size("small") {
    //     display: none;
    //   }
    // }

    .avatar-upload {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .avatar-upload-label {
      font-size: 1.25em;
      font-weight: 700;
      color: white;
      background-color: black;
      display: inline-block;
      cursor: pointer;
    }

    .inputfile:focus + label,
    .inputfile + label:hover {
      background-color: red;
    }

    .profile-picture-section {
      display: flex;
      justify-content: center;
      width: 75%;
      margin-left: 25%;

      @include screen-size("small") {
        font-size: $font-size-mobile-medium;
      }
    }

    .profile-section {
      margin-bottom: 10px;
      height: $line-height * 2.5;
    }

    input {
      font-size: $font-size-medium;
      width: 75%;
      float: right;
      outline: none;
      line-height: $line-height;
      height: $line-height * 2.5;
      padding: 5px;
      border-radius: 5px;
      background: $brown;
      border: 2px solid black;
      color: black;
      margin-bottom: $line-height;

      &::placeholder {
        color: black;
      }

      &.disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      &.read-only {
        pointer-events: none;
        background: $accent-grey;
      }

      @include screen-size("small") {
        border: 1px solid black;
      }
    }

    textarea {
      font-size: $font-size-medium;
      width: 75%;
      float: right;
      outline: none;
      line-height: $line-height;
      padding: 5px;
      border-radius: 5px;
      background: $brown;
      border: 2px solid black;
      color: black;
      margin-bottom: $line-height;
      resize: none;
      height: $line-height * 5;

      &::placeholder {
        color: black;
      }

      @include screen-size("small") {
        border: 1px solid black;
      }
    }
  }

  .danger-zone {
    background: black;
    width: 200px;
    float: right;
    height: 2px;
    line-height: 60px;

    @include screen-size("small") {
      height: 1px;
    }
  }
</style>

<div class="identity">

  {#if $userLoaded}
    <!-- SIGN IN  -->
    {#if !$loggedInUser && !signUpActive}
      <form class="sign-in">
        {#if msgSignIn}
          <fieldset
            class="sign-in-section error"
            on:click={() => {
              msgSignIn = false;
            }}
            out:fade>
            <span class="sign-up-link">{msgSignIn}</span>
          </fieldset>
        {/if}
        <fieldset>
          <input
            type="text"
            autocomplete="username"
            class:disabled={processing}
            placeholder="email"
            bind:value={email} />
          <input
            type="password"
            autocomplete="current-password"
            class:disabled={processing}
            placeholder="password"
            bind:value={password} />
        </fieldset>
        <fieldset>
          {#if !processing}
            <div class="action" on:click={signIn}>Sign In</div>
          {:else}
            <div class="loading">
              <Ellipse />
            </div>
          {/if}
        </fieldset>
        <fieldset>
          <!-- <div class='action' class="small">Recover password</div> -->
        </fieldset>
        {#if !processing}
          <fieldset>
            <div
              class="action"
              on:click={() => {
                signUpActive = true;
              }}>
              Create account
            </div>
          </fieldset>
        {/if}
      </form>
    {/if}

    <!-- SIGN UP -->
    {#if signUpActive}
      <form>
        {#if msgSignUp}
          <fieldset
            class="sign-in-section error"
            on:click={() => {
              msgSignUp = false;
            }}
            out:fade>
            <span class="sign-up-link">{msgSignUp}</span>
          </fieldset>
        {/if}
        <fieldset>
          <input
            type="text"
            class:disabled={processing}
            placeholder="Name"
            bind:value={nameUp} />
          <input
            type="text"
            autocomplete="username"
            class:disabled={processing}
            placeholder="Email"
            bind:value={emailUp} />
          <input
            type="password"
            autocomplete="current-password"
            class:disabled={processing}
            placeholder="Password"
            bind:value={passwordUp} />
        </fieldset>
        <fieldset>
          {#if !processing}
            <div class="action" on:click={signUp}>Sign up</div>
          {:else}
            <div class="loading">
              <Ellipse />
            </div>
          {/if}
        </fieldset>
      </form>
    {/if}

    <!-- PROFILE -->
    {#if $loggedInUser}
      <form class="profile">
        <div>
          <div class="profile-header">
            {$loggedInUser.user_metadata.name} ∙ profile
          </div>
        </div>

        <div class="profile-picture-section">
          <!-- <div class="profile-picture" /> -->
          <Dropzone
            dropzoneClass="avatar-dropzone"
            hooveringClass="avatar-dropzone-hover"
            dropzoneEvents={{ addedfile, drop, init }}
            options={{ url: 'https://arielfeminisms.netlify.com/.netlify/functions/avatar', clickable: true, acceptedFiles: 'image/*', resizeWidth: 40, resizeHeight: 40, init }}>
            Upload Image
          </Dropzone>
        </div>

        <fieldset>

          <div class="profile-section">
            <label>Name</label>
            <input
              type="text"
              class="read-only"
              value={$loggedInUser.user_metadata.name} />
          </div>

          <div class="profile-section">
            <label>Email</label>
            <input type="text" class="read-only" value={$loggedInUser.email} />
          </div>

          <div class="profile-section">
            <label>Biography</label>
            <textarea
              bind:this={bioEl}
              value={$loggedInUser.user_metadata.biography} />
          </div>
        </fieldset>

        <fieldset>
          <div class="action small" on:click={updateProfile}>
            Update Biography
          </div>
        </fieldset>

        <fieldset>
          <div class="danger-zone" />
        </fieldset>

        <fieldset>
          <div class="action small" on:click={logOut}>Sign out</div>
        </fieldset>

        <fieldset>
          <div class="action small">Delete Account</div>
        </fieldset>

      </form>
    {/if}
  {/if}

</div>
