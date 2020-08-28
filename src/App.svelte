<script>
  // # # # # # # # # # # # # # # #
  //
  //  arielfeminisms.dk
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { Router, Route, links, navigate } from "svelte-routing";
  import { fade } from "svelte/transition";
  import MediaQuery from "svelte-media-query";
  import * as Cookies from "es-cookie";

  // *** COMPONENTS
  import ArielNavigation from "./Components/ArielNavigation.svelte";
  import YGRGNavigation from "./Components/YGRGNavigation.svelte";
  import TopBar from "./Components/TopBar.svelte";
  import MalwareEngine from "./Components/MalwareEngine.svelte";

  // *** GLOBALS
  import { auth } from "./global.js";

  // *** STORES
  import {
    isYGRG,
    isAriel,
    isAri,
    isText,
    loggedInUser,
    userLoaded,
    malwareActive
  } from "./stores.js";

  // ** VIEWS
  import MainView from "./Views/MainView.svelte";
  import TextView from "./Views/TextView.svelte";
  import ResetPassword from "./Views/ResetPassword.svelte";
  import MailingListSignUp from "./Views/MailingListSignUp.svelte";

  const userCookie = Cookies.get("ygrgLoggedInUser");

  if (window.location.hash) {
    // CONFIRMATION
    if (window.location.hash.includes("confirmation_token")) {
      const confirmationToken = window.location.hash.substring(20);

      auth
        .confirm(confirmationToken)
        .then(response => {
          console.log("Email code confirmed:", JSON.stringify({ response }));
          navigate("/ygrg/profile/");
        })
        .catch(err => {
          Sentry.captureException(err);
        });
    }

    // RECOVERY
    if (window.location.hash.includes("recovery_token")) {
      const recoveryToken = window.location.hash.substring(16);

      auth
        .recover(recoveryToken)
        .then(response => {
          console.log("Logged in as %s", JSON.stringify({ response }));
          loggedInUser.set(auth.currentUser());
          console.dir(auth.currentUser());
          userLoaded.set(true);
          navigate("/ygrg/reset-password/");
        })
        .catch(err => Sentry.captureException(err));
    }
  }

  if (userCookie) {
    const userCookieObject = JSON.parse(userCookie);
    auth
      .login(userCookieObject.email, userCookieObject.password)
      .then(response => {
        // HACK
        loggedInUser.set(auth.currentUser());
        userLoaded.set(true);
      })
      .catch(err => {
        userLoaded.set(true);
        Sentry.captureException(err);
      });
  } else {
    userLoaded.set(true);
  }
</script>

<style lang="scss" global>
  @import "./variables.scss";

  body,
  html {
    background: $grey;
    margin: 0;
    padding: 0;
    color: $black;
    font-family: $font-stack-ariel;
  }

  a {
    color: $black;
    text-decoration: none;

    &:hover {
      color: $black;
      text-decoration: none;
    }
    &:visited {
      color: $black;
    }
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.2);
  }

  ::selection {
    background: $accent-grey;
  }

  ::-moz-selection {
    background: $accent-grey;
  }

  .slideshow {
    width: 100%;
    height: 100%;
  }

  .slideshow__slide {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin-right: 20px;

    iframe {
      max-width: 90%;
      max-height: 90%;
      margin-left: 5%;
    }
  }

  .slideshow__slide-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .flickity-enabled {
    position: relative;
  }

  .flickity-enabled:focus {
    outline: none;
  }

  .flickity-viewport {
    overflow: hidden;
    position: relative;
    height: 100%;
  }

  .flickity-slider {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  /* draggable */

  .flickity-enabled.is-draggable {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .flickity-enabled.is-draggable .flickity-viewport {
    cursor: move;
    cursor: -webkit-grab;
    cursor: grab;
  }

  .flickity-enabled.is-draggable .flickity-viewport.is-pointer-down {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

  /* ---- flickity-button ---- */

  .flickity-button {
    position: absolute;
    border: none;
    color: $black;
    background: $grey;
  }

  .flickity-button:hover {
    cursor: pointer;
  }

  .flickity-button:focus {
    outline: none;
    box-shadow: 0 0 0 5px #19f;
  }

  .flickity-button:active {
    opacity: 0.6;
  }

  .flickity-button:disabled {
    opacity: 0.3;
    cursor: auto;
    /* prevent disabled button from capturing pointer up event. #716 */
    pointer-events: none;
  }

  .flickity-button-icon {
    fill: currentColor;
  }

  /* ---- previous/next buttons ---- */

  .flickity-prev-next-button {
    bottom: -30px;
    width: 20px;
    height: 20px;
  }

  .flickity-prev-next-button.previous {
    left: 0px;

    @include screen-size("small") {
      left: 20px;
    }
  }
  .flickity-prev-next-button.next {
    right: 0px;

    @include screen-size("small") {
      right: 20px;
    }
  }
  /* right to left */
  .flickity-rtl .flickity-prev-next-button.previous {
    left: auto;
    right: 10px;
  }
  .flickity-rtl .flickity-prev-next-button.next {
    right: auto;
    left: 10px;
  }

  .flickity-prev-next-button .flickity-button-icon {
    position: absolute;
    left: 20%;
    top: 20%;
    width: 60%;
    height: 60%;
  }

  /* ---- page dots ---- */

  .flickity-page-dots {
    position: absolute;
    width: calc(100% - 40px);
    bottom: -25px;
    left: 20px;
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center;
    line-height: 1;

    @include screen-size("small") {
      width: calc(100% - 80px);
      left: 40px;
    }
  }

  .flickity-rtl .flickity-page-dots {
    direction: rtl;
  }

  .flickity-page-dots .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin: 0 6px;
    background: $black;
    border-radius: 50%;
    opacity: 0.25;
    cursor: pointer;
  }

  .flickity-page-dots .dot.is-selected {
    opacity: 1;
  }

  .pseudo-link {
    cursor: pointer;
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom: 2px solid $black;
    }
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .title {
    p {
      margin: 0;
    }
  }

  p {
    margin-top: $line-height;
    margin-bottom: $line-height;
  }

  .about {
    .bottom-text {
      p {
        margin: 0;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }

  .avatar-dropzone {
    font-size: $font-size-medium;
    outline: none;
    text-align: center;
    padding: 5px;
    color: black;
    margin-bottom: $line-height;
    position: absolute;
    top: 5px;
    left: 5px;
    width: 135px;
    height: 135px;
    line-height: 130px;

    opacity: 0;

    @include screen-size("small") {
      display: none;
    }
  }

  .avatar-dropzone-hover {
    transition: background 0.5s $easing;
    background: white;
    color: black;
    opacity: 1;
  }

  .profile-picture {
    font-size: $font-size-medium;
    width: 150px;
    outline: none;
    line-height: $line-height;
    height: 150px;
    // line-height: 200px;
    text-align: center;
    padding: 5px;
    border-radius: 5px;
    border: 2px solid white;
    color: white;
    margin-bottom: $line-height;
    position: relative;

    img {
      position: absolute;
      top: 5px;
      left: 5px;
      width: 135px;
      height: 135px;
      object-fit: cover;
    }

    &:hover,
    &.no-image {
      img {
        opacity: 0.15;
        filter: grayscale(1);
      }

      .avatar-dropzone {
        opacity: 1;
      }
    }
  }

  .text {
    a {
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }

    figure {
      margin: 0;

      img {
        max-width: 100%;
      }
    }
  }

  .listing {
    .text {
      a {
        text-decoration: none;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  .solo {
    .flickity-page-dots {
      opacity: 0;
    }

    .flickity-button {
      opacity: 0;
    }
  }

  main {
    transition: opacity 0.2s ease-out;
    &.blurred {
      opacity: 0.2;
      pointer-events: none;
    }
  }

  .malware-box {
    .text {
      .big {
        font-size: 2em;
        line-height: 0.8em;
      }
    }
  }

  .strike {
    display: inline-block;
    border-bottom: 7px solid black;
    height: 22px;
  }
</style>

<main class:blurred={$malwareActive}>

  <Router>
    <!-- ARIEL -->
    <Route path="/" component={MainView} title="ariel" />
    <Route path="/ariel" component={MainView} title="ariel" />
    <Route
      path="/ariel/program"
      component={MainView}
      title="ariel"
      listing={true} />
    <Route
      path="/ariel/program/:slug"
      component={MainView}
      title="ariel"
      single={true} />
    <Route
      path="/ariel/mailinglist"
      component={MailingListSignUp}
      title="ariel" />

    <!-- ARI -->
    <Route path="/ari" component={MainView} title="ari" />
    <Route path="/ari/:slug" component={MainView} title="ari" single={true} />
    <Route
      path="/ari/readings"
      component={MainView}
      title="ari"
      listing={true} />
    <Route
      path="/ari/readings/:slug"
      component={MainView}
      title="ari"
      single={true} />

    <!-- YGRG -->
    <Route path="/ygrg" component={MainView} title="ygrg" />
    <Route
      path="/ygrg/reset-password"
      component={ResetPassword}
      title="reset" />
    <Route
      path="/ygrg/profile"
      component={MainView}
      title="ygrg"
      profile={true} />
    <Route
      path="/ygrg/events"
      component={MainView}
      title="ygrg"
      listing={true} />
    <Route
      path="/ygrg/events/:slug"
      component={MainView}
      title="ygrg"
      single={true} />
    <Route path="/ygrg/texts/:slug" component={TextView} />
    <Route
      path="/ygrg/mailinglist"
      component={MailingListSignUp}
      title="ygrg" />

    <!-- FALLBACK -->
    <Route component={MainView} title="ariel" />
  </Router>

  <MediaQuery query="(max-width: 800px)" let:matches>
    {#if matches}
      <TopBar />
    {/if}
  </MediaQuery>

  {#if $isYGRG && !$isText}
    <ArielNavigation />
  {/if}

  {#if ($isAriel || $isAri) && !$isText}
    <YGRGNavigation />
  {/if}

</main>

{#if $malwareActive}
  <MalwareEngine />
{/if}
