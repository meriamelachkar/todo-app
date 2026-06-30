import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, timeout } from 'rxjs';

import { CreateTodoRequest, Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl = '/api/todos';
  private readonly requestTimeoutMs = 10000;
  private readonly todosByListSubject = new BehaviorSubject<Record<number, Todo[]>>({});

  readonly todosByList$ = this.todosByListSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getTodosByListId(listId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}?listId=${listId}`).pipe(
      timeout(this.requestTimeoutMs),
      tap((todos) => this.setCachedTodos(listId, todos)),
    );
  }

  getCachedTodosByListId(listId: number): Todo[] {
    return this.todosByListSubject.value[listId] ?? [];
  }

  createTodo(request: CreateTodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, request).pipe(
      timeout(this.requestTimeoutMs),
      tap((createdTodo) => {
        const todos = this.getCachedTodosByListId(createdTodo.listId);
        this.setCachedTodos(createdTodo.listId, [createdTodo, ...todos.filter((todo) => todo.id !== createdTodo.id)]);
      }),
    );
  }

  toggleTodo(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      timeout(this.requestTimeoutMs),
      tap((updatedTodo) => {
        const todos = this.getCachedTodosByListId(updatedTodo.listId);
        this.setCachedTodos(
          updatedTodo.listId,
          todos.map((todo) => todo.id === updatedTodo.id ? updatedTodo : todo),
        );
      }),
    );
  }

  private setCachedTodos(listId: number, todos: Todo[]): void {
    this.todosByListSubject.next({
      ...this.todosByListSubject.value,
      [listId]: todos,
    });
  }
}
