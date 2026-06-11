

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateTodoListRequest,
  TodoList,
  UpdateTodoListRequest
} from '../models/todo-list.model';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private readonly apiUrl = 'http://localhost:8080/api/lists';

  constructor(private readonly http: HttpClient) {}

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
