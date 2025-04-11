<script lang="ts">
  import { fly } from "svelte/transition";
  import apiClient from "$lib/plugins/interceptor";
  import { goto } from "$app/navigation";
  import { galleries } from "$lib/store";
  import { get } from "svelte/store";
  import type { GalleryResponse } from "$lib/types/Gallery";
  import { onMount } from "svelte";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";

  let text = "Welcome to the Gallery";
  let displayedText = "";
  let index = 0;
  let loading = true;
  let error: string | null = null;

  // Typewriter effect logic
  const typeWriter = () => {
    if (index < text.length) {
      displayedText += text[index];
      index++;
      setTimeout(typeWriter, 100); // Adjust speed here
    }
  };

  // Start the typewriter effect when the component is mounted
  typeWriter();

  const getFullUrl = (image: any) => {
    return `https://softgenie.org${image.image}`; // Replace with your base URL
  };

  const goToDetails = (galleryId: number) => {
    // Navigate to the gallery details page
    goto(`/gallery/${galleryId}`);
  };

  onMount(async () => {
    try {
      if (get(galleries).length === 0) {
        const response = await apiClient.get<GalleryResponse>("/gallery-posts");
        galleries.set(response.data.results);
        if (response.data.results.length === 0) {
          error = "No gallery available";
        }
      }
    } catch (err) {
      error = "Failed to load gallery items";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Gallery - SvelteKit Portfolio</title>
  <meta
    name="description"
    content="Explore our stunning gallery showcasing amazing visuals and creative works."
  />
  <meta
    name="keywords"
    content="gallery, portfolio, sveltekit, creative works, visuals"
  />
  <meta name="author" content="Amit Prafulla" />
</svelte:head>

<HeaderComponent title="Gallery" />

<section
  class="relative bg-cover bg-center h-[500px]"
  style="background-image: url('https://artgallery.yale.edu/sites/default/files/styles/hero_large_x2/public/2023-01/ag-doc-2281-0036-pub.jpg?h=147a4df9&itok=KlkCSvfh');"
>
  <div
    class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="text-center text-white">
      <h1
        class="text-4xl md:text-6xl font-bold mb-4"
        in:fly={{ x: -200, duration: 500 }}
      >
        {displayedText}
      </h1>
      <p
        class="text-lg md:text-xl mb-6"
        in:fly={{ x: -200, duration: 500, delay: 200 }}
      >
        Explore my gallery of stunning visuals and creative works. This contains
        collection of pictures of the places I've been to.
      </p>
    </div>
  </div>
</section>

{#if loading}
  <Loader />
{:else if error}
  <p class="text-center text-red-500">{error}</p>
{:else}
  {#each $galleries as gallery}
    <div class="bg-white container mx-auto my-3 p-4 rounded-lg shadow-md">
      <h3 class="text-2xl font-semibold mb-4">{gallery.title}</h3>

      <div class="flex justify-between items-center mb-4">
        {#if gallery.tags.length > 0}
          <ul class="flex lg:w-1/2 flex-wrap gap-2">
            {#each gallery.tags as tag, index}
              <li
                class="bg-dark text-center text-light px-2 py-1 rounded-sm shadow mr-2"
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

      <div class="content">
        {@html gallery.description}
      </div>
      <div
        class="gallery-images grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {#each gallery.images as image}
          <img
            src={getFullUrl(image)}
            alt={image.alt || "Gallery Image"}
            class="w-full h-auto rounded-lg shadow-md"
          />
        {/each}
      </div>
      <div>
        <button
          class="mt-4 px-4 py-2 bg-secondary text-white rounded hover:bg-blue-900"
          on:click={() => goToDetails(gallery.id)}
        >
          View Details
        </button>
      </div>
    </div>
  {/each}
{/if}

<FooterComponent />
