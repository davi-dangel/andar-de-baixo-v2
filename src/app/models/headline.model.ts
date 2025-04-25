import { Content } from "./interfaces/content.interface";

export class HeadLine{
    id: number;
    title: string;
    showTitle: boolean = true;
    subtitle: string | null;
    imgPreview: string | null;
    abstract: string | null;
    content: Content[];
    active: boolean = false;

    constructor(args: Partial<HeadLine> = {}){
        this.id = args.id ?? 0;
        this.title = args.title ?? '';
        this.showTitle = args.showTitle ?? true;
        this.subtitle = args.subtitle ?? null;
        this.imgPreview = args.imgPreview ?? null;
        this.abstract = args.abstract ?? null;
        this.content = args.content ?? [];
        this.active = args.active ?? false;
    }
}