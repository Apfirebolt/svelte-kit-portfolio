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

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light">
  <HeaderComponent title="Projects" />

  <!-- Hero Section with Project Theme Gradient -->
  <section class="bg-gradient-to-b from-tertiary via-secondary to-dark py-12 px-4 sm:px-6 lg:px-8 text-light shadow-inner">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-light border border-white/20 backdrop-blur-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-light animate-pulse" />
        Production Showcase
      </div>

      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white min-h-[2.5rem] sm:min-h-[4rem]"
        in:fly={{ y: -15, duration: 400 }}
      >
        {displayedText}
      </h1>

      <p class="text-sm sm:text-base text-light/85 max-w-xl mx-auto leading-relaxed">
        Explore full-stack architectures, systems design, and creative interface implementations.
      </p>

      <!-- Search Box -->
      <div class="pt-2 max-w-md mx-auto">
        <div class="relative">
          <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search projects, technologies..."
            class="w-full bg-white/95 text-dark placeholder-gray-500 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm border border-white/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  </section>

  <!-- Tag Filter Ribbon -->
  {#if allTags.length > 0}
    <div class="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all {selectedTag === 'all'
            ? 'bg-primary text-light shadow-sm'
            : 'bg-light text-dark hover:bg-gray-200 border border-gray-200'}"
          on:click={() => (selectedTag = "all")}
        >
          All ({$projects.length})
        </button>

        {#each allTags.slice(0, 10) as tag}
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all {selectedTag === tag
              ? 'bg-primary text-light shadow-sm'
              : 'bg-light text-dark hover:bg-gray-200 border border-gray-200'}"
            on:click={() => (selectedTag = tag)}
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Project Cards Feed -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
    {#if loading}
      <div class="flex items-center justify-center py-20">
        <Loader />
      </div>
    {:else if error}
      <div class="p-6 text-center bg-white border border-red-200 rounded-2xl shadow-sm max-w-lg mx-auto">
        <p class="text-sm font-semibold text-red-600">{error}</p>
      </div>
    {:else if filteredProjects.length === 0}
      <div class="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-lg mx-auto p-6">
        <p class="text-base font-semibold text-dark">No matching projects found</p>
        <p class="text-xs text-gray-500 mt-1">Try resetting your search query or tag selection.</p>
        <button
          type="button"
          class="mt-4 px-4 py-2 bg-primary text-light text-xs font-semibold rounded-lg shadow hover:bg-primary-dark transition"
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
            class="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            in:fly={{ y: 20, duration: 300 }}
          >
            <div class="space-y-4">
              <!-- Top Row: Title & Date -->
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-gray-100 pb-3">
                <h2 class="text-xl sm:text-2xl font-bold text-dark tracking-tight hover:text-primary transition-colors">
                  <a href="/projects/{project.id}">
                    {project.title}
                  </a>
                </h2>
                <time class="text-xs font-mono text-gray-500 shrink-0">
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
                    <span class="px-2.5 py-1 text-2xs font-semibold bg-dark text-light rounded-md shadow-xs">
                      {tech.trim()}
                    </span>
                  {/each}
                </div>
              {/if}

              <!-- Description -->
              <div class="prose prose-slate max-w-none text-xs sm:text-sm text-gray-700 line-clamp-3 leading-relaxed">
                {@html project.description}
              </div>

              <!-- Gallery Preview Grid -->
              {#if project.images && project.images.length > 0}
                <div class="grid grid-cols-3 gap-2 pt-2">
                  {#each project.images.slice(0, 3) as image (image.id || image.image)}
                    <figure class="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-video group">
                      <img
                        src={resolveImageUrl(image)}
                        alt={image.caption || project.title}
                        loading="lazy"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </figure>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Footer Action Row -->
            <div class="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
              {#if project.project_link}
                <a
                  href={project.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs font-semibold text-primary hover:text-secondary underline"
                >
                  GitHub Repository ↗
                </a>
              {:else}
                <span class="text-xs text-gray-400 italic">Private repository</span>
              {/if}

              <button
                type="button"
                class="px-4 py-2 bg-secondary hover:bg-dark text-light text-xs font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
                on:click={() => goToDetails(project.id)}
              >
                View Details &rarr;
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
    border-radius: 0.5rem;
  }
</style>