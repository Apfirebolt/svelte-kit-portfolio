import type { PageServerLoad } from './$types';
import httpClient from '$lib/plugins/interceptor';
import type { Gallery } from '$lib/types/Gallery';

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    try {
        const response = await httpClient.get<Gallery>(`gallery-posts/${id}`);
        const gallery = response.data;
        return { gallery }; // Return blog details to the page
    } catch (error) {
        console.error('API Error:', error);
        return { gallery: null }; // Handle errors gracefully
    }
};
