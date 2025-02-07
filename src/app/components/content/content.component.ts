import { Component } from '@angular/core';
import { HeadlinePreviewComponent } from '../headline-preview/headline-preview.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [HeadlinePreviewComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}
