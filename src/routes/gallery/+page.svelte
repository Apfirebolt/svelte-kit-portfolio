<script lang="ts">
    import { fly } from 'svelte/transition';
    import apiClient from '$lib/plugins/interceptor';
    import type { Gallery, GalleryResponse } from '$lib/types/Gallery';
    import { onMount } from 'svelte';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import Loader from '$lib/components/Loader.svelte';

    let text = "Welcome to the Gallery";
    let displayedText = "";
    let index = 0;
    let galleryItems: Gallery[] = [];
    let loading = true;
    let error: string | null = null;

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

    onMount(async () => {
        try {
            const response = await apiClient.get<GalleryResponse>('/gallery-posts');
            console.log(response.data.results);
            galleryItems = response.data.results;
            if (galleryItems.length === 0) {
                error = 'No gallery items available';
            }
        } catch (err) {
            error = 'Failed to load gallery items';
        } finally {
            loading = false;
        }
    });
</script>

<HeaderComponent title="Gallery" />

<section class="relative bg-cover bg-center h-[500px]" style="background-image: url('https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');">
    <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black bg-opacity-50 flex items-center justify-center">
        <div class="text-center text-white">
            <h1 class="text-4xl md:text-6xl font-bold mb-4" in:fly="{{ x: -200, duration: 500 }}">
                {displayedText}
            </h1>
            <p class="text-lg md:text-xl mb-6" in:fly="{{ x: -200, duration: 500, delay: 200 }}">
                Explore our stunning gallery
            </p>
            <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg" in:fly="{{ x: -200, duration: 500, delay: 400 }}">
                View More
            </button>
        </div>
    </div>
</section>

{#if loading}
    <Loader />
{:else if error}
    <p class="text-center text-red-500">{error}</p>
{:else}
{#each galleryItems as gallery}
    <div class="bg-white container mx-auto my-3 p-4 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold">{gallery.title}</h3>
        <div class="content">
            {@html gallery.description}
        </div>
    </div>
{/each}
{/if}

<FooterComponent />

<style>
    /* Add any additional styles for the gallery here */
</style>