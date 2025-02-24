import { Content } from "./interfaces/content.interface";

export class ContentPoem implements Content{
    type: string;
    value: string[];

    constructor(args: Partial<ContentPoem> = {}){
        this.type = args.type ?? 'POEM';
        this.value = args.value ?? [];
    }
}