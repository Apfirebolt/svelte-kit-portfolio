<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import { goto } from "$app/navigation";
  import apiClient from "$lib/plugins/interceptor";
  import { galleries } from "$lib/store";
  import type { GalleryResponse, Gallery } from "$lib/types/Gallery";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Icon from "@iconify/svelte";

  const BASE_MEDIA_URL = "https://softgenie.org";

  const headline = "Welcome to the Gallery";
  let displayedText = "";
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  let loading = true;
  let error: string | null = null;
  let selectedTag: string = "all";
  let searchQuery: string = "";

  const runTypewriter = () => {
    let index = 0;
    const tick = () => {
      if (index < headline.length) {
        displayedText = headline.slice(0, index + 1);
        index++;
        typeTimer = setTimeout(tick, 75);
      }
    };
    tick();
  };

  /**
   * Safe URL resolver that prevents double domain prefixing
   */
  const resolveImageUrl = (imgItem: any): string => {
    if (!imgItem) return "/fallback-placeholder.png";
    const path = typeof imgItem === "string" ? imgItem : imgItem.image || imgItem.url || "";
    if (!path) return "/fallback-placeholder.png";

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${BASE_MEDIA_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const goToDetails = (galleryId: number | string) => {
    goto(`/gallery/${galleryId}`);
  };

  // Derive unique tags across all fetched gallery items
  $: allTags = Array.from(
    new Set(
      $galleries.flatMap((g) =>
        g.tags ? g.tags.map((t: any) => (typeof t === "string" ? t : t.name)) : []
      )
    )
  ).filter(Boolean);

  // Filtered gallery items
  $: filteredGalleries = $galleries.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedTag === "all") return matchesSearch;

    const itemTags = item.tags
      ? item.tags.map((t: any) => (typeof t === "string" ? t : t.name))
      : [];
    return matchesSearch && itemTags.includes(selectedTag);
  });

  onMount(async () => {
    runTypewriter();

    try {
      if ($galleries.length === 0) {
        const response = await apiClient.get<GalleryResponse>("/gallery-posts");
        const results = response.data?.results || (response.data as unknown as Gallery[]) || [];
        galleries.set(results);
      }

      if ($galleries.length === 0) {
        error = "No gallery posts available.";
      }
    } catch (err: any) {
      error = err?.response?.data?.detail || "Failed to load gallery items.";
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    if (typeTimer) clearTimeout(typeTimer);
  });
</script>

<svelte:head>
  <title>Gallery - SvelteKit Portfolio</title>
  <meta
    name="description"
    content="Explore our stunning gallery showcasing visual travels, architecture, and creative photography."
  />
  <meta
    name="keywords"
    content="gallery, portfolio, photography, travel, visuals, sveltekit"
  />
  <meta name="author" content="Amit Prafulla" />
</svelte:head>

<div class="min-h-screen bg-bg text-text flex flex-col selection:bg-primary selection:text-bg">
  <HeaderComponent title="Gallery" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[440px] flex items-center justify-center overflow-hidden border-b border-primary/20"
    style="background-image: url('https://artgallery.yale.edu/sites/default/files/styles/hero_large_x2/public/2023-01/ag-doc-2281-0036-pub.jpg?h=147a4df9&itok=KlkCSvfh');"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/75 to-bg/95 pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 text-text space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface/80 text-text border border-primary/25 backdrop-blur-md shadow-sm">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Visual Records & Travel Diaries
      </div>

      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary min-h-[2.5rem] sm:min-h-[4rem]"
        in:fly={{ y: 25, duration: 400 }}
      >
        {displayedText}
      </h1>

      <p
        class="text-sm sm:text-base lg:text-lg text-text opacity-90 max-w-2xl mx-auto leading-relaxed"
        in:fly={{ y: 25, duration: 400, delay: 150 }}
      >
        Explore curated collections of photography, heritage architecture, and memorable journeys across India and beyond.
      </p>

      <!-- Search Input -->
      <div class="pt-2 max-w-md mx-auto">
        <div class="relative">
          <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search exhibitions, locations..."
            class="w-full bg-surface text-text placeholder:text-muted rounded-2xl px-4 py-3 pl-11 text-xs sm:text-sm border border-primary/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-md"
          />
          <Icon icon="mdi:magnify" class="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  </section>

  <!-- Tag Filter Ribbon -->
  {#if allTags.length > 0}
    <div class="bg-surface/90 border-b border-primary/20 sticky top-16 z-20 backdrop-blur-md shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer {selectedTag === 'all'
            ? 'bg-primary text-bg shadow-md shadow-primary/25'
            : 'bg-tertiary/40 text-text hover:bg-primary/15 border border-primary/10'}"
          on:click={() => (selectedTag = "all")}
        >
          All ({$galleries.length})
        </button>

        {#each allTags as tag}
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer {selectedTag === tag
              ? 'bg-primary text-bg shadow-md shadow-primary/25'
              : 'bg-tertiary/40 text-text hover:bg-primary/15 border border-primary/10'}"
            on:click={() => (selectedTag = tag)}
          >
            #{tag}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Main Feed -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex items-center justify-center py-24">
        <Loader />
      </div>
    {:else if error}
      <div class="p-8 text-center bg-surface border border-rose-500/30 rounded-3xl shadow-lg max-w-lg mx-auto backdrop-blur-md">
        <Icon icon="mdi:alert-circle-outline" class="text-4xl text-rose-500 mx-auto mb-3" />
        <p class="text-sm font-semibold text-rose-500">{error}</p>
      </div>
    {:else if filteredGalleries.length === 0}
      <div class="text-center py-16 bg-surface border border-primary/20 rounded-3xl shadow-lg max-w-lg mx-auto p-8 backdrop-blur-md space-y-3">
        <Icon icon="mdi:image-off-outline" class="text-4xl text-muted mx-auto" />
        <p class="text-base font-bold text-text">No gallery entries match your criteria</p>
        <p class="text-xs text-muted">Try resetting your search query or tag selection.</p>
        <button
          type="button"
          class="mt-2 px-5 py-2.5 bg-primary text-bg text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer"
          on:click={() => {
            searchQuery = "";
            selectedTag = "all";
          }}
        >
          Reset Filters
        </button>
      </div>
    {:else}
      <div class="space-y-8">
        {#each filteredGalleries as gallery (gallery.id)}
          <article
            class="bg-surface border border-primary/20 hover:border-primary/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-md group"
            in:fly={{ y: 20, duration: 300 }}
          >
            <div>
              <!-- Header Row -->
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-primary/15 pb-4 mb-5">
                <h2 class="text-xl sm:text-2xl font-bold text-text tracking-tight group-hover:text-primary transition-colors">
                  <a href="/gallery/{gallery.id}">
                    {gallery.title}
                  </a>
                </h2>

                {#if gallery.date_posted}
                  <time class="text-xs font-mono text-muted shrink-0 flex items-center gap-1.5">
                    <Icon icon="mdi:calendar-outline" class="text-sm" />
                    {new Date(gallery.date_posted).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </time>
                {/if}
              </div>

              <!-- Tags -->
              {#if gallery.tags && gallery.tags.length > 0}
                <div class="flex flex-wrap gap-2 mb-5">
                  {#each gallery.tags as tag (tag.id || tag.name)}
                    <span class="bg-primary/10 text-primary border border-primary/25 text-xs px-3 py-1 rounded-full font-semibold">
                      #{typeof tag === "string" ? tag : tag.name}
                    </span>
                  {/each}
                </div>
              {/if}

              <!-- Description -->
              {#if gallery.description}
                <div class="prose prose-invert max-w-none text-xs sm:text-sm text-text opacity-90 leading-relaxed mb-6">
                  {@html gallery.description}
                </div>
              {/if}

              <!-- Images Preview Grid -->
              {#if gallery.images && gallery.images.length > 0}
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {#each gallery.images.slice(0, 3) as image, imgIdx (image.id || imgIdx)}
                    <figure class="rounded-2xl overflow-hidden border border-primary/20 bg-bg aspect-video group/img relative shadow-sm">
                      <img
                        src={resolveImageUrl(image)}
                        alt={image.caption || image.alt || `${gallery.title} snapshot ${imgIdx + 1}`}
                        loading="lazy"
                        class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                    </figure>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Action Button -->
            <div class="pt-5 border-t border-primary/15 flex items-center justify-between">
              <span class="text-xs text-muted font-mono flex items-center gap-1.5">
                <Icon icon="mdi:camera-outline" class="text-base" />
                {gallery.images?.length || 0} Photos
              </span>

              <button
                type="button"
                class="px-5 py-2.5 bg-secondary text-bg font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transform hover:-translate-y-0.5"
                on:click={() => goToDetails(gallery.id)}
              >
                <span>View Full Gallery</span>
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
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>