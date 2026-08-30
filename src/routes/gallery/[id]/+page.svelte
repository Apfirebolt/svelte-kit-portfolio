<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import Loader from "$lib/components/Loader.svelte";

  export let data;

  $: gallery = data?.gallery ?? null;

  const BASE_MEDIA_URL = "https://softgenie.org";

  let currentSlide = 0;
  let slideInterval: ReturnType<typeof setInterval> | null = null;

  let modalOpen = false;
  let modalImageUrl = "";
  let modalImageAlt = "";

  // Normalize image URLs to avoid duplicate base URL prepends
  const resolveImageUrl = (imgItem: any): string => {
    if (!imgItem) return "/fallback-placeholder.png";
    const path = typeof imgItem === "string" ? imgItem : imgItem.image || imgItem.url || "";
    if (!path) return "/fallback-placeholder.png";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${BASE_MEDIA_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  function nextSlide() {
    if (gallery?.images && gallery.images.length > 0) {
      currentSlide = (currentSlide + 1) % gallery.images.length;
    }
  }

  function prevSlide() {
    if (gallery?.images && gallery.images.length > 0) {
      currentSlide = (currentSlide - 1 + gallery.images.length) % gallery.images.length;
    }
  }

  function setSlide(index: number) {
    currentSlide = index;
    restartCarouselTimer();
  }

  function restartCarouselTimer() {
    if (slideInterval) clearInterval(slideInterval);
    if (gallery?.images && gallery.images.length > 1) {
      slideInterval = setInterval(nextSlide, 5000);
    }
  }

  function openModal(imageUrl: string, imageAlt: string) {
    modalImageUrl = imageUrl;
    modalImageAlt = imageAlt;
    modalOpen = true;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    modalOpen = false;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  function handleWindowKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && modalOpen) {
      closeModal();
    }
  }

  $: if (gallery?.images) {
    restartCarouselTimer();
  }

  onMount(() => {
    restartCarouselTimer();
  });

  onDestroy(() => {
    if (slideInterval) clearInterval(slideInterval);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<svelte:head>
  <title>{gallery?.title ? `${gallery.title} - Gallery` : "Gallery"}</title>
  <meta
    name="description"
    content={gallery?.meta_description || gallery?.description?.slice(0, 150) || "Browse through the visual gallery."}
  />
</svelte:head>

<HeaderComponent title="Gallery" />

{#if !gallery}
  <div class="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-tertiary via-secondary to-dark">
    <Loader />
  </div>
{:else}
  <section class="min-h-screen bg-gradient-to-b from-tertiary via-secondary to-dark py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto space-y-6">
      
      <article class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 p-6 sm:p-10 text-dark">
        
        <!-- Meta Top-bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-200">
          <div class="flex flex-wrap items-center gap-1.5">
            {#if gallery.tags && gallery.tags.length > 0}
              {#each gallery.tags as tag (tag.id || tag.name)}
                <span class="bg-primary/10 text-primary-dark border border-primary/20 text-xs px-3 py-1 rounded-full font-semibold">
                  #{tag.name}
                </span>
              {/each}
            {:else}
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Visual Exhibition</span>
            {/if}
          </div>

          {#if gallery.date_posted}
            <div class="flex items-center gap-2 text-xs font-mono text-gray-500 shrink-0">
              <span class="font-semibold text-primary-dark">Posted on:</span>
              <time>
                {new Date(gallery.date_posted).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </time>
            </div>
          {/if}
        </div>

        <!-- Title -->
        <div class="pt-6 pb-4">
          <h1
            class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-dark leading-tight"
            in:fly={{ y: -15, duration: 400 }}
          >
            {gallery.title}
          </h1>
        </div>

        <!-- Featured Stage (Hero Carousel) -->
        {#if gallery.images && gallery.images.length > 0}
          <div class="my-8">
            <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-dark shadow-xl border border-gray-200 group">
              {#each gallery.images as image, index (image.id || index)}
                {#if index === currentSlide}
                  <button
                    type="button"
                    class="absolute inset-0 w-full h-full flex items-center justify-center p-0 border-none bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    in:fade={{ duration: 350 }}
                    out:fade={{ duration: 350 }}
                    on:click={() => openModal(resolveImageUrl(image), image.caption || image.alt || gallery.title)}
                  >
                    <img
                      src={resolveImageUrl(image)}
                      alt={image.caption || image.alt || gallery.title}
                      class="w-full h-full object-contain pointer-events-none"
                    />
                    <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors flex items-center justify-center">
                      <span class="opacity-0 group-hover:opacity-100 transition-opacity bg-dark/80 text-light text-xs font-semibold px-3 py-1.5 rounded-lg shadow">
                        Click to Expand ↗
                      </span>
                    </div>
                  </button>
                {/if}
              {/each}

              <!-- Arrow Navigation -->
              {#if gallery.images.length > 1}
                <button
                  type="button"
                  aria-label="Previous Slide"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark/70 hover:bg-dark text-light flex items-center justify-center transition shadow focus:outline-none"
                  on:click|stopPropagation={prevSlide}
                >
                  &#10094;
                </button>
                <button
                  type="button"
                  aria-label="Next Slide"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark/70 hover:bg-dark text-light flex items-center justify-center transition shadow focus:outline-none"
                  on:click|stopPropagation={nextSlide}
                >
                  &#10095;
                </button>
              {/if}
            </div>

            <!-- Slide Indicators -->
            {#if gallery.images.length > 1}
              <div class="flex justify-center gap-2 mt-3">
                {#each gallery.images as _, idx}
                  <button
                    type="button"
                    class="h-1.5 rounded-full transition-all {idx === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-gray-300'}"
                    on:click={() => setSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                {/each}
              </div>
            {/if}
          </div>
        {/if}

        <!-- Gallery Description -->
        {#if gallery.description}
          <div class="my-8 pt-4 border-t border-gray-200">
            <div class="prose prose-slate max-w-none text-base leading-relaxed text-gray-800">
              {@html gallery.description}
            </div>
          </div>
        {/if}

        <!-- Gallery Thumbnails Grid -->
        {#if gallery.images && gallery.images.length > 1}
          <div class="my-8 pt-6 border-t border-gray-200">
            <h2 class="text-base font-bold text-dark mb-4">All Gallery Visuals</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {#each gallery.images as image, index (image.id || index)}
                <button
                  type="button"
                  class="group relative aspect-video rounded-xl overflow-hidden border-2 transition-all focus:outline-none {index === currentSlide ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-400'}"
                  on:click={() => openModal(resolveImageUrl(image), image.caption || image.alt || gallery.title)}
                >
                  <img
                    src={resolveImageUrl(image)}
                    alt={image.caption || image.alt || `Gallery visual ${index + 1}`}
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors" />
                </button>
              {/each}
            </div>
          </div>
        {/if}

      </article>
    </div>
  </section>
{/if}

<!-- Lightbox Modal -->
{#if modalOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-label="Image Lightbox"
    tabindex="-1"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
  >
    <button
      type="button"
      class="fixed inset-0 w-full h-full bg-transparent border-none cursor-default focus:outline-none"
      aria-label="Close modal background"
      tabindex="-1"
      on:click={closeModal}
    />

    <div
      class="relative z-10 max-w-5xl max-h-[90vh] flex flex-col items-center pointer-events-auto"
      in:fly={{ y: 20, duration: 250 }}
    >
      <button
        type="button"
        aria-label="Close Lightbox"
        class="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition focus:outline-none text-2xl font-bold"
        on:click={closeModal}
      >
        &times;
      </button>

      <img
        src={modalImageUrl}
        alt={modalImageAlt}
        class="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/20 bg-dark"
      />

      {#if modalImageAlt}
        <p class="mt-3 text-xs font-mono text-light/80 text-center">
          {modalImageAlt}
        </p>
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(.prose p) {
    margin-bottom: 1.25rem;
  }
  :global(.prose h2, .prose h3) {
    color: inherit;
    font-weight: 700;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
  }
</style>