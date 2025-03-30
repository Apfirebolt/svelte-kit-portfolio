<script lang="ts">
    import { fly } from "svelte/transition";
    import httpClient from "$lib/plugins/interceptor";
    import { isLoading, project } from "$lib/store";
    import { goto } from '$app/navigation';
    import type { Project } from "$lib/types/Project";
    import HeaderComponent from "$lib/components/Header.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let projectDetails: any = null;
    let projectId: string | null = null;

    // Get the `id` from the route parameters
    $: projectId = $page.params.id;

    const fetchProjectDetails = async () => {
        try {
            isLoading.set(true);
            const response = await httpClient.get(
                `projects/${projectId}`
            );
            if (response.status === 200 && response.data) {
                projectDetails = response.data;
                isLoading.set(false);
            } else {
                console.error("Error fetching project details:", response.statusText);
                isLoading.set(false);
            }
        } catch (error) {
            console.error("Error fetching project details:", error);
            isLoading.set(false);
        }
    };

    const goToDetails = (projectId: string) => {
        // Navigate to the project details page
        goto(`/projects/${projectId}`);
    };

    onMount(() => {
        if (projectId) {
            fetchProjectDetails();
        }
    });
</script>

<svelte:head>
    <title>Project Details</title>
    <meta name="description" content="Project details page" />
</svelte:head>

<HeaderComponent title="Project Details" />

<section class="p-6">
    {#if $isLoading}
        <Loader />
    {:else if projectDetails}
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row">
                <img
                    src={projectDetails.image}
                    alt={projectDetails.title}
                    class="w-full md:w-1/3 object-cover"
                />
                <div class="p-6">
                    <h1 class="text-2xl font-bold mb-4">{projectDetails.title}</h1>
                    <p class="text-gray-600 mb-2"><strong>Description:</strong> {projectDetails.description}</p>
                    <p class="text-gray-600 mb-2"><strong>Technologies:</strong> {projectDetails.technologies}</p>
                    <p class="text-gray-600 mb-2"><strong>Start Date:</strong> {projectDetails.startDate}</p>
                    <p class="text-gray-600 mb-2"><strong>End Date:</strong> {projectDetails.endDate}</p>
                    <p class="text-gray-600 mb-2"><strong>Repository:</strong> <a href={projectDetails.repository} target="_blank" class="text-blue-500">{projectDetails.repository}</a></p>

                    <button
                        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        on:click={() => goToDetails(projectDetails.id)}
                    >
                        Go to Details Page
                    </button>
                </div>
            </div>
        </div>
    {:else}
        <p class="text-center text-gray-600">Project details not found.</p>
    {/if}
</section>
