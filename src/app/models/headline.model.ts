import { Content } from "./interfaces/content.interface";

export class HeadLine{
    id: number;
    title: string;
    subtitle: string | null;
    imgPreview: string | null;
    abstract: string | null;
    content: Content[];
    active: boolean = false;

    constructor(args: Partial<HeadLine> = {}){
        this.id = args.id ?? 0;
        this.title = args.title ?? '';
        this.subtitle = args.subtitle ?? null;
        this.imgPreview = args.imgPreview ?? null;
        this.abstract = args.abstract ?? null;
        this.content = args.content ?? [];
        this.active = args.active ?? false;
    }
}