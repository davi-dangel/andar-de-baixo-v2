import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-headline-preview',
  standalone: true,
  imports: [],
  templateUrl: './headline-preview.component.html',
  styleUrl: './headline-preview.component.css'
})
export class HeadlinePreviewComponent implements OnInit{
  @Input("title") title: string = "Title";
  @Input("subtitle") subtitle: string|null = "Subtitle";
  @Input("img") img: string|null = null;
  @Input("abstract") abstract: string|null = "It was this, as much as anything, that gave people courage, and I suppose the new arrivals from Woking also helped to restore confidence. At any rate, as the dusk came on a slow, intermittent movement upon the sand pits began, a movement that seemed to gather force as the stillness of the evening about the cylinder remained unbroken. Vertical black figures in twos and threes would advance, stop, watch, and advance again, spreading out as they did so in a thin irregular crescent that promised to enclose the pit in its attenuated horns. I, too, on my side began to move towards the pit.";

  ngOnInit(): void {
    console.log("IMAGE: ", this.img);
  }
}
