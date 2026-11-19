import { Content } from "./interfaces/content.interface";

export class ContentIframe implements Content{
    type: 'IFRAME';
    value: Iframe | null;
    alt: string;

    constructor(args: Partial<ContentIframe> = {}){
        this.type = args.type ?? 'IFRAME';
        this.value = args.value ?? null;
        this.alt = args.alt ?? '';
    }
}

export class Iframe{
    src: string;
    width: string;
    height: string;

    constructor(args: Partial<Iframe> = {}) {
        this.src = args.src ?? '';
        this.width = args.width ?? '100%';
        this.height = args.height ?? '100%';
    }
}