import { Content } from "./interfaces/content.interface";

export class ContentGallery implements Content{
    type: string;
    value: Image[] | null;

    constructor(args: Partial<ContentGallery> = {}){
        this.type = args.type ?? 'GALLERY';
        this.value = args.value ?? null;
    }
}

export class Image{
    src: string;
    alt: string;
    camera?: string | null;
    film?: string | null;

    constructor(args: Partial<Image> = {}) {
        this.src = args.src ?? '';
        this.alt = args.alt ?? '';
        this.camera = args.camera ?? null;
        this.film = args.film ?? null;
    }
}