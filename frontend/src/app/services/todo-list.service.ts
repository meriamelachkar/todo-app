
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, shareReplay, tap, timeout } from 'rxjs';
import {
  CreateTodoListRequest,
  TodoList,
  UpdateTodoListRequest
} from '../models/todo-list.model';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private readonly apiUrl = '/api/lists';
  private readonly requestTimeoutMs = 10000;
  private readonly listsSubject = new BehaviorSubject<TodoList[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string>('');
  private listsLoaded = false;
  private loadListsRequest$: Observable<TodoList[]> | null = null;

  readonly lists$ = this.listsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadListsOnce(): void {
    if (this.listsLoaded || this.loadListsRequest$) {
      return;
    }

    this.loadLists();
  }

  loadLists(): void {
    if (this.loadListsRequest$) {
      return;
    }

    this.loadListsRequest$ = this.fetchLists();
    this.errorSubject.next('');
    this.loadingSubject.next(true);

    this.loadListsRequest$.pipe(
      finalize(() => {
        this.loadListsRequest$ = null;
        this.loadingSubject.next(false);
      }),
    )
    .subscribe({
      next: () => {},
      error: () => {
        this.errorSubject.next('Die Listen konnten nicht geladen werden.');
      },
    });
  }

  getLists(): Observable<TodoList[]> {
    return this.fetchLists();
  }

  getListById(id: number): Observable<TodoList> {
    return this.http.get<TodoList>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      tap((list) => this.upsertCachedList(list)),
    );
  }

  getCachedListById(id: number): TodoList | undefined {
    return this.listsSubject.value.find((list) => list.id === id);
  }

  createList(request: CreateTodoListRequest): Observable<TodoList> {
    return this.http.post<TodoList>(this.apiUrl, request).pipe(
      timeout(this.requestTimeoutMs),
      tap((createdList) => {
        const lists = this.listsSubject.value.filter((list) => list.id !== createdList.id);
        this.listsSubject.next([createdList, ...lists]);
        this.listsLoaded = true;
        this.errorSubject.next('');
      }),
    );
  }

  updateList(id: number, request: UpdateTodoListRequest): Observable<TodoList> {
    return this.http.put<TodoList>(`${this.apiUrl}/${id}`, request).pipe(
      timeout(this.requestTimeoutMs),
      tap((updatedList) => this.upsertCachedList(updatedList)),
    );
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      tap(() => {
        this.listsSubject.next(this.listsSubject.value.filter((list) => list.id !== id));
      }),
    );
  }

  updateCachedList(list: TodoList): void {
    this.upsertCachedList(list);
  }

  reloadLists(): void {
    this.listsLoaded = false;
    this.loadLists();
  }

  private fetchLists(): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(this.apiUrl).pipe(
      timeout(this.requestTimeoutMs),
      tap((lists) => {
        this.listsSubject.next(lists);
        this.listsLoaded = true;
        this.errorSubject.next('');
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  private upsertCachedList(list: TodoList): void {
    const lists = this.listsSubject.value;
    const index = lists.findIndex((cachedList) => cachedList.id === list.id);

    if (index === -1) {
      this.listsSubject.next([list, ...lists]);
      this.listsLoaded = true;
      this.errorSubject.next('');
      return;
    }

    this.listsSubject.next([
      ...lists.slice(0, index),
      list,
      ...lists.slice(index + 1),
    ]);

    this.listsLoaded = true;
    this.errorSubject.next('');
  }
}
