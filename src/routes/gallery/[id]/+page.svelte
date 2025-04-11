<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import Loader from "$lib/components/Loader.svelte";

  export let data; // Receive data from the load function in +page.server.ts

  $: gallery = data.gallery || []; // Assign data.gallery to the gallery variable.

  let clientOnly = false; // Flag to indicate if the component is mounted in the client

  let currentSlide = 0;
  let currentTextSlide = 0;
  let modalOpen = false;
  let modalImageUrl = "";
  let modalImageAlt = "";

  const getFullUrl = (image: any) => {
    return `https://softgenie.org${image.image}`; // Replace with your base URL
  };

  let interval;
  let textInterval;

  onMount(() => {
    clientOnly = true;
    interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    textInterval = setInterval(nextTextSlide, 5000); // Auto-slide text every 5 seconds

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    }; // Cleanup on destroy
  });

  function nextSlide() {
    currentSlide = (currentSlide + 1) % gallery.images.length;
  }

  function nextTextSlide() {
    currentTextSlide = (currentTextSlide + 1) % gallery.images.length;
  }

  function openModal(imageUrl: string, imageAlt: string) {
    modalImageUrl = imageUrl;
    modalImageAlt = imageAlt;
    modalOpen = true;
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  }

  function closeModal() {
    modalOpen = false;
    document.body.style.overflow = ""; // Re-enable scrolling
  }
</script>

<svelte:head>
  <title>{gallery ? "Gallery" : "Loading..."}</title>
  <meta
    name="description"
    content={gallery ? "Browse through the gallery" : "Loading gallery..."}
  />
</svelte:head>

<HeaderComponent title="Gallery" />
{#if !gallery}
  <Loader />
{:else}
  <section
    class="bg-gradient-to-b from-tertiary via-secondary to-dark py-4 px-2"
  >
    <div
      class="md:w-3/4 text-center mx-auto p-6 bg-white rounded-lg bg-opacity-50"
      data-aos="fade-in-left"
    >
      <h1
        class="mb-6 text-5xl font-extrabold tracking-wide md:text-7xl"
        in:fly={{ x: 300, duration: 500 }}
      >
        <span in:fade={{ duration: 500 }}>
          {gallery.title}
        </span>
      </h1>

      <div class="flex justify-between items-center mb-4">
        {#if gallery.tags.length > 0}
          <ul class="flex lg:w-1/2 flex-wrap gap-2">
            {#each gallery.tags as tag, index}
              <li
                class="bg-dark text-center text-light px-4 py-1 rounded-full text-sm shadow mr-2"
              >
                {tag.name}
              </li>
            {/each}
          </ul>
        {/if}
        <p class="w-1/2 text-right">
          <span class="text-primary-dark font-semibold">Posted on:</span>
          {new Date(gallery.date_posted).toLocaleDateString()}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 my-3">
        {#each gallery.images as image, index (image.id)}
          {#if index === currentSlide}
            <img
              src={getFullUrl(image)}
              alt={image.alt}
              class="rounded-lg shadow-lg"
              in:fade={{ duration: 500 }}
              out:fade={{ duration: 500 }}
            />
          {/if}
        {/each}
      </div>

      <div class="content" in:fade={{ duration: 500 }}>
        {#if clientOnly}
          {@html gallery.description}
        {/if}
      </div>

      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        {#each gallery.images as image, index (image.id)}
          <img
            src={getFullUrl(image)}
            alt={image.alt}
            class="rounded-lg shadow-lg cursor-pointer"
            on:click={() => openModal(getFullUrl(image), image.alt)}
          />
        {/each}
      </div>
    </div>
  </section>
{/if}

{#if modalOpen}
  <div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50"
  >
    <div class="relative" in:fade={{ duration: 300 }}>
      <img
        src={modalImageUrl}
        alt={modalImageAlt}
        class="max-w-full max-h-full rounded-lg"
      />
      <button
        class="absolute top-4 right-4 text-primary bg-white px-2 text-6xl"
        on:click={closeModal}
      >
        &times;
      </button>
    </div>
  </div>
{/if}
