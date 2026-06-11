import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  lists: TodoList[] = [];
  loading = false;
  errorMessage = '';

  constructor(private readonly todoListService: TodoListService) {}

  ngOnInit(): void {
    this.loadLists();
  }

  private loadLists(): void {
    this.loading = true;
    this.errorMessage = '';

    this.todoListService.getLists().subscribe({
      next: lists => {
        this.lists = lists;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Dashboard-Daten konnten nicht geladen werden.';
        this.loading = false;
      }
    });
  }

  get totalLists(): number {
    return this.lists.length;
  }

  get totalTodos(): number {
    return this.lists.reduce((sum, list) => sum + list.totalTodos, 0);
  }

  get completedTodos(): number {
    return this.lists.reduce((sum, list) => sum + list.completedTodos, 0);
  }

  get openTodos(): number {
    return this.totalTodos - this.completedTodos;
  }

  get progressPercent(): number {
    if (this.totalTodos === 0) {
      return 0;
    }

    return Math.round((this.completedTodos / this.totalTodos) * 100);
  }
}
