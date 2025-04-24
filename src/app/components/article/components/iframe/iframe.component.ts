import { Component, Input, OnInit } from '@angular/core';
import { SafePipe } from '../../../../pipes/safe.pipe';

@Component({
  selector: 'app-iframe',
  standalone: true,
  imports: [SafePipe],
  templateUrl: './iframe.component.html',
  styleUrl: './iframe.component.css'
})
export class IframeComponent implements OnInit {
  ngOnInit(): void {
    console.log("VALUE: ", this.iframe);
    console.log("URL: ", this.iframe.value.src);
  }
  @Input() iframe: any | null = null;
}
