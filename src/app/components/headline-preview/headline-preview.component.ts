import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  RendererStyleFlags2,
  ViewEncapsulation
} from '@angular/core';
import { HeadLine } from '../../models/headline.model';

@Component({
  selector: 'app-headline-preview',
  standalone: true,
  imports: [],
  templateUrl: './headline-preview.component.html',
  styleUrl: './headline-preview.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeadlinePreviewComponent implements AfterViewInit, OnDestroy {
  @Input("headline") headline: HeadLine | null = null;

  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const card = this.host.nativeElement.querySelector<HTMLElement>('.edition-card');
    const grid = this.host.nativeElement.parentElement;
    if (!card || !grid) {
      return;
    }

    this.renderer.addClass(grid, 'masonry-ready');
    this.resizeObserver = new ResizeObserver(() => this.updateRowSpan(card, grid));
    this.resizeObserver.observe(card);
    this.updateRowSpan(card, grid);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private updateRowSpan(card: HTMLElement, grid: HTMLElement): void {
    const gridStyle = getComputedStyle(grid);
    const rowHeight = Number.parseFloat(gridStyle.gridAutoRows);
    const rowGap = Number.parseFloat(gridStyle.rowGap) || 0;
    if (!Number.isFinite(rowHeight) || rowHeight <= 0) {
      return;
    }

    const span = Math.ceil((card.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    this.renderer.setStyle(
      this.host.nativeElement,
      'grid-row-end',
      `span ${span}`,
      RendererStyleFlags2.DashCase
    );
  }
}
