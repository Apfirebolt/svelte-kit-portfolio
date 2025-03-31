<script lang="ts">
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import HeaderComponent from '$lib/components/Header.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import type { Blog } from '$lib/types/Blog'; // Import as a type

    export let data; // Receive data from the load function in +page.server.ts

    $: blog = data.blog as Blog | null; // Assign data.game to the game variable.

    let displayedTitle = '';
    let clientOnly = false; // Flag to indicate if the component is mounted in the client
    let blogTitleIndex = 0;
    let showImage = false; // Flag to control image visibility

    // Typewriter effect logic for game name
    const typeWriterGameName = () => {
        if (blog && blogTitleIndex < blog.title.length) {
            displayedTitle += blog.title[blogTitleIndex];
            blogTitleIndex++;
            setTimeout(typeWriterGameName, 100); // Adjust speed here
        }
    };

    // Start the typewriter effect when the game data is available
    $: if (blog) {
        displayedTitle = ''; // Reset displayed name
        blogTitleIndex = 0; // Reset index
        typeWriterGameName();
    }

    // Set clientOnly to true when the component is mounted on the client
    onMount(() => {
        clientOnly = true;
    });
</script>

<svelte:head>
    <title>{blog ? blog.title : 'Loading...'}</title>
    <meta
        name="description"
        content={blog ? `${blog.meta_description}` : 'Loading post details...'}
    />
</svelte:head>

<HeaderComponent title="Game Details" />

{#if !blog}
    <Loader />
{:else}
    <section class="bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500 py-4 px-2">
        <div class="max-w-2xl text-center mx-auto text-white p-6 rounded-lg bg-opacity-50 bg-black">
            <h1 class="mb-6 text-5xl font-extrabold tracking-wide md:text-7xl" in:fly={{ x: 300, duration: 500 }}>
                {displayedTitle}
            </h1>
            
            <div class="content">
                {#if clientOnly}
                    {blog.content}
                {/if}
            </div>
        </div>
    </section>
{/if}