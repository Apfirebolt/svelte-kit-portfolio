import type { PageServerLoad } from './$types';
import httpClient from '$lib/plugins/interceptor';
import type { Blog } from '$lib/types/Blog';


export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    try {
        const response = await httpClient.get<Blog>(`blogs/${id}`);
        const blog = response.data;
        return { blog }; // Return game details to the page
    } catch (error) {
        console.error('API Error:', error);
        return { blog: null }; // Handle errors gracefully
    }
};