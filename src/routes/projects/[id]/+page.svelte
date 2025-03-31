<script lang="ts">
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import HeaderComponent from '$lib/components/Header.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import type { Project } from '$lib/types/Project'; // Import as a type

    export let data; // Receive data from the load function in +page.server.ts

    $: project = data.project as Project | null; // Assign data.project to the project variable.

    let displayedTitle = '';
    let clientOnly = false; // Flag to indicate if the component is mounted in the client
    let projectTitleIndex = 0;
    let showImage = false; // Flag to control image visibility

    // Typewriter effect logic for project name
    const typeWriterProjectName = () => {
        if (project && projectTitleIndex < project.title.length) {
            displayedTitle += project.title[projectTitleIndex];
            projectTitleIndex++;
            setTimeout(typeWriterProjectName, 100); // Adjust speed here
        }
    };

    // Start the typewriter effect when the project data is available
    $: if (project) {
        displayedTitle = ''; // Reset displayed name
        projectTitleIndex = 0; // Reset index
        typeWriterProjectName();
    }

    // Set clientOnly to true when the component is mounted on the client
    onMount(() => {
        clientOnly = true;
    });
</script>

<svelte:head>
    <title>{project ? project.title : 'Loading...'}</title>
    <meta
        name="description"
        content={project ? `${project.meta_description}` : 'Loading project details...'}
    />
</svelte:head>

<HeaderComponent title="Project Details" />

{#if !project}
    <Loader />
{:else}
    <section class="bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500 py-4 px-2">
        <div class="max-w-2xl text-center mx-auto text-white p-6 rounded-lg bg-opacity-50 bg-black">
            <h1 class="mb-6 text-5xl font-extrabold tracking-wide md:text-7xl" in:fly={{ x: 300, duration: 500 }}>
                {displayedTitle}
            </h1>
            
            <div class="content text-white">
                {@html project.description}
            </div>
        </div>
        {project.description}
    </section>
{/if}