import { Routes } from '@angular/router';
import { TodoLayout } from './pages/todo-layout/todo-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo-list',
    pathMatch: 'full',
  },
  {
    path: 'todo-list',
    component: TodoLayout,
  },
  {
    path: 'todo-list/:listId',
    component: TodoLayout,
  },
  {
    path: '**',
    redirectTo: 'todo-list',
  },
];
