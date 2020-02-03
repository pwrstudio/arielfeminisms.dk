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
  // import * as Cookies from "es-cookie";
  import get from "lodash/get";

  import { auth } from "../identity.js";

  // *** GRAPHICS
  import Ellipse from "../Graphics/Ellipse.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isSubsectionAriel,
    isSubsectionAri,
    loggedInUser
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

  const signIn = () => {
    processing = true;
    msgSignUp = false;
    msgSignIn = false;

    auth
      .login(email, password)
      .then(response => {
        processing = false;
        email = "";
        password = "";
        console.dir(response);
        // Cookies.set(
        //   "ygrgLoggedInUser",
        //   JSON.stringify({
        //     id: response.id,
        //     email: response.email,
        //     name: response.user_metadata.name,
        //     token: response.token.access_token
        //   }),
        //   { expires: 7 }
        // );
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

    console.log(passwordUp);
    auth
      .signup(emailUp, passwordUp, {
        name: nameUp,
        bookmarks: [],
        biography: ""
      })
      .then(response => {
        console.dir(response);
        // RESET
        processing = false;
        signUpActive = false;
        emailUp = "";
        passwordUp = "";
        nameUp = "";
        msgSignIn =
          "Account created. Sign in with your email and password below.";
      })
      .catch(err => {
        processing = false;
        console.dir(err.json.msg);
        msgSignUp = "Account creation failed. " + get(err, "json.msg", "");
      });
  };

  const logOut = () => {
    // const user = auth.currentUser();
    // user
    //   .logout()
    //   .then(response => {
    //     console.log("User logged out");
    //     Cookies.remove("ygrgLoggedInUser");
    //     loggedInUser.email = "";
    //     loggedInUser.name = "";
    //   })
    //   .catch(error => {
    //     console.log("Failed to logout user: %o", error);
    //     throw error;
    //   });
    msgSignUp = false;
    msgSignIn = false;
    // Cookies.remove("ygrgLoggedInUser");
    loggedInUser.set(false);
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

    button {
      display: block;
      float: right;
      background: transparent;
      font-size: $font-size-large;
      border: 0;
      font-family: $font-stack-ariel;
      font-weight: bold;
      margin: 0;
      padding: 0;
      outline: none;

      &:hover {
        font-style: italic;
        cursor: pointer;
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
      font-size: $font-size-large;
      font-family: $font-stack-ariel;
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
      line-height: 200px;
      text-align: center;
      padding: 5px;
      border-radius: 5px;
      background: $brown;
      border: 2px solid white;
      color: white;
      margin-bottom: $line-height;
    }

    .profile-picture-section {
      display: flex;
      justify-content: center;
      width: 75%;
      margin-left: 25%;
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
</style>

<div class="identity">

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
      <fieldset class="sign-in-section">
        {#if !processing}
          <button on:click={signIn}>Sign In</button>
        {:else}
          <div class="loading">
            <Ellipse />
          </div>
        {/if}
      </fieldset>
      {#if !processing}
        <fieldset class="sign-in-section">
          <span
            class="sign-up-link pseudo-link"
            on:click={() => {
              signUpActive = true;
            }}>
            Create account
          </span>
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
      <fieldset>
        {#if !processing}
          <button on:click={signUp}>Sign up</button>
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
        <div class="profile-picture">Upload avatar</div>
      </div>

      <div class="profile-section">
        <label>Name</label>
        <input type="text" value={$loggedInUser.user_metadata.name} />
      </div>

      <div class="profile-section">
        <label>Email</label>
        <input type="text" value={$loggedInUser.email} />
      </div>

      <div class="profile-section">
        <label>Biography</label>
        <textarea />
      </div>

      <fieldset>
        <button class="sign-up-link" on:click={logOut}>LOG OUT</button>
      </fieldset>

    </form>
  {/if}

</div>
