import { Component, Input, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ContentGallery } from '../../../../models/content-gallery.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit{
  @Input() value: ContentGallery | null = null;

  displayCustom: boolean = false;

  images: any[] = []

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
      this.images = this.value.value.map((image: any) => {
        return {
          itemImageSrc: image.src,
          thumbnailImageSrc: image.src,
          alt: image.alt,
          title: image.alt
        };
      });
    }
  }

imageClick(index: number) {
  this.activeIndex = index;
  this.displayCustom = !this.displayCustom;
}
}
