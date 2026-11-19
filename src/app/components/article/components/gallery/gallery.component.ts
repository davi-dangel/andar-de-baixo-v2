import { Component, Input, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ContentGallery } from '../../../../models/content-gallery.model';

interface GalleryItem {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
  camera: string | null;
  film: string | null;
  favorite: boolean | null;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit{
  @Input() value: ContentGallery | null = null;

  displayCustom: boolean = false;

  private readonly imageBatchSize = 48;
  images: GalleryItem[] = [];
  displayedImages: GalleryItem[] = [];

  activeIndex: number = 0;
  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

ngOnInit() {
    if (this.value?.value) {
      this.images = this.value.value.map(image => {
        return {
          itemImageSrc: image.src,
          thumbnailImageSrc: image.thumbnailSrc || image.src,
          alt: image.alt,
          title: image.alt,
          camera: image.camera || null,
          film: image.film || null,
          favorite: image.favorite || null
        };
      });
      this.displayedImages = this.images.slice(0, this.imageBatchSize);
    }
  }

loadMoreImages() {
  const nextBatch = this.images.slice(
    this.displayedImages.length,
    this.displayedImages.length + this.imageBatchSize
  );
  this.displayedImages = [...this.displayedImages, ...nextBatch];
}

imageClick(index: number) {
  this.activeIndex = this.images.indexOf(this.displayedImages[index]);
  this.displayCustom = !this.displayCustom;
}
}
