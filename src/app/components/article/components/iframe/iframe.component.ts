import { Component, Input, OnInit } from '@angular/core';
import { SafePipe } from '../../../../pipes/safe.pipe';

@Component({
  selector: 'app-iframe',
  standalone: true,
  imports: [SafePipe],
  templateUrl: './iframe.component.html',
  styleUrl: './iframe.component.css'
})
export class IframeComponent {
  @Input() iframe: any | null = null;
}
