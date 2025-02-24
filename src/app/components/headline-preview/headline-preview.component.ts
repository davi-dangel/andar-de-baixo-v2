import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HeadLine } from '../../models/headline.model';

@Component({
  selector: 'app-headline-preview',
  standalone: true,
  imports: [],
  templateUrl: './headline-preview.component.html',
  styleUrl: './headline-preview.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeadlinePreviewComponent{
  @Input("headline") headline: HeadLine | null = null;
}
