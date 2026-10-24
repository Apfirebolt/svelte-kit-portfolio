import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // Configured explicitly for Vercel deployment
        adapter: adapter({
            // Optional Vercel adapter configurations (uncomment if needed):
            // split: true,
            // external: []
        })
    }
};

export default config;