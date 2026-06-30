

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Todo, TodoCategory, TodoPriority, TodoStats } from '../models/todo.model';

export interface CreateTodoRequest {
  title: string;
  description?: string | null;
  listId: number;
  completed?: boolean;
  priority?: TodoPriority;
  category?: TodoCategory;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string | null;
  listId: number;
  completed: boolean;
  priority?: TodoPriority;
  category?: TodoCategory;
}

export interface TodoFilter {
  listId?: number;
  completed?: boolean;
  priority?: TodoPriority;
  category?: TodoCategory;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/todos';

  getTodos(filter?: TodoFilter): Observable<Todo[]> {
    let params = new HttpParams();

    if (filter?.listId !== undefined) {
      params = params.set('listId', filter.listId);
    }

    if (filter?.completed !== undefined) {
      params = params.set('completed', filter.completed);
    }

    if (filter?.priority) {
      params = params.set('priority', filter.priority);
    }

    if (filter?.category) {
      params = params.set('category', filter.category);
    }

    return this.http.get<Todo[]>(this.apiUrl, { params });
  }

  getTodosByListId(listId: number): Observable<Todo[]> {
    return this.getTodos({ listId });
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(request: CreateTodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, request);
  }

  updateTodo(id: number, request: UpdateTodoRequest): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, request);
  }

  toggleTodo(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<TodoStats> {
    return this.http.get<TodoStats>(`${this.apiUrl}/stats`);
  }

  getCategories(): Observable<TodoCategory[]> {
    return this.http.get<TodoCategory[]>(`${this.apiUrl}/categories`);
  }
}
