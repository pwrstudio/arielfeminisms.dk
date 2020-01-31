<script>
  // # # # # # # # # # # # # # # #
  //
  //  SIGN IN
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { links } from "svelte-routing";
  import MediaQuery from "svelte-media-query";

  import { auth } from "../identity.js";

  // *** COMPONENTS
  //   import Cross from "../Components/Cross.svelte";
  //   import SlideShow from "../Components/SlideShow.svelte";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isSubsectionAriel,
    isSubsectionAri
  } from "../stores.js";

  console.dir(auth);
  // *** PROPS
  //   export let slug = "";

  // *** VARIABLES
  let email = "";
  let password = "";
  let emailUp = "";
  let passwordUp = "";
  let nameUp = "";
  let status = "xxx";
  const signIn = () => {
    console.dir(email);
    console.dir(password);
    auth
      .login(email, password)
      .then(response => {
        console.dir(response);
      })
      .catch(error => console.dir(error));
  };

  const signUp = () => {
    console.dir(emailUp);
    console.dir(nameUp);
    console.dir(passwordUp);
    auth
      .signup(emailUp, passwordUp, { name: nameUp })
      .then(response => console.log("Confirmation email sent", response))
      .catch(error => console.log("It's an error", error));
  };

  const logOut = () => {
    const user = auth.currentUser();
    user
      .logout()
      .then(response => console.log("User logged out"))
      .catch(error => {
        console.log("Failed to logout user: %o", error);
        throw error;
      });

    status = {};
  };

  const getUserInfo = () => {
    status = auth.currentUser();
    console.dir(status);
  };
</script>

<style lang="scss">
  @import "../variables.scss";

  .sign-in {
    width: 300px;
    height: auto;
    background: yellow;
    position: fixed;
    top: 200px;
    left: 200px;
  }
</style>

<div class="sign-in">
  <div>
    <h2>SIGN-IN</h2>
    <input type="text" placeholder="email" bind:value={email} />
    <input type="text" placeholder="password" bind:value={password} />
    <input type="submit" on:click={signIn} />

  </div>
  <div>
    <h2>SIGN-UP</h2>
    <input type="text" placeholder="name" bind:value={nameUp} />
    <input type="text" placeholder="email" bind:value={emailUp} />
    <input type="text" placeholder="password" bind:value={passwordUp} />
    <input type="submit" on:click={signUp} />
  </div>
  <div>
    <h2>LOG OUT</h2>
    <input type="submit" on:click={logOut} />
  </div>
  <div>
    <h2>GET USER INFO</h2>
    <input type="submit" on:click={getUserInfo} />
    {status.email} :
    {#if status.user_metadata}{status.user_metadata.name}{/if}
  </div>
</div>
