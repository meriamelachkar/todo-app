import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
  private readonly router = inject(Router);

  readonly stats = signal<TodoStats | null>(null);
  readonly lists = signal<TodoList[]>([]);
  readonly todos = signal<Todo[]>([]);
  readonly loadingStats = signal(false);
  readonly loadingLists = signal(false);
  readonly loadingTodos = signal(false);
  readonly errorMessage = signal('');
  readonly searchQuery = signal('');

  readonly today = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  readonly totalLists = computed(() => this.lists().length);
  readonly latestLists = computed(() => this.lists().slice(0, 4));
  readonly recentTodos = computed(() => this.todos().slice(0, 5));
  readonly searchResults = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return [];
    }

    const listResults = this.lists()
      .filter((list) => list.name.toLowerCase().includes(query))
      .slice(0, 4)
      .map((list) => ({
        id: list.id,
        title: list.name,
        label: 'Liste',
        route: ['/lists', list.id],
        queryParams: { highlightListTitle: 'true' },
      }));

    const todoResults = this.todos()
      .filter((todo) =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description ?? '').toLowerCase().includes(query) ||
        (todo.category ?? '').toLowerCase().includes(query) ||
        (todo.priority ?? '').toLowerCase().includes(query),
      )
      .slice(0, 6)
      .map((todo) => ({
        id: todo.id,
        title: todo.title,
        label: 'Aufgabe',
        route: ['/lists', todo.listId],
        queryParams: { highlightTodoId: todo.id },
      }));

    return [...listResults, ...todoResults].slice(0, 8);
  });

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

  updateSearchQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  openSearchResult(result: { route: (string | number)[]; queryParams?: Record<string, string | number> }): void {
    this.searchQuery.set('');
    void this.router.navigate(result.route, { queryParams: result.queryParams });
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

  toggleTodo(todo: Todo): void {
    this.todoService.toggleTodo(todo.id).subscribe({
      next: () => {
        this.loadStats();
        this.loadLists();
        this.loadTodos();
      },
      error: () => {
        this.errorMessage.set('Die Aufgabe konnte nicht aktualisiert werden.');
      },
    });
  }
}
