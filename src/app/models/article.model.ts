import { Page } from "./page.model";

export class Article{
    //TODO: ADD VARS AND WHAT IS MISSING
    id: number;
    title: string;
    subtitle: string | null;
    img: string | null;
    abstract: string | null;
    pages: Page[];
    location: string | null = null;
    date: string | null = null;
    active: boolean = false;

    constructor(args: Partial<Article> = {}){
        this.id = args.id ?? 0;
        this.title = args.title ?? '';
        this.subtitle = args.subtitle ?? null;
        this.img = args.img ?? null;
        this.abstract = args.abstract ?? null;
        this.pages = args.pages ?? [];
        this.location = args.location ?? null;
        this.date = args.date ?? null;
        this.active = args.active ?? false;
    }
}