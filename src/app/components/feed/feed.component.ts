import { Component, OnInit } from '@angular/core';
import { HeadlinePreviewComponent } from '../headline-preview/headline-preview.component';
import { Router } from '@angular/router';
import { HeadLine } from '../../models/headline.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [HeadlinePreviewComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit{
  public headlines: HeadLine[] = []

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.headlines = this.dataService.GetAll().reverse();
  }

  public openFullContent(id: number){
    this.router.navigate(['/article', id]);
  }
}
