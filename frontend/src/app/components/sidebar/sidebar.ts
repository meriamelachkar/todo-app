import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private readonly todoListService = inject(TodoListService);

  readonly recentLists = signal<TodoList[]>([]);

  ngOnInit(): void {
    this.todoListService.getLists().subscribe({
      next: (lists) => {
        const newestLists = [...lists]
          .sort((firstList, secondList) => secondList.id - firstList.id)
          .slice(0, 4);

        this.recentLists.set(newestLists);
      },
      error: () => {
        this.recentLists.set([]);
      },
    });
  }

  getListIcon(listId: number): string {
    const savedIcons = localStorage.getItem('todo-list-icons');

    if (!savedIcons) {
      return '📋';
    }

    try {
      const icons = JSON.parse(savedIcons) as Record<number, string>;
      return icons[listId] ?? '📋';
    } catch {
      return '📋';
    }
  }
}
