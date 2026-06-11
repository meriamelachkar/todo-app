import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-todo-list-page',
  imports: [CommonModule],
  templateUrl: './todo-list-page.html',
  styleUrl: './todo-list-page.css',
})
export class TodoListPage implements OnInit {
  list: TodoList | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly todoListService: TodoListService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const listId = Number(params.get('listId'));

      if (!listId) {
        this.list = null;
        return;
      }

      this.loadList(listId);
    });
  }

  private loadList(listId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.todoListService.getListById(listId).subscribe({
      next: (list) => {
        this.list = list;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Liste konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  get progressPercent(): number {
    if (!this.list || this.list.totalTodos === 0) {
      return 0;
    }

    return Math.round((this.list.completedTodos / this.list.totalTodos) * 100);
  }
}
