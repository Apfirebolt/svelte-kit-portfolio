<script lang="ts">
  import { fly } from "svelte/transition";
  import apiClient from "$lib/plugins/interceptor";
  import { goto } from "$app/navigation";
  import { blogs as posts } from "$lib/store";
  import { get } from "svelte/store";
  import type { Blog, BlogResponse } from "$lib/types/Blog";
  import { onMount } from "svelte";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";

  let text = "Welcome to Blog";
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

  const goToDetails = (postId: number) => {
    // Navigate to the blog details page
    goto(`/blog/${postId}`);
  };

  onMount(async () => {
    try {
      if (get(posts).length === 0) {
        const response = await apiClient.get<BlogResponse>("/blogs");
        posts.set(response.data.results);
        if (response.data.results.length === 0) {
          error = "No posts available";
        }
      }
    } catch (err) {
      error = "Failed to load posts";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Blog - SvelteKit Portfolio</title>
  <meta name="description" content="Explore our blog." />
  <meta
    name="keywords"
    content="gallery, portfolio, sveltekit, creative works, visuals"
  />
  <meta name="author" content="Amit Prafulla" />
</svelte:head>

<HeaderComponent title="Blog" />

<section
  class="relative bg-cover bg-center h-[500px]"
  style="background-image: url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D');"
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
        Welcome to blog section. I write about various topics including technology,
        programming, and personal experiences. Join me on this journey of exploration
        and discovery as I share my thoughts and insights.
      </p>
    </div>
  </div>
</section>

{#if loading}
  <Loader />
{:else if error}
  <p class="text-center text-red-500">{error}</p>
{:else}
  {#each $posts as post}
    <div class="bg-white container mx-auto my-3 p-4 rounded-lg shadow-md">
      <h3 class="text-2xl font-semibold mb-4">{post.title}</h3>
      <div class="content">
        {@html post.content}
      </div>
      <div class="flex justify-between mt-4">
        <button
          on:click={() => goToDetails(post.id)}
          class="bg-secondary text-white px-4 py-2 rounded">Read More</button
        >
      </div>
    </div>
  {/each}
{/if}

<FooterComponent />

<style>
</style>
