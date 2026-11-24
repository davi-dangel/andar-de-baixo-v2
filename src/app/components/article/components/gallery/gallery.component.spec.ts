import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ContentGallery } from '../../../../models/content-gallery.model';
import imageManifest from '../../../../../assets/gallery-images.json';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent image loading', () => {
  async function createGallery(value: ContentGallery) {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();
    const fixture = TestBed.createComponent(GalleryComponent);
    fixture.componentRef.setInput('value', value);
    fixture.detectChanges();
    return fixture;
  }

  it('renders responsive thumbnails and only creates the active fullscreen image on opening', async () => {
    const [source] = Object.keys(imageManifest);
    expect(source).withContext('Run npm run images:optimize before gallery tests.').toBeDefined();
    const fixture = await createGallery(new ContentGallery({
      value: [
        { src: source, alt: 'First photo' },
        { src: source, alt: 'Second photo' }
      ]
    }));
    const optimized = fixture.componentInstance.images[0];
    const gridImage: HTMLImageElement = fixture.nativeElement.querySelector('.gallery-image');
    expect(optimized.thumbnailImageSrc).toMatch(/^gallery\/.+\.webp$/);
    expect(gridImage.getAttribute('src')).toBe(optimized.thumbnailImageSrc);
    expect(gridImage.getAttribute('srcset')).toBe(optimized.thumbnailSrcset);
    expect(gridImage.width).toBeGreaterThan(0);
    expect(gridImage.getAttribute('width')).toBe(String(optimized.width));
    expect(gridImage.getAttribute('height')).toBe(String(optimized.height));
    expect(fixture.nativeElement.querySelector('p-galleria')).toBeNull();

    fixture.componentInstance.imageClick(1);
    fixture.detectChanges();
    await fixture.whenStable();
    const fullscreenImages = document.querySelectorAll<HTMLImageElement>('.fullscreen-image');
    expect(fullscreenImages.length).toBe(1);
    expect(fullscreenImages[0].getAttribute('src')).toBe(optimized.itemImageSrc);
    expect(fullscreenImages[0].alt).toBe('Second photo');
    expect(fullscreenImages[0].loading).toBe('eager');

    fixture.componentInstance.activeIndex = 0;
    fixture.detectChanges();
    expect(document.querySelector<HTMLImageElement>('.fullscreen-image')?.alt).toBe('First photo');
    fixture.componentInstance.displayCustom = false;
    fixture.detectChanges();
    expect(document.querySelector('.fullscreen-image')).toBeNull();
  });

  it('preserves custom thumbnails, unoptimized sources, and load-more indexing', async () => {
    const fixture = await createGallery(new ContentGallery({
      value: Array.from({ length: 49 }, (_, index) => ({
        src: `original-${index}.jpg`,
        thumbnailSrc: `thumb-${index}.jpg`,
        alt: `Photo ${index}`
      }))
    }));
    const first: HTMLImageElement = fixture.nativeElement.querySelector('.gallery-image');
    expect(first.getAttribute('src')).toBe('thumb-0.jpg');
    expect(first.hasAttribute('srcset')).toBeFalse();
    expect(first.hasAttribute('width')).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('.gallery-image').length).toBe(48);

    fixture.nativeElement.querySelector('.load-more').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.gallery-image').length).toBe(49);
    expect(fixture.nativeElement.querySelector('.load-more')).toBeNull();
    fixture.componentInstance.imageClick(48);
    expect(fixture.componentInstance.activeIndex).toBe(48);
    expect(fixture.componentInstance.images[48].itemImageSrc).toBe('original-48.jpg');
  });
});
