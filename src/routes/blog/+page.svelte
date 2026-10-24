<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { goto } from "$app/navigation";
  import apiClient from "$lib/plugins/interceptor";
  import { blogs as posts } from "$lib/store";
  import { get } from "svelte/store";
  import type { Blog, BlogResponse } from "$lib/types/Blog";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Icon from "@iconify/svelte";

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
      setTimeout(typeWriter, 100);
    }
  };

  typeWriter();

  const goToDetails = (postId: number) => {
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
  <meta name="description" content="Explore our blog covering technology, programming, and personal experiences." />
  <meta name="keywords" content="blog, portfolio, sveltekit, tech insights, programming" />
  <meta name="author" content="Amit Prafulla" />
</svelte:head>

<div class="min-h-screen bg-bg text-text flex flex-col selection:bg-primary selection:text-bg">
  <HeaderComponent title="Blog" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[440px] flex items-center justify-center overflow-hidden border-b border-primary/20"
    style="background-image: url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D');"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/75 to-bg/95 pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface/80 text-text border border-primary/25 backdrop-blur-md shadow-sm">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Technical Insights & Reflections
      </div>

      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary min-h-[2.5rem] sm:min-h-[4rem]"
        in:fly={{ y: -20, duration: 400 }}
      >
        {displayedText}
      </h1>

      <p
        class="text-sm sm:text-base lg:text-lg text-text opacity-90 max-w-2xl mx-auto leading-relaxed"
        in:fly={{ y: 20, duration: 400, delay: 150 }}
      >
        Welcome to the blog section. I write about various topics including technology, programming, and personal experiences. Join me on this journey of exploration and discovery as I share my thoughts and insights.
      </p>
    </div>
  </section>

  <!-- Main Feed -->
  <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex items-center justify-center py-24">
        <Loader />
      </div>
    {:else if error}
      <div class="p-8 text-center bg-surface border border-rose-500/30 rounded-3xl shadow-lg max-w-lg mx-auto backdrop-blur-md">
        <Icon icon="mdi:alert-circle-outline" class="text-4xl text-rose-500 mx-auto mb-3" />
        <p class="text-sm font-semibold text-rose-500">{error}</p>
      </div>
    {:else}
      <div class="space-y-8">
        {#each $posts as post (post.id)}
          <article
            class="bg-surface border border-primary/20 hover:border-primary/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-md group"
            in:fly={{ y: 20, duration: 300 }}
          >
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-text tracking-tight group-hover:text-primary transition-colors mb-4">
                <a href="/blog/{post.id}">
                  {post.title}
                </a>
              </h2>

              <div class="prose prose-invert max-w-none text-xs sm:text-sm text-text opacity-90 line-clamp-3 leading-relaxed mb-6">
                {@html post.content}
              </div>
            </div>

            <div class="pt-5 border-t border-primary/15 flex items-center justify-between">
              <span class="text-xs text-muted font-mono flex items-center gap-1.5">
                <Icon icon="mdi:book-open-page-variant-outline" class="text-base" />
                Article
              </span>

              <button
                type="button"
                on:click={() => goToDetails(post.id)}
                class="px-5 py-2.5 bg-secondary text-bg font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Read More</span>
                <Icon icon="mdi:arrow-right" class="text-sm" />
              </button>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </main>

  <FooterComponent />
</div>

<style>
  :global(.prose img) {
    border-radius: 0.75rem;
  }
</style>