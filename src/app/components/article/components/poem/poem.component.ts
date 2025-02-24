import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-poem',
  standalone: true,
  imports: [],
  templateUrl: './poem.component.html',
  styleUrl: './poem.component.css'
})
export class PoemComponent {
  @Input() value: string[] = [];
}
