import { Page } from "./page.model";

export class HeadLine{
    id: number;
    title: string;
    showTitle: boolean = true;
    subtitle: string | null;
    imgPreview: string | null;
    abstract: string | null;
    location: string | null;
    date: string | null;
    pages: Page[];
    active: boolean = false;

    constructor(args: Partial<HeadLine> = {}){
        this.id = args.id ?? 0;
        this.title = args.title ?? '';
        this.showTitle = args.showTitle ?? true;
        this.subtitle = args.subtitle ?? null;
        this.imgPreview = args.imgPreview ?? null;
        this.abstract = args.abstract ?? null;
        this.location = args.location ?? null;
        this.date = args.date ?? null;
        this.pages = args.pages ?? [];
        this.active = args.active ?? false;
    }
}