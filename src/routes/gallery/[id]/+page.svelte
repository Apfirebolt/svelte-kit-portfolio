<script lang="ts">
    import { fly } from "svelte/transition";
    import httpClient from "$lib/plugins/interceptor";
    import { isLoading, gallery } from "$lib/store";
    import type { Gallery } from "$lib/types/Gallery";
    import HeaderComponent from "$lib/components/Header.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let galleryDetails: any = null;
    let galleryId: string | null = null;

    // Get the `id` from the route parameters
    $: galleryId = $page.params.id;

    const fetchGalleryDetails = async () => {
        try {
            isLoading.set(true);
            const response = await httpClient.get(
                `gallery-posts/${galleryId}`
            );
            if (response.status === 200 && response.data) {
                galleryDetails = response.data;
                isLoading.set(false);
            } else {
                console.error("Error fetching gallery details:", response.statusText);
                isLoading.set(false);
            }
        } catch (error) {
            console.error("Error fetching gallery details:", error);
            isLoading.set(false);
        }
    };

    onMount(() => {
        if (galleryId) {
            fetchGalleryDetails();
        }
    });
</script>

<svelte:head>
    <title>Gallery Details</title>
    <meta name="description" content="Gallery details page" />
</svelte:head>

<HeaderComponent title="Gallery Details" />

<section class="p-6">
    {#if $isLoading}
        <Loader />
    {:else if galleryDetails}
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row">
                <img
                    src={galleryDetails.image}
                    alt={galleryDetails.title}
                    class="w-full md:w-1/3 object-cover"
                />
                <div class="p-6">
                    <h1 class="text-2xl font-bold mb-4">{galleryDetails.title}</h1>
                    <p class="text-gray-600 mb-2"><strong>Description:</strong> {galleryDetails.description}</p>
                    <p class="text-gray-600 mb-2"><strong>Technologies:</strong> {galleryDetails.technologies}</p>
                    <p class="text-gray-600 mb-2"><strong>Start Date:</strong> {galleryDetails.startDate}</p>
                    <p class="text-gray-600 mb-2"><strong>End Date:</strong> {galleryDetails.endDate}</p>
                    <p class="text-gray-600 mb-2"><strong>Repository:</strong> <a href={galleryDetails.repository} target="_blank" class="text-blue-500">{galleryDetails.repository}</a></p>
                </div>

                <div>
                    <h2 class="text-xl font-bold mb-4">Gallery Images</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {#each galleryDetails.images as image}
                            <div class="bg-gray-200 p-4 rounded-lg">
                                <img src={image} alt="" class="w-full h-auto rounded-lg" />
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <p class="text-center text-gray-600">Gallery details not found.</p>
    {/if}
</section>
