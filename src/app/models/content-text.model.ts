import { Content } from "./interfaces/content.interface";

export class ContentText implements Content{
    type: string;
    value: string;

    constructor(args: Partial<ContentText> = {}){
        this.type = args.type ?? 'PARAGRAPH';
        this.value = args.value ?? '';
    }
}