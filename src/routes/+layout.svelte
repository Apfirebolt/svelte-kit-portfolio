<script lang="ts">
  import AOS from "aos";
  import "aos/dist/aos.css";
  import { onMount } from "svelte";
  import "../app.css";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import { on } from "svelte/events";

  let { children } = $props();

  onMount(() => {
    // Initialize AOS
    AOS.init({
      // You can also include settings here
      duration: 1000,
      easing: "ease-in-out",
      once: true, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
    });
  });
</script>

<div class="bg-secondary">
  {@render children()}
</div>
