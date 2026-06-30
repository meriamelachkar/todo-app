import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  lists: TodoList[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private readonly todoListService: TodoListService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.todoListService.lists$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lists) => {
        this.lists = lists;
      });

    this.todoListService.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.todoListService.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        this.errorMessage = error;
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

  navigateToLists(): void {
    void this.router.navigate(['/todo-list']);
  }

  navigateToList(listId: number): void {
    void this.router.navigate(['/todo-list', listId]);
  }
}
