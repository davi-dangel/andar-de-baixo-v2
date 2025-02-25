import { Component, Input, OnInit } from '@angular/core';
import { ContentImage } from '../../../../models/content-image.model';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent{
  @Input() value: ContentImage | null = null;
}
