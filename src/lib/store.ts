// store.ts
import { writable, derived } from 'svelte/store';
import type { Blog } from "$lib/types/Blog";
import type { Project } from "$lib/types/Project";
import type { Gallery } from "$lib/types/Gallery";

export const isLoading = writable<boolean>(false);
export const isError = writable<boolean>(false);
export const isSuccess = writable<boolean>(false);
export const blogs = writable<Blog[]>([]);
export const projects = writable<Project[]>([]);
export const galleries = writable<Gallery[]>([]);
export const blog = writable<Blog | null>(null);
export const project = writable<Project | null>(null);
export const gallery = writable<Gallery | null>(null);

