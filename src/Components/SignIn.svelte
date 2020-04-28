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
  import { loadData, renderBlockText, toPlainText } from "../sanity.js";
  import resizebase64 from "resize-base64";

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
  let avatarImage = false;
  let bioUpdateDone = false;
  let recoverActive = false;
  let emailRecovery = "";

  $: {
    if ($loggedInUser) {
      let avatar = loadData("*[_type == 'userAvatar' && _id == $id][0]", {
        id: $loggedInUser.id
      });
      avatar
        .then(a => {
          avatarImage = a.image;
        })
        .catch(err => {
          Sentry.captureException(err);
        });
    }
  }

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
        Sentry.captureException(err);
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
        biography: "",
        avatar: ""
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
        Sentry.captureException(err);
        msgSignUp = "Account creation failed. " + get(err, "json.msg", "");
      });
  };

  const logOut = () => {
    processing = true;
    const user = auth.currentUser();
    user
      .logout()
      .then(response => {
        processing = false;
        msgSignUp = false;
        msgSignIn = "Logged out";
        Cookies.remove("ygrgLoggedInUser");
        loggedInUser.set(false);
      })
      .catch(err => {
        processing = false;
        Sentry.captureException(err);
      });
  };

  const updateProfile = () => {
    processing = true;
    const user = auth.currentUser();

    if (!user) return false;

    const newBiography = bioEl.value;

    user
      .update({ data: { biography: newBiography } })
      .then(user => {
        processing = false;
        bioUpdateDone = true;
        console.log("Updated user biography %s", user);
      })
      .catch(err => {
        processing = false;
        Sentry.captureException(err);
      });
  };

  const addedfile = file => {
    if (!$loggedInUser) return false;

    let jwt = $loggedInUser.jwt();

    jwt.then(jwt => {
      const url = "https://arielfeminisms.dk/.netlify/functions/avatar/";

      setTimeout(() => {
        const scaledImage = resizebase64(file.dataURL, 200);
        avatarImage = scaledImage;

        fetch(url, {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + jwt
          }),
          body: scaledImage
        })
          .then(response => {
            console.log("Avatar uploaded");
          })
          .catch(err => {
            Sentry.captureException(err);
          });
      }, 1000);
    });
  };

  const recoverPassword = () => {
    processing = true;

    auth
      .requestPasswordRecovery(emailRecovery)
      .then(response => {
        processing = false;
        emailRecovery = "";
        console.log("Recovery email sent", { response });
        msgSignIn = "Recovery email sent";
        recoverActive = false;
      })
      .catch(err => Sentry.captureException(err));
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
      font-size: $font-size-mobile-large;
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

    .profile-picture-section {
      display: flex;
      justify-content: center;
      width: 75%;
      margin-left: 25%;

      @include screen-size("small") {
        font-size: $font-size-mobile-medium;
        width: 100%;
        margin-left: unset;
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
      background: transparent;

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
        background: transparent;
        color: $muted-grey;
      }

      @include screen-size("small") {
        border: 1px solid black;
        width: 100%;
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
      background: transparent;
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
        width: 100%;
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
    {#if !$loggedInUser && !signUpActive && !recoverActive}
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
            on:keydown={e => {
              if (e.key === 'Enter') {
                signIn();
              }
            }}
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
          <fieldset>
            <div
              class="action minor"
              on:click={() => {
                recoverActive = true;
              }}>
              Recover password
            </div>
          </fieldset>
        {/if}
      </form>
    {/if}

    <!-- RECOVER PASSWORD -->
    {#if recoverActive}
      <form>
        <fieldset>
          <input
            type="text"
            autocomplete="username"
            class:disabled={processing}
            placeholder="Email"
            bind:value={emailRecovery} />
        </fieldset>
        <fieldset>
          {#if !processing}
            <div class="action" on:click={recoverPassword}>
              Send recovery email
            </div>
          {:else}
            <div class="loading">
              <Ellipse />
            </div>
          {/if}
        </fieldset>
      </form>
    {/if}

    <!-- SIGN UP -->
    {#if signUpActive && !recoverActive}
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

          <div class="profile-picture" class:no-image={!avatarImage}>

            {#if avatarImage}
              <img src={avatarImage} class="profile-picture-image" />
            {/if}

            <Dropzone
              dropzoneClass="avatar-dropzone"
              hooveringClass="avatar-dropzone-hover"
              dropzoneEvents={{ addedfile }}
              options={{ clickable: true, acceptedFiles: 'image/*' }}>
              Upload Image
            </Dropzone>

          </div>

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
          <div
            class="action small"
            class:done={bioUpdateDone}
            on:click={updateProfile}>
            {#if bioUpdateDone}Biography updated{:else}Update Biography{/if}
          </div>
        </fieldset>

        <fieldset>
          <div class="danger-zone" />
        </fieldset>

        <fieldset>
          <div class="action small" on:click={logOut}>Sign out</div>
        </fieldset>

        <fieldset>
          <a href="/ygrg/reset-password" class="action small">
            Change password
          </a>
        </fieldset>

        <fieldset>
          <div class="action minor">Delete Account</div>
        </fieldset>

      </form>
    {/if}
  {/if}

</div>
