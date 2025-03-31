<script lang="ts">
    import { fly } from 'svelte/transition';
    import apiClient from '$lib/plugins/interceptor';
    import { goto } from '$app/navigation';
    import { galleries } from "$lib/store";
    import { get } from "svelte/store";
    import type { GalleryResponse } from '$lib/types/Gallery';
    import { onMount } from 'svelte';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import Loader from '$lib/components/Loader.svelte';

    let text = "Welcome to the Gallery";
    let displayedText = "";
    let index = 0;
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

    const goToDetails = (galleryId: number) => {
        // Navigate to the gallery details page
        goto(`/gallery/${galleryId}`);
    };

    onMount(async () => {
        try {
            if (get(galleries).length === 0) {
                const response = await apiClient.get<GalleryResponse>('/gallery-posts');
                galleries.set(response.data.results);
                if (response.data.results.length === 0) {
                    error = 'No gallery available';
                }
            }
        } catch (err) {
            error = 'Failed to load gallery items';
        } finally {
            loading = false;
        }
    });
</script>

<svelte:head>
    <title>Gallery - SvelteKit Portfolio</title>
    <meta name="description" content="Explore our stunning gallery showcasing amazing visuals and creative works." />
    <meta name="keywords" content="gallery, portfolio, sveltekit, creative works, visuals" />
    <meta name="author" content="Amit Prafulla" />
</svelte:head>

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
        </div>
    </div>
</section>

{#if loading}
    <Loader />
{:else if error}
    <p class="text-center text-red-500">{error}</p>
{:else}
{#each $galleries as gallery}
    <div class="bg-white container mx-auto my-3 p-4 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold mb-4">{gallery.title}</h3>
        <div class="content">
            {@html gallery.description}
        </div>
        <div>
            <button 
                class="mt-4 px-4 py-2 bg-secondary text-white rounded hover:bg-blue-900"
                on:click={() => goToDetails(gallery.id)}
            >
                View Details
            </button>
        </div>
    </div>
{/each}
{/if}

<FooterComponent />