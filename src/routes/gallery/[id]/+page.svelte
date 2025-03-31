<script lang="ts">
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import HeaderComponent from '$lib/components/Header.svelte';
    import Loader from '$lib/components/Loader.svelte';

    export let data; // Receive data from the load function in +page.server.ts

    $: gallery = data.gallery || []; // Assign data.gallery to the gallery variable.

    let clientOnly = false; // Flag to indicate if the component is mounted in the client

    // Set clientOnly to true when the component is mounted on the client
    onMount(() => {
        clientOnly = true;
    });
</script>

<svelte:head>
    <title>{gallery ? 'Gallery' : 'Loading...'}</title>
    <meta
        name="description"
        content={gallery ? 'Browse through the gallery' : 'Loading gallery...'}
    />
</svelte:head>

<HeaderComponent title="Gallery" />
{#if !gallery}
    <Loader />
{:else}
<section class="bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500 py-4 px-2">
    <div class="max-w-2xl text-center mx-auto text-white p-6 rounded-lg bg-opacity-50 bg-black">
        <h1 class="mb-6 text-5xl font-extrabold tracking-wide md:text-7xl" in:fly={{ x: 300, duration: 500 }}>
            {gallery.title}
        </h1>
        
        <div class="content">
            {#if clientOnly}
                {gallery.description}
            {/if}
        </div>
    </div>
</section>
{/if}
