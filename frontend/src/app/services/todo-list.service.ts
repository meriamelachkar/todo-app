

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TodoList } from '../models/todo-list.model';

export interface CreateTodoListRequest {
  name: string;
  description?: string | null;
}

export interface UpdateTodoListRequest {
  name: string;
  description?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/lists';

  getLists(): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(this.apiUrl);
  }

  getListById(id: number): Observable<TodoList> {
    return this.http.get<TodoList>(`${this.apiUrl}/${id}`);
  }

  createList(request: CreateTodoListRequest): Observable<TodoList> {
    return this.http.post<TodoList>(this.apiUrl, request);
  }

  updateList(id: number, request: UpdateTodoListRequest): Observable<TodoList> {
    return this.http.put<TodoList>(`${this.apiUrl}/${id}`, request);
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
