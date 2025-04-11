<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import type { Project } from "$lib/types/Project"; // Import as a type

  export let data; // Receive data from the load function in +page.server.ts

  $: project = data.project as Project | null; // Assign data.project to the project variable.

  let displayedTitle = "";
  let clientOnly = false; // Flag to indicate if the component is mounted in the client
  let projectTitleIndex = 0;
  let showImage = false; // Flag to control image visibility

  let currentSlide = 0;
  let currentTextSlide = 0;
  let modalOpen = false;
  let modalImageUrl = "";
  let modalImageAlt = "";

  // Typewriter effect logic for project name
  const typeWriterProjectName = () => {
    if (project && projectTitleIndex < project.title.length) {
      displayedTitle += project.title[projectTitleIndex];
      projectTitleIndex++;
      setTimeout(typeWriterProjectName, 100); // Adjust speed here
    }
  };

  function nextSlide() {
    currentSlide = (currentSlide + 1) % project.images.length;
  }

  function nextTextSlide() {
    currentTextSlide = (currentTextSlide + 1) % project.images.length;
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

  const getFullUrl = (image: any) => {
    return `https://softgenie.org${image.image}`; // Replace with your base URL
  };

  let interval;
  let textInterval;

  // Start the typewriter effect when the project data is available
  $: if (project) {
    displayedTitle = ""; // Reset displayed name
    projectTitleIndex = 0; // Reset index
    typeWriterProjectName();
  }

  // Set clientOnly to true when the component is mounted on the client
  onMount(() => {
    clientOnly = true;
    interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    textInterval = setInterval(nextTextSlide, 5000); // Auto-slide text every 5 seconds

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    }; // Cleanup on destroy
  });
</script>

<svelte:head>
  <title>{project ? project.title : "Loading..."}</title>
  <meta
    name="description"
    content={project
      ? `${project.meta_description}`
      : "Loading project details..."}
  />
</svelte:head>

<HeaderComponent title="Project Details" />

{#if !project}
  <Loader />
{:else}
  <section
    class="bg-gradient-to-b from-tertiary via-secondary to-dark py-4 px-2"
  >
    <div
      class="md:w-3/4 text-center mx-auto text-black p-6 rounded-lg bg-opacity-50 bg-white"
    >
      <h1
        class="mb-6 text-5xl font-extrabold tracking-wide md:text-7xl"
        in:fly={{ x: 300, duration: 500 }}
      >
        {displayedTitle}
      </h1>

      <div class="flex my-3">
        <p class="w-1/2 text-left">
          <span class="text-primary-dark font-semibold">Posted on:</span>
          {new Date(project.date_posted).toLocaleDateString()}
        </p>
        <div class="lg:w-1/2 flex-wrap text-right">
          {#each project.technology.split(",") as tech}
            <span class="bg-dark text-light px-3 py-1 rounded-full mr-2">
              {tech.trim()}
            </span>
          {/each}
        </div>
      </div>

      <div class="my-3 flex justify-left">
        {#if project.project_link}
          <a
            href={project.project_link}
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:text-secondary text-sm font-semibold"
          >
            Project Link : {project.project_link}
          </a>
        {:else}
          <span>No project link available</span>
        {/if}
      </div>

      {#if project.tags.length > 0}
        <ul class="flex flex-wrap gap-2">
          {#each project.tags as tag, index}
          <li
            class="bg-dark text-center text-light px-4 py-1 rounded-full text-sm shadow mr-2"
          >
            {tag.name}
          </li>
          {/each}
        </ul>
      {/if}

      <div class="grid grid-cols-1 md:grid-cols-1 my-3">
        {#each project.images as image, index (image.id)}
          {#if index === currentSlide}
            <img
              src={getFullUrl(image)}
              alt={image.alt}
              class="rounded-lg shadow-lg"
              in:fade={{ duration: 500 }}
              out:fade={{ duration: 500 }}
            />
          {/if}
        {/each}
      </div>

      <div class="content" in:fade={{ duration: 500 }}>
        {#if clientOnly}
          {@html project.description}
        {/if}
      </div>

      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        {#each project.images as image, index (image.id)}
          <img
            src={getFullUrl(image)}
            alt={image.alt}
            class="rounded-lg shadow-lg cursor-pointer"
            on:click={() => openModal(getFullUrl(image), image.alt)}
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
