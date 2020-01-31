<script>
  // # # # # # # # # # # # # #
  //
  //  Ellipse animation
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";

  // *** VARIABLES
  let text = ".";
  let timer = {};

  // *** ON MOUNT
  onMount(async () => {
    timer = setInterval(() => {
      text.length < 5 ? (text += ".") : (text = ".");
    }, 200);
  });

  // *** ON DESTROY
  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<span>{text}</span>
