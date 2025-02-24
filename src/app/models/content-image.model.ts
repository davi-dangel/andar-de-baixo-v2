import { Content } from "./interfaces/content.interface";

export class ContentImage implements Content{
    type: string;
    value: string;
    alt: string;

    constructor(args: Partial<ContentImage> = {}){
        this.type = args.type ?? 'IMAGE';
        this.value = args.value ?? '';
        this.alt = args.alt ?? '';
    }
}