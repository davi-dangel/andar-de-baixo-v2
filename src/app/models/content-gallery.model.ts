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

    constructor(args: Partial<Image> = {}) {
        this.src = args.src ?? '';
        this.alt = args.alt ?? '';
    }
}