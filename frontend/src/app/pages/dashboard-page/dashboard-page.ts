import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Todo, TodoStats } from '../../models/todo.model';
import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private readonly todoService = inject(TodoService);
  private readonly todoListService = inject(TodoListService);

  readonly stats = signal<TodoStats | null>(null);
  readonly lists = signal<TodoList[]>([]);
  readonly todos = signal<Todo[]>([]);
  readonly loadingStats = signal(false);
  readonly loadingLists = signal(false);
  readonly loadingTodos = signal(false);
  readonly errorMessage = signal('');

  readonly today = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  readonly totalLists = computed(() => this.lists().length);
  readonly latestLists = computed(() => this.lists().slice(0, 4));
  readonly recentTodos = computed(() => this.todos().slice(0, 5));

  readonly totalTodos = computed(() => this.stats()?.totalTodos ?? this.todos().length);
  readonly completedTodos = computed(() => this.stats()?.completedTodos ?? this.todos().filter((todo) => todo.completed).length);
  readonly openTodos = computed(() => this.stats()?.openTodos ?? this.todos().filter((todo) => !todo.completed).length);
  readonly completionRate = computed(() => {
    const total = this.totalTodos();

    if (total === 0) {
      return 0;
    }

    return Math.round((this.completedTodos() / total) * 100);
  });

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadStats();
    this.loadLists();
    this.loadTodos();
  }

  getListName(listId: number): string {
    return this.lists().find((list) => list.id === listId)?.name ?? 'Liste';
  }

  getListProgress(list: TodoList): number {
    const total = list.totalTodos ?? 0;

    if (total === 0) {
      return 0;
    }

    return Math.round(((list.completedTodos ?? 0) / total) * 100);
  }

  private loadStats(): void {
    this.loadingStats.set(true);
    this.errorMessage.set('');

    this.todoService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loadingStats.set(false);
      },
      error: () => {
        this.stats.set(null);
        this.loadingStats.set(false);
        this.errorMessage.set('Die Dashboard-Statistiken konnten nicht geladen werden.');
      },
    });
  }

  private loadLists(): void {
    this.loadingLists.set(true);

    this.todoListService.getLists().subscribe({
      next: (lists) => {
        this.lists.set(lists);
        this.loadingLists.set(false);
      },
      error: () => {
        this.lists.set([]);
        this.loadingLists.set(false);
        this.errorMessage.set('Die Listen konnten nicht geladen werden.');
      },
    });
  }

  private loadTodos(): void {
    this.loadingTodos.set(true);

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loadingTodos.set(false);
      },
      error: () => {
        this.todos.set([]);
        this.loadingTodos.set(false);
        this.errorMessage.set('Die aktuellen Aufgaben konnten nicht geladen werden.');
      },
    });
  }
}
