export interface BlogResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Blog[];
}

interface BlogImage {
    id: number;
    caption: string;
    image: string;
    order: number;
    blog: number;
    tags: any[];
}

interface BlogTag {
    name: string;
}

export interface Blog {
    id: number;
    images: BlogImage[];
    tags: BlogTag[];
    title: string;
    content: string;
    meta_title: string;
    meta_description: string;
    date_posted: string;
    date_updated: string;
    views: number;
    author: number;
}
