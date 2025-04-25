import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { ParagraphComponent } from './components/paragraph/paragraph.component';
import { PoemComponent } from './components/poem/poem.component';
import { ImageComponent } from './components/image/image.component';
import { IframeComponent } from './components/iframe/iframe.component';
import { GalleryComponent } from './components/gallery/gallery.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [ParagraphComponent, PoemComponent, ImageComponent, IframeComponent, GalleryComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit{
  public article: any

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.article = this.dataService.Get(id);


    

  }
}
