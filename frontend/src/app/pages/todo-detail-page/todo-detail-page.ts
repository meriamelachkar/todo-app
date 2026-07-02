import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { Todo, TodoCategory, TodoPriority } from '../../models/todo.model';
import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-detail-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './todo-detail-page.html',
  styleUrl: './todo-detail-page.css',
})
export class TodoDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly todoListService = inject(TodoListService);
  private readonly todoService = inject(TodoService);

  readonly listId = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('listId'))),
    ),
    { initialValue: 0 },
  );

  readonly list = signal<TodoList | null>(null);
  readonly todos = signal<Todo[]>([]);
  readonly loadingList = signal(false);
  readonly loadingTodos = signal(false);
  readonly savingTodo = signal(false);
  readonly errorMessage = signal('');
  readonly todoErrorMessage = signal('');

  readonly newTodoTitle = signal('');
  readonly newTodoDescription = signal('');
  readonly newTodoCategory = signal<TodoCategory>('UNI');
  readonly newTodoPriority = signal<TodoPriority>('MEDIUM');

  readonly todoCategories: { value: TodoCategory; label: string }[] = [
    { value: 'ARBEIT', label: 'Arbeit' },
    { value: 'PRIVAT', label: 'Privat' },
    { value: 'UNI', label: 'Uni' },
    { value: 'EINKAUF', label: 'Einkauf' },
    { value: 'GESUNDHEIT', label: 'Gesundheit' },
    { value: 'FINANZEN', label: 'Finanzen' },
  ];

  readonly completedTodos = computed(() => this.todos().filter((todo) => todo.completed).length);
  readonly openTodos = computed(() => this.todos().filter((todo) => !todo.completed).length);
  readonly totalTodos = computed(() => this.todos().length);

  constructor() {
    effect((onCleanup) => {
      const currentListId = this.listId();

      if (!currentListId) {
        this.list.set(null);
        this.todos.set([]);
        this.errorMessage.set('Keine gültige Liste ausgewählt.');
        return;
      }

      this.loadingList.set(true);
      this.loadingTodos.set(true);
      this.errorMessage.set('');
      this.todoErrorMessage.set('');

      const listSubscription = this.todoListService.getListById(currentListId).subscribe({
        next: (list) => {
          this.list.set(list);
          this.loadingList.set(false);
        },
        error: () => {
          this.list.set(null);
          this.loadingList.set(false);
          this.errorMessage.set('Die Liste konnte nicht geladen werden.');
        },
      });

      const todosSubscription = this.todoService.getTodosByListId(currentListId).subscribe({
        next: (todos) => {
          this.todos.set(todos);
          this.loadingTodos.set(false);
        },
        error: () => {
          this.todos.set([]);
          this.loadingTodos.set(false);
          this.todoErrorMessage.set('Die Todos konnten nicht geladen werden.');
        },
      });

      onCleanup(() => {
        listSubscription.unsubscribe();
        todosSubscription.unsubscribe();
      });
    });
  }

  createTodo(): void {
    const currentListId = this.listId();
    const title = this.newTodoTitle().trim();

    if (!currentListId || !title) {
      this.todoErrorMessage.set('Bitte gib einen Titel ein.');
      return;
    }

    this.savingTodo.set(true);
    this.todoErrorMessage.set('');

    this.todoService.createTodo({
      title,
      description: this.newTodoDescription().trim() || null,
      listId: currentListId,
      completed: false,
      category: this.newTodoCategory(),
      priority: this.newTodoPriority(),
    }).subscribe({
      next: () => {
        this.newTodoTitle.set('');
        this.newTodoDescription.set('');
        this.newTodoCategory.set('UNI');
        this.newTodoPriority.set('MEDIUM');
        this.savingTodo.set(false);
        this.reloadTodos(currentListId);
        this.reloadList(currentListId);
      },
      error: () => {
        this.savingTodo.set(false);
        this.todoErrorMessage.set('Das Todo konnte nicht erstellt werden.');
      },
    });
  }

  toggleTodo(todo: Todo): void {
    const currentListId = this.listId();

    if (!currentListId) {
      return;
    }

    this.todoService.toggleTodo(todo.id).subscribe({
      next: () => {
        this.reloadTodos(currentListId);
        this.reloadList(currentListId);
      },
      error: () => {
        this.todoErrorMessage.set('Das Todo konnte nicht aktualisiert werden.');
      },
    });
  }

  deleteTodo(todo: Todo): void {
    const currentListId = this.listId();

    if (!currentListId) {
      return;
    }

    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.reloadTodos(currentListId);
        this.reloadList(currentListId);
      },
      error: () => {
        this.todoErrorMessage.set('Das Todo konnte nicht gelöscht werden.');
      },
    });
  }

  private reloadList(listId: number): void {
    this.todoListService.getListById(listId).subscribe({
      next: (list) => {
        this.list.set(list);
      },
      error: () => {
        this.errorMessage.set('Die Liste konnte nicht neu geladen werden.');
      },
    });
  }

  private reloadTodos(listId: number): void {
    this.todoService.getTodosByListId(listId).subscribe({
      next: (todos) => {
        this.todos.set(todos);
      },
      error: () => {
        this.todoErrorMessage.set('Die Todos konnten nicht neu geladen werden.');
      },
    });
  }
}
