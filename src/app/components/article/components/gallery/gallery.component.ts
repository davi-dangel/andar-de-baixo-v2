import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ContentGallery } from '../../../../models/content-gallery.model';
import imageManifest from '../../../../../assets/gallery-images.json';

interface OptimizedImage {
  src: string;
  thumbnailSrc: string;
  srcset: string;
  width: number;
  height: number;
}

const optimizedImages: Readonly<Record<string, OptimizedImage | undefined>> = imageManifest;

interface GalleryItem {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  itemSrcset: string | null;
  thumbnailSrcset: string | null;
  width: number | null;
  height: number | null;
  thumbnailWidth: number | null;
  thumbnailHeight: number | null;
  alt: string;
  title: string;
  camera: string | null;
  film: string | null;
  favorite: boolean | null;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
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
        const full = optimizedImages[image.src];
        const thumbnailSource = image.thumbnailSrc || image.src;
        const thumbnail = optimizedImages[thumbnailSource];
        return {
          itemImageSrc: full?.src ?? image.src,
          thumbnailImageSrc: thumbnail?.thumbnailSrc ?? thumbnailSource,
          itemSrcset: full?.srcset ?? null,
          thumbnailSrcset: thumbnail?.srcset ?? null,
          width: full?.width ?? null,
          height: full?.height ?? null,
          thumbnailWidth: thumbnail?.width ?? null,
          thumbnailHeight: thumbnail?.height ?? null,
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
