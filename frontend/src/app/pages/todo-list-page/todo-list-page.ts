import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, forkJoin, of, switchMap } from 'rxjs';

import { TodoList } from '../../models/todo-list.model';
import { Todo, TodoCategory } from '../../models/todo.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list-page.html',
  styleUrl: './todo-list-page.css',
})
export class TodoListPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  list: TodoList | null = null;
  todos: Todo[] = [];

  loading = false;
  todosLoading = false;
  savingTodo = false;

  errorMessage = '';
  todoErrorMessage = '';

  showCreateTodoModal = false;

  newTodoTitle = '';
  newTodoDescription = '';
  newTodoCategory: TodoCategory = 'UNI';
  updatingTodoIds = new Set<number>();
  private selectedListId: number | null = null;

  readonly categories: { value: TodoCategory; label: string }[] = [
    { value: 'ARBEIT', label: 'Arbeit' },
    { value: 'PRIVAT', label: 'Privat' },
    { value: 'UNI', label: 'Uni' },
    { value: 'EINKAUF', label: 'Einkauf' },
    { value: 'GESUNDHEIT', label: 'Gesundheit' },
    { value: 'FINANZEN', label: 'Finanzen' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly todoListService: TodoListService,
    private readonly todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.todoListService.lists$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lists) => {
        if (!this.list) {
          return;
        }

        const updatedList = lists.find((list) => list.id === this.list?.id);

        if (updatedList) {
          this.list = updatedList;
        }
      });

    this.todoService.todosByList$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((todosByList) => {
        if (!this.selectedListId) {
          return;
        }

        const cachedTodos = todosByList[this.selectedListId];

        if (cachedTodos) {
          this.todos = cachedTodos;
        }
      });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const listId = Number(params.get('listId'));

          if (!listId) {
            this.selectedListId = null;
            this.list = null;
            this.todos = [];
            this.loading = false;
            this.todosLoading = false;
            this.errorMessage = '';
            this.todoErrorMessage = '';
            return of(null);
          }

          this.selectedListId = listId;
          const cachedList = this.todoListService.getCachedListById(listId);

          if (cachedList) {
            this.list = cachedList;
            this.loading = false;
            this.errorMessage = '';
          } else {
            this.list = null;
          }

          const cachedTodos = this.todoService.getCachedTodosByListId(listId);
          this.todos = cachedTodos;

          this.loading = !cachedList;
          this.todosLoading = cachedTodos.length === 0;
          this.errorMessage = '';
          this.todoErrorMessage = '';

          return forkJoin({
            list: this.todoListService.getListById(listId).pipe(
              catchError(() => {
                this.errorMessage = 'Die Liste konnte nicht geladen werden.';
                return of(null);
              }),
            ),
            todos: this.todoService.getTodosByListId(listId).pipe(
              catchError(() => {
                this.todoErrorMessage = 'Die Todos konnten nicht geladen werden.';
                return of(null);
              }),
            ),
          }).pipe(
            finalize(() => {
              if (this.selectedListId === listId) {
                this.loading = false;
                this.todosLoading = false;
              }
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result || !this.selectedListId) {
          return;
        }

        if (result.list && result.list.id === this.selectedListId) {
          this.list = result.list;
        }

        if (result.todos) {
          this.todos = result.todos;
        }
      });
  }

  openCreateTodoModal(): void {
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.newTodoCategory = 'UNI';
    this.todoErrorMessage = '';
    this.showCreateTodoModal = true;
  }

  closeCreateTodoModal(): void {
    if (this.savingTodo) {
      return;
    }

    this.showCreateTodoModal = false;
  }

  createTodo(): void {
    if (!this.list || !this.newTodoTitle.trim()) {
      return;
    }

    const listId = this.list.id;
    const title = this.newTodoTitle.trim();
    const description = this.newTodoDescription.trim() || null;
    const category = this.newTodoCategory;

    this.savingTodo = true;
    this.todoErrorMessage = '';
    this.showCreateTodoModal = false;
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.newTodoCategory = 'UNI';

    this.todoService
      .createTodo({
        title,
        description,
        category,
        listId: listId,
      })
      .pipe(finalize(() => {
        this.savingTodo = false;
      }))
      .subscribe({
        next: () => {
          this.reloadCurrentTodos(listId);
          this.refreshCurrentList(listId);
        },
        error: (error) => {
          this.todoErrorMessage = this.getErrorMessage(error, 'Das Todo konnte nicht erstellt werden.');
        },
      });
  }

  get progressPercent(): number {
    if (!this.list || this.list.totalTodos === 0) {
      return 0;
    }

    return Math.round((this.list.completedTodos / this.list.totalTodos) * 100);
  }

  toggleTodo(todo: Todo): void {
    if (!this.list) {
      return;
    }

    const listId = this.list.id;
    this.updatingTodoIds.add(todo.id);

    this.todoService.toggleTodo(todo.id).subscribe({
      next: () => {
        this.reloadCurrentTodos(listId);
        this.updatingTodoIds.delete(todo.id);
        this.refreshCurrentList(listId);
      },
      error: () => {
        this.updatingTodoIds.delete(todo.id);
        this.todoErrorMessage = 'Das Todo konnte nicht aktualisiert werden.';
      },
    });
  }

  isTodoUpdating(todo: Todo): boolean {
    return this.updatingTodoIds.has(todo.id);
  }

  private reloadCurrentTodos(listId: number): void {
    this.todoService.getTodosByListId(listId).subscribe({
      next: (todos) => {
        if (this.selectedListId !== listId) {
          return;
        }

        this.todos = todos;
      },
      error: () => {
        this.todoErrorMessage = 'Die Todos konnten nicht neu geladen werden.';
      },
    });
  }

  private refreshCurrentList(listId: number): void {
    this.todoListService.getListById(listId).subscribe({
      next: (list) => {
        if (this.selectedListId !== listId) {
          return;
        }

        this.list = list;
      },
      error: () => {
        this.todoErrorMessage = 'Die Listen-Zahlen konnten nicht aktualisiert werden.';
      },
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'name' in error && (error as { name?: unknown }).name === 'TimeoutError') {
      return 'Der Server antwortet nicht. Prüfe, ob Backend und Datenbank laufen.';
    }

    if (typeof error === 'object' && error !== null && 'error' in error) {
      const responseBody = (error as { error?: unknown }).error;

      if (typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody) {
        const message = (responseBody as { message?: unknown }).message;

        if (typeof message === 'string' && message.trim()) {
          return message;
        }
      }
    }

    return fallback;
  }
}
