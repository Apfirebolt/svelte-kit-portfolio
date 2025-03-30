<script lang="ts">
    import { fly } from "svelte/transition";
    import httpClient from "$lib/plugins/interceptor";
    import { isLoading, blog } from "$lib/store";
    import type { Blog } from "$lib/types/Blog";
    import HeaderComponent from "$lib/components/Header.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let blogDetails: any = null;
    let blogId: string | null = null;

    // Get the `id` from the route parameters
    $: blogId = $page.params.id;

    const fetchBlogDetails = async () => {
        try {
            isLoading.set(true);
            const response = await httpClient.get(
                `blogs/${blogId}`
            );
            if (response.status === 200 && response.data) {
                blogDetails = response.data;
                isLoading.set(false);
            } else {
                console.error("Error fetching blog details:", response.statusText);
                isLoading.set(false);
            }
        } catch (error) {
            console.error("Error fetching blog details:", error);
            isLoading.set(false);
        }
    };

    onMount(() => {
        if (blogId) {
            fetchBlogDetails();
        }
    });
</script>

<svelte:head>
    <title>Blog Details</title>
    <meta name="description" content="Blog details page" />
</svelte:head>

<HeaderComponent title="Blog Details" />

<section class="p-6">
    {#if $isLoading}
        <Loader />
    {:else if blogDetails}
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row">
                <img
                    src={blogDetails.image}
                    alt={blogDetails.title}
                    class="w-full md:w-1/3 object-cover"
                />
                <div class="p-6">
                    <h1 class="text-2xl font-bold mb-4">{blogDetails.title}</h1>
                    <p class="text-gray-600 mb-2"><strong>Description:</strong> {blogDetails.description}</p>
                    <p class="text-gray-600 mb-2"><strong>Technologies:</strong> {blogDetails.technologies}</p>
                    <p class="text-gray-600 mb-2"><strong>Start Date:</strong> {blogDetails.startDate}</p>
                    <p class="text-gray-600 mb-2"><strong>End Date:</strong> {blogDetails.endDate}</p>
                    <p class="text-gray-600 mb-2"><strong>Repository:</strong> <a href={blogDetails.repository} target="_blank" class="text-blue-500">{blogDetails.repository}</a></p>
                </div>
            </div>
        </div>
    {:else}
        <p class="text-center text-gray-600">Blog details not found.</p>
    {/if}
</section>
