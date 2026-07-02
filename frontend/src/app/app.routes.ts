import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';

import { TodoDetailPage } from './pages/todo-detail-page/todo-detail-page';
import { TodoListPage } from './pages/todo-list-page/todo-list-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardPage,
  },
  {
    path: 'lists',
    component: TodoListPage,
  },
  {
    path: 'lists/:listId',
    component: TodoDetailPage,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
