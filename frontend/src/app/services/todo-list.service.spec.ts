import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { TodoListService, CreateTodoListRequest, UpdateTodoListRequest } from './todo-list.service';
import { TodoList } from '../models/todo-list.model';

describe('TodoListService', () => {
  let service: TodoListService;
  let httpMock: HttpTestingController;

  const apiUrl = '/api/lists';

  const mockLists: TodoList[] = [
    {
      id: 1,
      name: 'Uni',
      description: 'Aufgaben für die Uni',
      todos: [],
    },
    {
      id: 2,
      name: 'Privat',
      description: 'Private Aufgaben',
      todos: [],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todo lists', () => {
    service.getLists().subscribe((lists) => {
      expect(lists).toEqual(mockLists);
      expect(lists.length).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.method).toBe('GET');

    req.flush(mockLists);
  });

  it('should get one todo list by id', () => {
    const mockList = mockLists[0];

    service.getListById(1).subscribe((list) => {
      expect(list).toEqual(mockList);
      expect(list.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockList);
  });

  it('should create a todo list', () => {
    const request: CreateTodoListRequest = {
      name: 'Neue Liste',
      description: 'Neue Beschreibung',
    };

    const createdList: TodoList = {
      id: 3,
      name: request.name,
      description: request.description,
      todos: [],
    };

    service.createList(request).subscribe((list) => {
      expect(list).toEqual(createdList);
      expect(list.name).toBe(request.name);
    });

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(createdList);
  });

  it('should update a todo list', () => {
    const request: UpdateTodoListRequest = {
      name: 'Bearbeitete Liste',
      description: 'Bearbeitete Beschreibung',
    };

    const updatedList: TodoList = {
      id: 1,
      name: request.name,
      description: request.description,
      todos: [],
    };

    service.updateList(1, request).subscribe((list) => {
      expect(list).toEqual(updatedList);
      expect(list.name).toBe(request.name);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);

    req.flush(updatedList);
  });

  it('should delete a todo list', () => {
    service.deleteList(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
