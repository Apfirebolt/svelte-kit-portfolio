<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import apiClient from "$lib/plugins/interceptor";
  import { projects } from "$lib/store";
  import type { Project, ProjectResponse } from "$lib/types/Project";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Icon from "@iconify/svelte";

  const BASE_MEDIA_URL = "https://softgenie.org";

  const bannerHeadline = "Welcome to Projects";
  let displayedText = "";
  let typeIndex = 0;
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  let loading = true;
  let error: string | null = null;
  let selectedTag: string = "all";
  let searchQuery: string = "";

  const runTypewriter = () => {
    if (typeIndex < bannerHeadline.length) {
      displayedText += bannerHeadline[typeIndex];
      typeIndex++;
      typeTimer = setTimeout(runTypewriter, 70);
    }
  };

  const resolveImageUrl = (imgItem: any): string => {
    if (!imgItem) return "/fallback-placeholder.png";
    const path = typeof imgItem === "string" ? imgItem : imgItem.image || imgItem.url || "";
    if (!path) return "/fallback-placeholder.png";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${BASE_MEDIA_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const goToDetails = (projectId: number) => {
    goto(`/projects/${projectId}`);
  };

  // Derive unique tags & tech stack options
  $: allTags = Array.from(
    new Set(
      $projects.flatMap((p) => [
        ...(p.tags?.map((t: any) => (typeof t === "string" ? t : t.name)) || []),
        ...(p.technology ? p.technology.split(",").map((t) => t.trim()) : []),
      ])
    )
  ).filter(Boolean);

  // Client-side search and tag filter
  $: filteredProjects = $projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.technology && project.technology.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedTag === "all") return matchesSearch;

    const projectTags = [
      ...(project.tags?.map((t: any) => (typeof t === "string" ? t : t.name)) || []),
      ...(project.technology ? project.technology.split(",").map((t) => t.trim()) : []),
    ];
    return matchesSearch && projectTags.includes(selectedTag);
  });

  onMount(async () => {
    runTypewriter();
    try {
      if ($projects.length === 0) {
        const response = await apiClient.get<ProjectResponse>("/projects");
        const results = response.data?.results || (response.data as unknown as Project[]) || [];
        projects.set(results);
      }
      if ($projects.length === 0) {
        error = "No projects currently available.";
      }
    } catch (err: any) {
      error = err?.response?.data?.detail || "Unable to retrieve projects at this time.";
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    if (typeTimer) clearTimeout(typeTimer);
  });
</script>

<svelte:head>
  <title>Projects - SvelteKit Portfolio</title>
  <meta name="description" content="Explore our collection of projects across diverse technologies." />
  <meta name="keywords" content="gallery, portfolio, sveltekit, creative works, visuals" />
  <meta name="author" content="Amit Prafulla" />
</svelte:head>

<div class="min-h-screen bg-bg text-text flex flex-col selection:bg-primary selection:text-bg">
  <HeaderComponent title="Projects" />

  <!-- Hero Section with Theme Gradient -->
  <section class="bg-gradient-to-b from-surface via-bg to-surface py-12 px-4 sm:px-6 lg:px-8 text-text border-b border-primary/20 shadow-inner">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface/80 text-text border border-primary/25 backdrop-blur-md shadow-sm">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Production Showcase
      </div>

      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary min-h-[2.5rem] sm:min-h-[4rem]"
        in:fly={{ y: -15, duration: 400 }}
      >
        {displayedText}
      </h1>

      <p class="text-sm sm:text-base text-text opacity-90 max-w-xl mx-auto leading-relaxed">
        Explore full-stack architectures, systems design, and creative interface implementations.
      </p>

      <!-- Search Box -->
      <div class="pt-2 max-w-md mx-auto">
        <div class="relative">
          <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search projects, technologies..."
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
          All ({$projects.length})
        </button>

        {#each allTags.slice(0, 10) as tag}
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer {selectedTag === tag
              ? 'bg-primary text-bg shadow-md shadow-primary/25'
              : 'bg-tertiary/40 text-text hover:bg-primary/15 border border-primary/10'}"
            on:click={() => (selectedTag = tag)}
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Project Cards Feed -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex items-center justify-center py-20">
        <Loader />
      </div>
    {:else if error}
      <div class="p-8 text-center bg-surface border border-rose-500/30 rounded-3xl shadow-lg max-w-lg mx-auto backdrop-blur-md">
        <Icon icon="mdi:alert-circle-outline" class="text-4xl text-rose-500 mx-auto mb-3" />
        <p class="text-sm font-semibold text-rose-500">{error}</p>
      </div>
    {:else if filteredProjects.length === 0}
      <div class="text-center py-16 bg-surface border border-primary/20 rounded-3xl shadow-lg max-w-lg mx-auto p-8 backdrop-blur-md space-y-3">
        <Icon icon="mdi:folder-search-outline" class="text-4xl text-muted mx-auto" />
        <p class="text-base font-bold text-text">No matching projects found</p>
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {#each filteredProjects as project (project.id)}
          <article
            class="bg-surface border border-primary/20 hover:border-primary/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-md group"
            in:fly={{ y: 20, duration: 300 }}
          >
            <div class="space-y-4">
              <!-- Top Row: Title & Date -->
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-primary/15 pb-4">
                <h2 class="text-xl sm:text-2xl font-bold text-text tracking-tight group-hover:text-primary transition-colors">
                  <a href="/projects/{project.id}">
                    {project.title}
                  </a>
                </h2>
                <time class="text-xs font-mono text-muted shrink-0 flex items-center gap-1.5">
                  <Icon icon="mdi:calendar-outline" class="text-sm" />
                  {new Date(project.date_posted).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </time>
              </div>

              <!-- Tech Pills -->
              {#if project.technology}
                <div class="flex flex-wrap gap-1.5">
                  {#each project.technology.split(",") as tech}
                    <span class="px-3 py-1 text-2xs font-bold uppercase tracking-wider bg-tertiary/60 text-text border border-primary/20 rounded-lg shadow-2xs">
                      {tech.trim()}
                    </span>
                  {/each}
                </div>
              {/if}

              <!-- Description -->
              <div class="prose prose-invert max-w-none text-xs sm:text-sm text-text opacity-90 line-clamp-3 leading-relaxed">
                {@html project.description}
              </div>

              <!-- Gallery Preview Grid -->
              {#if project.images && project.images.length > 0}
                <div class="grid grid-cols-3 gap-3 pt-2">
                  {#each project.images.slice(0, 3) as image (image.id || image.image)}
                    <figure class="rounded-xl overflow-hidden border border-primary/20 bg-bg aspect-video group/img shadow-sm">
                      <img
                        src={resolveImageUrl(image)}
                        alt={image.caption || project.title}
                        loading="lazy"
                        class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                    </figure>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Footer Action Row -->
            <div class="flex items-center justify-between pt-5 mt-5 border-t border-primary/15">
              {#if project.project_link}
                <a
                  href={project.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1"
                >
                  <Icon icon="mdi:github" class="text-base" />
                  <span>Repository</span>
                  <Icon icon="mdi:open-in-new" class="text-xs" />
                </a>
              {:else}
                <span class="text-xs text-muted italic">Private repository</span>
              {/if}

              <button
                type="button"
                class="px-5 py-2.5 bg-secondary text-bg font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transform hover:-translate-y-0.5"
                on:click={() => goToDetails(project.id)}
              >
                <span>View Details</span>
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
  :global(.prose img) {
    border-radius: 0.75rem;
  }
</style>