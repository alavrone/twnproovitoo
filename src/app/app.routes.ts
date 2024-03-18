import { Routes } from '@angular/router';
import { ArticleComponent } from './article/article.component';
import { TableComponent } from './table/table.component';
import { HomeComponent } from './home/home.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { Component } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'article',
    component: ArticleComponent,
    children: [
      {
        path: ':id',
        component: ArticleComponent,
      },
    ],
  },
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: 'game',
    component: GameBoardComponent,
  },
];
