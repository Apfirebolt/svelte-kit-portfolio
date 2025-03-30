export interface ProjectResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Project[];
}

interface ProjectImage {
    id: number;
    caption: string;
    image: string;
    order: number;
    project: number;
    tags: any[];
}

interface ProjectTag {
    name: string;
}

export interface Project {
    id: number;
    images: ProjectImage[];
    tags: ProjectTag[];
    title: string;
    slug: string;
    technology: string;
    project_link: string;
    is_published: boolean;
    description: string;
    meta_title: string;
    meta_description: string;
    date_posted: string;
    date_updated: string;
    views: number;
    author: number;
}