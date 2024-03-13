import { Routes } from '@angular/router';
import { ArticleComponent } from './article/article.component';
import { TableComponent } from './table/table.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'article',
    component: ArticleComponent,
  },
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
