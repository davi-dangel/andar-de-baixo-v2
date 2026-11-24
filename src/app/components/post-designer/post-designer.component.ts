import { Component, OnInit } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HeadLine } from '../../models/headline.model';
import { ArticleContent, Page } from '../../models/page.model';
import { ContentGallery, Image } from '../../models/content-gallery.model';
import { ContentIframe, Iframe } from '../../models/content-iframe.model';
import { ContentImage } from '../../models/content-image.model';
import { ContentPoem } from '../../models/content-poem.model';
import { ContentText } from '../../models/content-text.model';
import { DataService } from '../../services/data.service';

type ContentType = 'PARAGRAPH' | 'POEM' | 'IMAGE' | 'IFRAME' | 'GALLERY';

@Component({
  selector: 'app-post-designer',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './post-designer.component.html'
})
export class PostDesignerComponent implements OnInit {
  public articles: HeadLine[] = [];
  public selectedArticle: HeadLine | null = null;
  public selectedPage: Page | null = null;
  public copyMessage = '';
  public expandedBlockIndex = 0;
  public readonly contentTypes: { type: ContentType; label: string }[] = [
    { type: 'PARAGRAPH', label: 'Paragraph' },
    { type: 'POEM', label: 'Poem' },
    { type: 'IMAGE', label: 'Image' },
    { type: 'IFRAME', label: 'Iframe' },
    { type: 'GALLERY', label: 'Gallery' }
  ];
  public contentType: ContentType = 'PARAGRAPH';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.articles = this.dataService.GetAll();
    this.selectedArticle = this.articles[0] ?? null;
    this.selectedPage = this.selectedArticle?.pages[0] ?? null;
    this.expandedBlockIndex = this.selectedPage?.content.length ? 0 : -1;
  }

  createPost(): void {
    const nextId = Math.max(0, ...this.articles.map(article => article.id)) + 1;
    const article = new HeadLine({ id: nextId, title: '', pages: [{ number: 1, content: [] }] });
    this.articles = [...this.articles, article];
    this.selectedArticle = article;
    this.selectedPage = article.pages[0];
    this.expandedBlockIndex = -1;
    this.copyMessage = '';
  }

  selectArticle(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.selectedArticle = this.articles.find(article => article.id === id) ?? null;
    this.selectedPage = this.selectedArticle?.pages[0] ?? null;
    this.expandedBlockIndex = this.selectedPage?.content.length ? 0 : -1;
    this.copyMessage = '';
  }

  selectPage(event: Event): void {
    const number = Number((event.target as HTMLSelectElement).value);
    this.selectedPage = this.selectedArticle?.pages.find(page => page.number === number) ?? null;
    this.expandedBlockIndex = this.selectedPage?.content.length ? 0 : -1;
    this.copyMessage = '';
  }

  addPage(): void {
    if (!this.selectedArticle) {
      return;
    }

    const number = Math.max(0, ...this.selectedArticle.pages.map(page => page.number)) + 1;
    const page: Page = { number, content: [] };
    this.selectedArticle.pages.push(page);
    this.selectedPage = page;
    this.expandedBlockIndex = -1;
    this.copyMessage = '';
  }

  updateTitle(event: Event): void {
    if (this.selectedArticle) {
      this.selectedArticle.title = (event.target as HTMLInputElement).value;
      this.copyMessage = '';
    }
  }

  selectContentType(event: Event): void {
    const type = (event.target as HTMLSelectElement).value;
    const contentType = this.contentTypes.find(option => option.type === type)?.type;
    if (contentType) {
      this.contentType = contentType;
    }
  }

  addContent(): void {
    if (!this.selectedPage) {
      return;
    }

    this.selectedPage.content.push(this.createContentBlock(this.contentType));
    this.expandedBlockIndex = this.selectedPage.content.length - 1;
    this.copyMessage = '';
  }

  updateParagraph(block: ContentText, event: Event): void {
    block.value = (event.target as HTMLTextAreaElement).value;
    this.copyMessage = '';
  }

  updatePoem(block: ContentPoem, event: Event): void {
    block.value = (event.target as HTMLTextAreaElement).value.split(/\r?\n/);
    this.copyMessage = '';
  }

  updateImage(block: ContentImage, field: 'value' | 'alt', event: Event): void {
    block[field] = (event.target as HTMLInputElement).value;
    this.copyMessage = '';
  }

  updateIframe(block: ContentIframe, field: 'src' | 'width' | 'height', event: Event): void {
    if (block.value) {
      block.value[field] = (event.target as HTMLInputElement).value;
      this.copyMessage = '';
    }
  }

  updateIframeAlt(block: ContentIframe, event: Event): void {
    block.alt = (event.target as HTMLInputElement).value;
    this.copyMessage = '';
  }

  initializeIframe(block: ContentIframe): void {
    block.value = new Iframe();
    this.copyMessage = '';
  }

  updateGalleryImage(
    image: Image,
    field: 'src' | 'thumbnailSrc' | 'alt' | 'camera' | 'film',
    event: Event
  ): void {
    image[field] = (event.target as HTMLInputElement).value;
    this.copyMessage = '';
  }

  updateGalleryFavorite(image: Image, event: Event): void {
    image.favorite = (event.target as HTMLInputElement).checked;
    this.copyMessage = '';
  }

  addGalleryImage(block: ContentGallery): void {
    block.value ??= [];
    block.value.push(new Image({ src: '', alt: '' }));
    this.copyMessage = '';
  }

  removeGalleryImage(block: ContentGallery, index: number): void {
    block.value?.splice(index, 1);
    this.copyMessage = '';
  }

  initializeGallery(block: ContentGallery): void {
    block.value = [];
    this.copyMessage = '';
  }

  private createContentBlock(type: ContentType): ArticleContent {
    switch (type) {
      case 'PARAGRAPH':
        return { type, value: '' };
      case 'POEM':
        return { type, value: [] };
      case 'IMAGE':
        return { type, value: '', alt: '' };
      case 'IFRAME':
        return { type, value: { src: '', width: '100%', height: '100%' }, alt: '' };
      case 'GALLERY':
        return { type, value: [] };
    }
  }

  drop(event: CdkDragDrop<ArticleContent[]>): void {
    if (!this.selectedPage) {
      return;
    }

    moveItemInArray(this.selectedPage.content, event.previousIndex, event.currentIndex);
    this.expandedBlockIndex = -1;
    this.copyMessage = '';
  }

  moveBlock(index: number, offset: number): void {
    if (!this.selectedPage) {
      return;
    }

    const destination = index + offset;
    if (destination < 0 || destination >= this.selectedPage.content.length) {
      return;
    }

    moveItemInArray(this.selectedPage.content, index, destination);
    this.expandedBlockIndex = -1;
    this.copyMessage = '';
  }

  blockPreview(block: ArticleContent): string {
    return typeof block.value === 'string' ? block.value : JSON.stringify(block.value) ?? '';
  }

  get jsonOutput(): string {
    return this.selectedArticle ? JSON.stringify(this.selectedArticle, null, 2) : '';
  }

  async copyJson(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.jsonOutput);
      this.copyMessage = 'JSON copied to clipboard.';
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Clipboard access is unavailable.';
      this.copyMessage = `Copy failed (${detail}). Select and copy the JSON manually.`;
    }
  }
}
