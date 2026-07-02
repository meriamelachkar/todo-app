import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { Todo } from '../../models/todo.model';
import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoService } from '../../services/todo.service';
import { TodoDetailPage } from './todo-detail-page';

describe('TodoDetailPage', () => {
  let component: TodoDetailPage;
  let fixture: ComponentFixture<TodoDetailPage>;
  let paramMapSubject: BehaviorSubject<ParamMap>;
  let todoListService: Partial<TodoListService>;
  let todoService: Partial<TodoService>;

  let getListByIdCalls: number[];
  let getTodosByListIdCalls: number[];
  let createTodoPayloads: unknown[];
  let toggleTodoCalls: number[];
  let deleteTodoCalls: number[];

  let shouldFailListLoading: boolean;
  let shouldFailTodosLoading: boolean;
  let shouldFailCreateTodo: boolean;
  let shouldFailToggleTodo: boolean;
  let shouldFailDeleteTodo: boolean;
  let shouldFailReloadList: boolean;
  let shouldFailReloadTodos: boolean;

  const todoList: TodoList = {
    id: 1,
    name: 'Uni Liste',
    description: null,
    totalTodos: 2,
    completedTodos: 1,
  };

  const todos: Todo[] = [
    {
      id: 10,
      title: 'Statistik lernen',
      description: 'Kapitel wiederholen',
      completed: false,
      category: 'UNI',
      priority: 'HIGH',
      listId: 1,
    } as Todo,
    {
      id: 11,
      title: 'Projekt abgeben',
      description: null,
      completed: true,
      category: 'ARBEIT',
      priority: 'MEDIUM',
      listId: 1,
    } as Todo,
  ];

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject(convertToParamMap({ listId: '1' }));

    getListByIdCalls = [];
    getTodosByListIdCalls = [];
    createTodoPayloads = [];
    toggleTodoCalls = [];
    deleteTodoCalls = [];

    shouldFailListLoading = false;
    shouldFailTodosLoading = false;
    shouldFailCreateTodo = false;
    shouldFailToggleTodo = false;
    shouldFailDeleteTodo = false;
    shouldFailReloadList = false;
    shouldFailReloadTodos = false;

    todoListService = {
      getListById: (listId: number) => {
        getListByIdCalls.push(listId);

        if (shouldFailListLoading || shouldFailReloadList) {
          return throwError(() => new Error('List loading failed'));
        }

        return of(todoList);
      },
    };

    todoService = {
      getTodosByListId: (listId: number) => {
        getTodosByListIdCalls.push(listId);

        if (shouldFailTodosLoading || shouldFailReloadTodos) {
          return throwError(() => new Error('Todos loading failed'));
        }

        return of(todos);
      },
      createTodo: (todo) => {
        createTodoPayloads.push(todo);

        if (shouldFailCreateTodo) {
          return throwError(() => new Error('Create failed'));
        }

        return of({ id: 12, ...todo } as Todo);
      },
      toggleTodo: (todoId: number) => {
        toggleTodoCalls.push(todoId);

        if (shouldFailToggleTodo) {
          return throwError(() => new Error('Toggle failed'));
        }

        return of({ ...todos[0], completed: true } as Todo);
      },
      deleteTodo: (todoId: number) => {
        deleteTodoCalls.push(todoId);

        if (shouldFailDeleteTodo) {
          return throwError(() => new Error('Delete failed'));
        }

        return of(undefined);
      },
    };

    await TestBed.configureTestingModule({
      imports: [TodoDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
          },
        },
        { provide: TodoListService, useValue: todoListService },
        { provide: TodoService, useValue: todoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoDetailPage);
    component = fixture.componentInstance;
  });

  it('should create and load list with todos', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(getListByIdCalls).toEqual([1]);
    expect(getTodosByListIdCalls).toEqual([1]);
    expect(component.list()).toEqual(todoList);
    expect(component.todos()).toEqual(todos);
    expect(component.loadingList()).toBeFalsy();
    expect(component.loadingTodos()).toBeFalsy();
  });

  it('should calculate todo counters', () => {
    fixture.detectChanges();

    expect(component.totalTodos()).toBe(2);
    expect(component.completedTodos()).toBe(1);
    expect(component.openTodos()).toBe(1);
  });

  it('should show an error when no valid list id is selected', () => {
    paramMapSubject.next(convertToParamMap({ listId: '0' }));
    fixture.detectChanges();

    expect(component.list()).toBeNull();
    expect(component.todos()).toEqual([]);
    expect(component.errorMessage()).toBe('Keine gültige Liste ausgewählt.');
  });

  it('should show an error when the list cannot be loaded', () => {
    shouldFailListLoading = true;

    fixture.detectChanges();

    expect(component.list()).toBeNull();
    expect(component.loadingList()).toBeFalsy();
    expect(component.errorMessage()).toBe('Die Liste konnte nicht geladen werden.');
  });

  it('should show an error when todos cannot be loaded', () => {
    shouldFailTodosLoading = true;

    fixture.detectChanges();

    expect(component.todos()).toEqual([]);
    expect(component.loadingTodos()).toBeFalsy();
    expect(component.todoErrorMessage()).toBe('Die Todos konnten nicht geladen werden.');
  });

  it('should not create a todo without a title', () => {
    fixture.detectChanges();
    component.newTodoTitle.set('   ');

    component.createTodo();

    expect(createTodoPayloads).toEqual([]);
    expect(component.todoErrorMessage()).toBe('Bitte gib einen Titel ein.');
  });

  it('should create a todo and reset the form', () => {
    fixture.detectChanges();
    getListByIdCalls = [];
    getTodosByListIdCalls = [];

    component.newTodoTitle.set('Neue Aufgabe');
    component.newTodoDescription.set('Beschreibung');
    component.newTodoCategory.set('PRIVAT');
    component.newTodoPriority.set('LOW');

    component.createTodo();

    expect(createTodoPayloads).toEqual([
      {
        title: 'Neue Aufgabe',
        description: 'Beschreibung',
        listId: 1,
        completed: false,
        category: 'PRIVAT',
        priority: 'LOW',
      },
    ]);
    expect(component.newTodoTitle()).toBe('');
    expect(component.newTodoDescription()).toBe('');
    expect(component.newTodoCategory()).toBe('UNI');
    expect(component.newTodoPriority()).toBe('MEDIUM');
    expect(component.savingTodo()).toBeFalsy();
    expect(getTodosByListIdCalls).toEqual([1]);
    expect(getListByIdCalls).toEqual([1]);
  });

  it('should show an error when creating a todo fails', () => {
    fixture.detectChanges();
    shouldFailCreateTodo = true;
    component.newTodoTitle.set('Neue Aufgabe');

    component.createTodo();

    expect(component.savingTodo()).toBeFalsy();
    expect(component.todoErrorMessage()).toBe('Das Todo konnte nicht erstellt werden.');
  });

  it('should toggle a todo and reload data', () => {
    fixture.detectChanges();
    getListByIdCalls = [];
    getTodosByListIdCalls = [];

    component.toggleTodo(todos[0]);

    expect(toggleTodoCalls).toEqual([10]);
    expect(getTodosByListIdCalls).toEqual([1]);
    expect(getListByIdCalls).toEqual([1]);
  });

  it('should show an error when toggling a todo fails', () => {
    fixture.detectChanges();
    shouldFailToggleTodo = true;

    component.toggleTodo(todos[0]);

    expect(component.todoErrorMessage()).toBe('Das Todo konnte nicht aktualisiert werden.');
  });

  it('should delete a todo and reload data', () => {
    fixture.detectChanges();
    getListByIdCalls = [];
    getTodosByListIdCalls = [];

    component.deleteTodo(todos[0]);

    expect(deleteTodoCalls).toEqual([10]);
    expect(getTodosByListIdCalls).toEqual([1]);
    expect(getListByIdCalls).toEqual([1]);
  });

  it('should show an error when deleting a todo fails', () => {
    fixture.detectChanges();
    shouldFailDeleteTodo = true;

    component.deleteTodo(todos[0]);

    expect(component.todoErrorMessage()).toBe('Das Todo konnte nicht gelöscht werden.');
  });

  it('should show an error when reloading the list fails after creating a todo', () => {
    fixture.detectChanges();
    shouldFailReloadList = true;
    component.newTodoTitle.set('Neue Aufgabe');

    component.createTodo();

    expect(component.errorMessage()).toBe('Die Liste konnte nicht neu geladen werden.');
  });

  it('should show an error when reloading todos fails after creating a todo', () => {
    fixture.detectChanges();
    shouldFailReloadTodos = true;
    component.newTodoTitle.set('Neue Aufgabe');

    component.createTodo();

    expect(component.todoErrorMessage()).toBe('Die Todos konnten nicht neu geladen werden.');
  });
});
