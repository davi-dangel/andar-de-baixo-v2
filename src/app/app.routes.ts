import { Routes } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { ArticleComponent } from './components/article/article.component';

export const routes: Routes = [
    { path: "article/:id", component: ArticleComponent },
    { path: '', component: FeedComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];