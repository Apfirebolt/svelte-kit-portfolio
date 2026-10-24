<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Icon from "@iconify/svelte";
  import type { Project } from "$lib/types/Project";

  export let data: { project: Project | null };

  $: project = data.project;

  const BASE_MEDIA_URL = "https://softgenie.org";

  let displayedTitle = "";
  let lastLoadedProjectId: number | string | null = null;
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  let currentSlide = 0;
  let slideInterval: ReturnType<typeof setInterval> | null = null;

  let modalOpen = false;
  let modalImageUrl = "";
  let modalImageAlt = "";

  // Normalize image URLs to prevent duplicate prefixes
  const resolveImageUrl = (imgItem: any): string => {
    if (!imgItem) return "/fallback-placeholder.png";
    const path = typeof imgItem === "string" ? imgItem : imgItem.image || imgItem.url || "";
    if (!path) return "/fallback-placeholder.png";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${BASE_MEDIA_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Typewriter effect with state protection to prevent infinite reset loops
  const startTypewriter = (text: string) => {
    if (typeTimer) clearTimeout(typeTimer);
    displayedTitle = "";
    let i = 0;

    const tick = () => {
      if (i < text.length) {
        displayedTitle = text.slice(0, i + 1);
        i++;
        typeTimer = setTimeout(tick, 60);
      }
    };

    tick();
  };

  function nextSlide() {
    if (project?.images && project.images.length > 0) {
      currentSlide = (currentSlide + 1) % project.images.length;
    }
  }

  function prevSlide() {
    if (project?.images && project.images.length > 0) {
      currentSlide = (currentSlide - 1 + project.images.length) % project.images.length;
    }
  }

  function setSlide(index: number) {
    currentSlide = index;
    restartCarouselTimer();
  }

  function restartCarouselTimer() {
    if (slideInterval) clearInterval(slideInterval);
    if (project?.images && project.images.length > 1) {
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

  // Reactive trigger guarded against internal state updates
  $: if (project && project.id !== lastLoadedProjectId) {
    lastLoadedProjectId = project.id;
    startTypewriter(project.title || "");
    restartCarouselTimer();
  }

  onMount(() => {
    restartCarouselTimer();
  });

  onDestroy(() => {
    if (typeTimer) clearTimeout(typeTimer);
    if (slideInterval) clearInterval(slideInterval);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<svelte:head>
  <title>{project ? `${project.title} - Project Details` : "Loading Project..."}</title>
  <meta
    name="description"
    content={project?.meta_description || "Project specifications, gallery, and architecture details."}
  />
</svelte:head>

<div class="min-h-screen bg-bg text-text flex flex-col selection:bg-primary selection:text-bg">
  <HeaderComponent title="Project Details" />

  {#if !project}
    <div class="min-h-[60vh] flex items-center justify-center">
      <Loader />
    </div>
  {:else}
    <section class="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto space-y-6">
        
        <article class="bg-surface border border-primary/20 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-md">
          
          <!-- Meta Top-bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-primary/15">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
                <span class="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Production Showcase
              </span>
            </div>

            <div class="flex items-center gap-2 text-xs font-mono text-muted">
              <Icon icon="mdi:calendar-outline" class="text-sm" />
              <time>
                {new Date(project.date_posted).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </time>
            </div>
          </div>

          <!-- Project Title -->
          <div class="pt-6 pb-4">
            <h1
              class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary min-h-[2.5rem] sm:min-h-[4rem]"
              in:fly={{ y: -15, duration: 400 }}
            >
              {displayedTitle}
            </h1>
          </div>

          <!-- Tech Stack, Repo & Tags -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-5 rounded-2xl bg-tertiary/40 border border-primary/20 backdrop-blur-sm">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                Technology Stack
              </span>
              <div class="flex flex-wrap gap-1.5">
                {#each project.technology.split(",") as tech}
                  <span class="bg-surface text-text border border-primary/20 text-xs font-semibold px-3 py-1 rounded-xl shadow-2xs">
                    {tech.trim()}
                  </span>
                {/each}
              </div>
            </div>

            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                Repository & Deployment
              </span>
              {#if project.project_link}
                <a
                  href={project.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors"
                >
                  <Icon icon="mdi:github" class="text-base" />
                  <span class="truncate max-w-[240px]">{project.project_link}</span>
                  <Icon icon="mdi:open-in-new" class="text-xs" />
                </a>
              {:else}
                <span class="text-xs text-muted italic">No external link provided</span>
              {/if}
            </div>

            {#if project.tags && project.tags.length > 0}
              <div class="md:col-span-2 pt-4 border-t border-primary/15">
                <span class="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                  Categories & Tags
                </span>
                <div class="flex flex-wrap gap-1.5">
                  {#each project.tags as tag (tag.id || tag.name)}
                    <span class="bg-primary/10 text-primary border border-primary/25 text-xs px-3 py-1 rounded-full font-semibold">
                      #{tag.name}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Hero Carousel Stage -->
          {#if project.images && project.images.length > 0}
            <div class="my-8">
              <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-bg shadow-xl border border-primary/20 group">
                {#each project.images as image, index (image.id || index)}
                  {#if index === currentSlide}
                    <button
                      type="button"
                      class="absolute inset-0 w-full h-full flex items-center justify-center p-0 border-none bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                      in:fade={{ duration: 350 }}
                      out:fade={{ duration: 350 }}
                      on:click={() => openModal(resolveImageUrl(image), image.alt || project.title)}
                    >
                      <img
                        src={resolveImageUrl(image)}
                        alt={image.alt || project.title}
                        class="w-full h-full object-contain pointer-events-none"
                      />
                      <div class="absolute inset-0 bg-bg/0 group-hover:bg-bg/20 transition-colors flex items-center justify-center">
                        <span class="opacity-0 group-hover:opacity-100 transition-opacity bg-surface text-text text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg border border-primary/20 flex items-center gap-1">
                          <span>Click to Expand</span>
                          <Icon icon="mdi:open-in-new" class="text-sm" />
                        </span>
                      </div>
                    </button>
                  {/if}
                {/each}

                <!-- Carousel Arrow Controls -->
                {#if project.images.length > 1}
                  <button
                    type="button"
                    aria-label="Previous Slide"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-surface/80 hover:bg-surface text-text border border-primary/20 flex items-center justify-center transition shadow-md focus:outline-none cursor-pointer backdrop-blur-md"
                    on:click|stopPropagation={prevSlide}
                  >
                    <Icon icon="mdi:chevron-left" class="text-xl" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next Slide"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-surface/80 hover:bg-surface text-text border border-primary/20 flex items-center justify-center transition shadow-md focus:outline-none cursor-pointer backdrop-blur-md"
                    on:click|stopPropagation={nextSlide}
                  >
                    <Icon icon="mdi:chevron-right" class="text-xl" />
                  </button>
                {/if}
              </div>

              <!-- Slide Indicators -->
              {#if project.images.length > 1}
                <div class="flex justify-center gap-2 mt-4">
                  {#each project.images as _, idx}
                    <button
                      type="button"
                      class="h-2 rounded-full transition-all cursor-pointer {idx === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-tertiary'}"
                      on:click={() => setSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Description & Documentation -->
          <div class="my-8 pt-6 border-t border-primary/15">
            <h2 class="text-base font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
              <Icon icon="mdi:file-document-outline" class="text-base" />
              Project Overview & Documentation
            </h2>
            <div class="prose prose-invert max-w-none text-base leading-relaxed text-text opacity-95">
              {@html project.description}
            </div>
          </div>

          <!-- Thumbnail Gallery Grid -->
          {#if project.images && project.images.length > 0}
            <div class="my-8 pt-6 border-t border-primary/15">
              <h2 class="text-base font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                <Icon icon="mdi:image-multiple-outline" class="text-base" />
                Project Visuals & Snapshots
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {#each project.images as image, index (image.id || index)}
                  <button
                    type="button"
                    class="group relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer {index === currentSlide ? 'border-primary ring-2 ring-primary/30' : 'border-primary/20 hover:border-primary/50'}"
                    on:click={() => openModal(resolveImageUrl(image), image.alt || project.title)}
                  >
                    <img
                      src={resolveImageUrl(image)}
                      alt={image.alt || `Preview thumbnail ${index + 1}`}
                      loading="lazy"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div class="absolute inset-0 bg-bg/0 group-hover:bg-bg/20 transition-colors" />
                  </button>
                {/each}
              </div>
            </div>
          {/if}

        </article>
      </div>
    </section>
  {/if}

  <FooterComponent />
</div>

<!-- Fullscreen Lightbox Modal -->
{#if modalOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/90 backdrop-blur-md"
    role="dialog"
    aria-modal="true"
    aria-label="Image Preview Lightbox"
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
        class="absolute -top-12 right-0 p-2 text-text hover:text-primary transition focus:outline-none text-2xl font-bold cursor-pointer"
        on:click={closeModal}
      >
        <Icon icon="mdi:close" class="text-2xl" />
      </button>

      <img
        src={modalImageUrl}
        alt={modalImageAlt}
        class="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-primary/30 bg-bg"
      />

      {#if modalImageAlt}
        <p class="mt-3 text-xs font-mono text-muted text-center">
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