import { ContentGallery } from "./content-gallery.model";
import { ContentIframe } from "./content-iframe.model";
import { ContentImage } from "./content-image.model";
import { ContentPoem } from "./content-poem.model";
import { ContentText } from "./content-text.model";

export type ArticleContent = ContentText | ContentPoem | ContentImage | ContentIframe | ContentGallery;

export interface Page {
    number: number;
    content: ArticleContent[];
}
