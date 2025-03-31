<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import type { Blog } from "$lib/types/Blog"; // Import as a type

  export let data; // Receive data from the load function in +page.server.ts

  $: blog = data.blog as Blog | null; // Assign data.blog to the blog variable.

  let displayedTitle = "";
  let clientOnly = false; // Flag to indicate if the component is mounted in the client
  let blogTitleIndex = 0;
  let currentSlide = 0;
  let currentTextSlide = 0;
  let modalOpen = false;
  let modalImageUrl = "";
  let modalImageAlt = "";
  let interval;
  let textInterval;

  // Typewriter effect logic for blog title
  const typeWriterBlogTitle = () => {
    if (blog && blogTitleIndex < blog.title.length) {
      displayedTitle += blog.title[blogTitleIndex];
      blogTitleIndex++;
      setTimeout(typeWriterBlogTitle, 100); // Adjust speed here
    }
  };

  // Start the typewriter effect when the blog data is available
  $: if (blog) {
    displayedTitle = ""; // Reset displayed title
    blogTitleIndex = 0; // Reset index
    typeWriterBlogTitle();
  }

  // Set clientOnly to true when the component is mounted on the client
  onMount(() => {
    clientOnly = true;
  });

  const getFullUrl = (image: any) => {
    return `https://softgenie.org${image.image}`; // Replace with your base URL
  };

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
    currentSlide = (currentSlide + 1) % blog.images.length;
  }

  function nextTextSlide() {
    currentTextSlide = (currentTextSlide + 1) % blog.images.length;
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
  <title>{blog ? blog.title : "Loading..."}</title>
  <meta
    name="description"
    content={blog ? `${blog.meta_description}` : "Loading post details..."}
  />
</svelte:head>

<HeaderComponent title="Blog Details" />

{#if !blog}
  <Loader />
{:else}
  <section
    class="bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500 py-4 px-2"
  >
    <div
      class="max-w-2xl text-center mx-auto text-black p-6 rounded-lg bg-opacity-50 bg-white"
    >
      <h1
        class="mb-6 text-5xl font-extrabold tracking-wide md:text-7xl"
        in:fly={{ x: 300, duration: 500 }}
      >
        {displayedTitle}
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-1 my-3">
        {#each blog.images as image, index (image.id)}
          {#if index === currentSlide}
            <img
              src={getFullUrl(image)}
              alt={image.caption}
              class="rounded-lg shadow-lg"
              in:fade={{ duration: 500 }}
              out:fade={{ duration: 500 }}
            />
          {/if}
        {/each}
      </div>

      <div class="content" in:fade={{ duration: 500 }}>
        {#if clientOnly}
          {@html blog.content}
        {/if}
      </div>

      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        {#each blog.images as image, index (image.id)}
          <img
            src={getFullUrl(image)}
            alt={image.caption}
            class="rounded-lg shadow-lg cursor-pointer"
            on:click={() => openModal(getFullUrl(image), image.caption)}
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
