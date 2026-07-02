import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { TodoService } from './todo.service';
import { Todo, TodoCategory, TodoPriority } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpTestingController: HttpTestingController;

  const apiUrl = '/api/todos';

  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Statistik lernen',
      description: 'Kapitel 1 wiederholen',
      completed: false,
      priority: 'HIGH' as TodoPriority,
      category: 'UNI' as TodoCategory,
      listId: 1,
    },
    {
      id: 2,
      title: 'Einkaufen',
      description: 'Gemüse und Hähnchen kaufen',
      completed: true,
      priority: 'MEDIUM' as TodoPriority,
      category: 'EINKAUF' as TodoCategory,
      listId: 2,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todos', () => {
    service.getTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
      expect(todos.length).toBe(2);
    });

    const req = httpTestingController.expectOne(apiUrl);

    expect(req.request.method).toBe('GET');

    req.flush(mockTodos);
  });

  it('should get todos with filters', () => {
    service.getTodos({ listId: 1, completed: false, priority: 'HIGH' as TodoPriority, category: 'UNI' as TodoCategory }).subscribe((todos) => {
      expect(todos).toEqual([mockTodos[0]]);
    });

    const req = httpTestingController.expectOne(
      `${apiUrl}?listId=1&completed=false&priority=HIGH&category=UNI`,
    );

    expect(req.request.method).toBe('GET');

    req.flush([mockTodos[0]]);
  });

  it('should get a todo by id', () => {
    const mockTodo = mockTodos[0];

    service.getTodoById(1).subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
      expect(todo.id).toBe(1);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockTodo);
  });

  it('should create a todo', () => {
    const request = {
      title: 'Neues Todo',
      description: 'Neue Beschreibung',
      priority: 'MEDIUM' as TodoPriority,
      category: 'UNI' as TodoCategory,
      listId: 1,
    };

    const createdTodo: Todo = {
      id: 3,
      title: 'Neues Todo',
      description: 'Neue Beschreibung',
      completed: false,
      priority: 'MEDIUM' as TodoPriority,
      category: 'UNI' as TodoCategory,
      listId: 1,
    };

    service.createTodo(request).subscribe((todo) => {
      expect(todo).toEqual(createdTodo);
      expect(todo.title).toBe(request.title);
    });

    const req = httpTestingController.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(createdTodo);
  });

  it('should update a todo', () => {
    const request = {
      title: 'Bearbeitetes Todo',
      description: 'Bearbeitete Beschreibung',
      completed: true,
      priority: 'LOW' as TodoPriority,
      category: 'PRIVAT' as TodoCategory,
      listId: 1,
    };

    const updatedTodo: Todo = {
      id: 1,
      title: 'Bearbeitetes Todo',
      description: 'Bearbeitete Beschreibung',
      completed: true,
      priority: 'LOW' as TodoPriority,
      category: 'PRIVAT' as TodoCategory,
      listId: 1,
    };

    service.updateTodo(1, request).subscribe((todo) => {
      expect(todo).toEqual(updatedTodo);
      expect(todo.completed).toBe(true);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);

    req.flush(updatedTodo);
  });

  it('should toggle a todo', () => {
    const toggledTodo: Todo = {
      ...mockTodos[0],
      completed: true,
    };

    service.toggleTodo(1).subscribe((todo) => {
      expect(todo).toEqual(toggledTodo);
      expect(todo.completed).toBe(true);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1/toggle`);

    expect(req.request.method).toBe('PATCH');

    req.flush(toggledTodo);
  });

  it('should delete a todo', () => {
    service.deleteTodo(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should get todo stats', () => {
    const stats = {
      total: 10,
      completed: 4,
      open: 6,
      completionRate: 40,
    };

    service.getStats().subscribe((result) => {
      expect(result).toEqual(stats);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/stats`);

    expect(req.request.method).toBe('GET');

    req.flush(stats);
  });

  it('should get todo categories', () => {
    const categories: TodoCategory[] = ['ARBEIT', 'PRIVAT', 'UNI', 'EINKAUF', 'GESUNDHEIT', 'FINANZEN'];

    service.getCategories().subscribe((result) => {
      expect(result).toEqual(categories);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/categories`);

    expect(req.request.method).toBe('GET');

    req.flush(categories);
  });
});
