import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoListPage } from '../todo-list-page/todo-list-page';

@Component({
  selector: 'app-todo-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, TodoListPage],
  templateUrl: './todo-layout.html',
  styleUrl: './todo-layout.css',
})
export class TodoLayout implements OnInit {
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
        this.errorMessage = 'Die Listen konnten nicht geladen werden.';
        this.loading = false;
      }
    });
  }
}
