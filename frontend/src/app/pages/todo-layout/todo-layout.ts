import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, finalize } from 'rxjs';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-todo-layout',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './todo-layout.html',
  styleUrl: './todo-layout.css',
})
export class TodoLayout implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  lists: TodoList[] = [];
  loading = false;
  errorMessage = '';
  createListDialogOpen = false;
  newListTitle = '';
  creatingList = false;
  createListErrorMessage = '';
  currentUrl = '';

  constructor(
    private readonly todoListService: TodoListService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl = event.urlAfterRedirects;
      });

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

    this.todoListService.loadListsOnce();
  }

  openCreateListDialog(): void {
    this.createListDialogOpen = true;
    this.newListTitle = '';
    this.createListErrorMessage = '';
  }

  closeCreateListDialog(): void {
    if (this.creatingList) {
      return;
    }

    this.createListDialogOpen = false;
    this.newListTitle = '';
    this.createListErrorMessage = '';
  }

  createList(): void {
    const title = this.newListTitle.trim();

    if (!title) {
      this.createListErrorMessage = 'Bitte gib einen Namen für die Liste ein.';
      return;
    }

    this.creatingList = true;
    this.createListErrorMessage = '';
    this.createListDialogOpen = false;
    this.newListTitle = '';

    this.todoListService.createList({ name: title, description: '' })
      .pipe(finalize(() => {
        this.creatingList = false;
      }))
      .subscribe({
        next: (createdList) => {
          this.createListErrorMessage = '';
          void this.router.navigate(['/todo-list', createdList.id]);
        },
        error: (error) => {
          this.createListErrorMessage = this.getErrorMessage(error, 'Die Liste konnte nicht erstellt werden.');
        },
      });
  }

  navigateToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  navigateToList(listId: number): void {
    void this.router.navigate(['/todo-list', listId]);
  }

  isDashboardActive(): boolean {
    return this.currentUrl === '/dashboard' || this.currentUrl === '/';
  }

  isListActive(listId: number): boolean {
    return this.currentUrl === `/todo-list/${listId}`;
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
