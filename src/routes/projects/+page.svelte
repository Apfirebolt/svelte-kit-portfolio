<script lang="ts">
  import { fly } from "svelte/transition";
  import apiClient from "$lib/plugins/interceptor";
  import { goto } from "$app/navigation";
  import type { Project, ProjectResponse } from "$lib/types/Project";
  import { onMount } from "svelte";
  import { projects } from "$lib/store";
  import { get } from "svelte/store";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";

  let text = "Welcome to Projects";
  let displayedText = "";
  let index = 0;
  let loading = true;
  let error: string | null = null;
  let projectList: Project[] = [];

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

  const goToDetails = (projectId: number) => {
    // Navigate to the project details page
    goto(`/projects/${projectId}`);
  };

  onMount(async () => {
    try {
      if (get(projects).length === 0) {
        const response = await apiClient.get<ProjectResponse>("/projects");
        projects.set(response.data.results);
      }
      projectList = get(projects); // Get the current value of the store
      if (projectList.length === 0) {
        error = "No projects available";
      }
    } catch (err) {
      error = "Failed to load projects";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
    <title>Projects - SvelteKit Portfolio</title>
    <meta name="description" content="Explore our collection of projects in a wide range of technologies." />
    <meta name="keywords" content="gallery, portfolio, sveltekit, creative works, visuals" />
    <meta name="author" content="Amit Prafulla" />
</svelte:head>

<HeaderComponent title="Projects" />

<section
  class="relative bg-cover bg-center h-[500px]"
  style="background-image: url('https://img.freepik.com/free-vector/laptop-with-program-code-isometric-icon-software-development-programming-applications-dark-neon_39422-971.jpg?semt=ais_hybrid&w=740');"
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
        Explore our amazing projects
      </p>
    </div>
  </div>
</section>

{#if loading}
  <Loader />
{:else if error}
  <p class="text-center text-red-500">{error}</p>
{:else}
  {#each projectList as project}
    <div class="bg-white container mx-auto my-3 p-4 rounded-lg shadow-md">
      <h3 class="text-2xl font-semibold mb-4">{project.title}</h3>

      <div class="flex my-3 border-2 border-dark rounded-lg py-3 px-4">
        <p class="lg:w-1/2 text-left">
          <span class="text-primary-dark font-semibold">Posted on:</span>
          {new Date(project.date_posted).toLocaleDateString()}
        </p>
        <div class="lg:w-1/2 flex-wrap flex gap-2">
          {#each project.technology.split(",") as tech}
            <span class="bg-primary text-light px-3 py-1 rounded-md">
              {tech.trim()}
            </span>
          {/each}
        </div>
      </div>

      <div class="content">
        {@html project.description}
      </div>
      <div class="gallery-images grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {#each project.images as image}
          <img
            src={getFullUrl(image)}
            alt={image.alt || "Project Image"}
            class="w-full h-auto rounded-lg shadow-md"
          />
        {/each}
      </div>
      <button
        class="mt-4 px-4 py-2 bg-secondary text-white rounded hover:bg-blue-900"
        on:click={() => goToDetails(project.id)}
      >
        View Details
      </button>
    </div>
  {/each}
{/if}

<FooterComponent />

<style>
</style>
