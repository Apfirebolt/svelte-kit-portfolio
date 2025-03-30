export interface GalleryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Gallery[];
}

interface GalleryImage {
    id: number;
    caption: string;
    image: string;
    order: number;
    gallery: number;
    tags: any[];
}

interface GalleryTag {
    name: string;
}

export interface Gallery {
    id: number;
    images: GalleryImage[];
    tags: GalleryTag[];
    title: string;
    slug: string;
    is_published: boolean;
    description: string;
    meta_title: string;
    meta_description: string;
    date_posted: string;
    date_updated: string;
    views: number;
    author: number;
}
