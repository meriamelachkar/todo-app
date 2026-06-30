import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { TodoLayout } from './pages/todo-layout/todo-layout';
import { TodoListPage } from './pages/todo-list-page/todo-list-page';

export const routes: Routes = [
  {
    path: '',
    component: TodoLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'todo-list',
        component: TodoListPage,
      },
      {
        path: 'todo-list/:listId',
        component: TodoListPage,
      },
      {
        path: 'dashboard',
        component: DashboardPage,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
