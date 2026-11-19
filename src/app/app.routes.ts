import { Routes } from '@angular/router';
import { isDevMode } from '@angular/core';
import { FeedComponent } from './components/feed/feed.component';
import { ArticleComponent } from './components/article/article.component';
import { PostDesignerComponent } from './components/post-designer/post-designer.component';

export const routes: Routes = [
    { path: 'developer/post-designer', component: PostDesignerComponent, canMatch: [() => isDevMode()] },
    { path: "article/:id", component: ArticleComponent },
    { path: '', component: FeedComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];