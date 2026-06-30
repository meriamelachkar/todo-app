import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-todo-list-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './todo-list-page.html',
  styleUrl: './todo-list-page.css',
})
export class TodoListPage {
  private readonly todoListService = inject(TodoListService);
  private readonly router = inject(Router);

  readonly lists = signal<TodoList[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly createErrorMessage = signal('');

  readonly newListName = signal('');
  readonly newListDescription = signal('');

  constructor() {
    this.loadLists();
  }

  loadLists(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.todoListService.getLists().subscribe({
      next: (lists) => {
        this.lists.set(lists);
        this.loading.set(false);
      },
      error: () => {
        this.lists.set([]);
        this.loading.set(false);
        this.errorMessage.set('Die Listen konnten nicht geladen werden. Prüfe, ob Backend und Datenbank laufen.');
      },
    });
  }

  createList(): void {
    const name = this.newListName().trim();
    const description = this.newListDescription().trim() || null;

    if (!name) {
      this.createErrorMessage.set('Bitte gib einen Namen für die Liste ein.');
      return;
    }

    this.saving.set(true);
    this.createErrorMessage.set('');

    this.todoListService.createList({ name, description }).subscribe({
      next: (createdList) => {
        this.newListName.set('');
        this.newListDescription.set('');
        this.saving.set(false);
        this.loadLists();
        void this.router.navigate(['/lists', createdList.id]);
      },
      error: () => {
        this.saving.set(false);
        this.createErrorMessage.set('Die Liste konnte nicht erstellt werden.');
      },
    });
  }

  openList(list: TodoList): void {
    void this.router.navigate(['/lists', list.id]);
  }

  deleteList(list: TodoList): void {
    const confirmed = window.confirm(`Möchtest du die Liste "${list.name}" wirklich löschen?`);

    if (!confirmed) {
      return;
    }

    this.todoListService.deleteList(list.id).subscribe({
      next: () => {
        this.loadLists();
      },
      error: () => {
        this.errorMessage.set('Die Liste konnte nicht gelöscht werden.');
      },
    });
  }
}
