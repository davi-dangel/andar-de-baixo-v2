import { ContentGallery } from "./content-gallery.model";
import { ContentIframe } from "./content-iframe.model";
import { ContentImage } from "./content-image.model";
import { ContentPoem } from "./content-poem.model";
import { ContentText } from "./content-text.model";

type ArticleContent = ContentText | ContentPoem | ContentImage | ContentIframe | ContentGallery;

export class HeadLine{
    id: number;
    title: string;
    showTitle: boolean = true;
    subtitle: string | null;
    imgPreview: string | null;
    abstract: string | null;
    location: string | null;
    date: string | null;
    content: ArticleContent[];
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
        this.content = args.content ?? [];
        this.active = args.active ?? false;
    }
}