import type { PageServerLoad } from './$types';
import httpClient from '$lib/plugins/interceptor';
import type { Project } from '$lib/types/Project';

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    try {
        const response = await httpClient.get<Project>(`projects/${id}`);
        const project = response.data;
        return { project }; // Return project details to the page
    } catch (error) {
        console.error('API Error:', error);
        return { project: null }; // Handle errors gracefully
    }
};
