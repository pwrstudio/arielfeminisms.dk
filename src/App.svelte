<script>
  // *** IMPORT
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { Router, Route, links } from "svelte-routing";

  // ** VIEWS
  import ArielView from "./Views/ArielView.svelte";
  import YGRGView from "./Views/YGRGView.svelte";
  import TextView from "./Views/TextView.svelte";
  import Error404 from "./Views/Error404.svelte";
  import SingleView from "./Views/SingleView.svelte";
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
  }
</style>

<Router>
  <Route path="/" component={ArielView} title="ariel" />
  <Route path="/program/:slug" component={SingleView} />

  <Route path="/ari" component={ArielView} title="ari" />
  <!-- <Route path="/ari/reading/:slug" component={readingView} /> -->

  <Route path="/ygrg" component={YGRGView} />
  <Route path="/ygrg/text/:slug" component={TextView} />
  <Route path="/ygrg/event/:slug" component={SingleView} />

  <!-- <Route path="/ygrg/signup" component={signupView} />
    <Route path="/ygrg/signIn" component={signupView} />
    <Route path="/ygrg/profile" component={propfileView} /> -->

  <Route component={Error404} title="404" />
</Router>
