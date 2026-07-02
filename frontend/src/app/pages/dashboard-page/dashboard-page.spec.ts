import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Todo, TodoStats } from '../../models/todo.model';
import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoService } from '../../services/todo.service';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let todoService: Partial<TodoService>;
  let todoListService: Partial<TodoListService>;
  let getStatsCalls: number;
  let getListsCalls: number;
  let getTodosCalls: number;
  let toggleTodoCalls: number[];
  let router: Router;
  let navigateCalls: Array<{ commands: unknown[]; extras?: unknown }>;

  const stats: TodoStats = {
    totalTodos: 3,
    completedTodos: 1,
    openTodos: 2,
  } as TodoStats;

  const lists: TodoList[] = [
    { id: 1, name: 'Uni Liste', description: null, totalTodos: 2, completedTodos: 1 },
    { id: 2, name: 'Einkauf Liste', description: null, totalTodos: 0, completedTodos: 0 },
    { id: 3, name: 'Arbeit Liste', description: null, totalTodos: 4, completedTodos: 2 },
    { id: 4, name: 'Privat Liste', description: null, totalTodos: 1, completedTodos: 1 },
    { id: 5, name: 'Extra Liste', description: null, totalTodos: 3, completedTodos: 0 },
  ];

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
      title: 'Milch kaufen',
      description: 'Für Frühstück',
      completed: true,
      category: 'EINKAUF',
      priority: 'LOW',
      listId: 2,
    } as Todo,
    {
      id: 12,
      title: 'Projekt fertig machen',
      description: 'Frontend Dashboard',
      completed: false,
      category: 'ARBEIT',
      priority: 'MEDIUM',
      listId: 3,
    } as Todo,
  ];

  beforeEach(async () => {
    getStatsCalls = 0;
    getListsCalls = 0;
    getTodosCalls = 0;
    toggleTodoCalls = [];

    todoService = {
      getStats: () => {
        getStatsCalls += 1;
        return of(stats);
      },
      getTodos: () => {
        getTodosCalls += 1;
        return of(todos);
      },
      toggleTodo: (todoId: number) => {
        toggleTodoCalls.push(todoId);
        return of({ ...todos[0], completed: true } as Todo);
      },
    };

    todoListService = {
      getLists: () => {
        getListsCalls += 1;
        return of(lists);
      },
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: TodoService, useValue: todoService },
        { provide: TodoListService, useValue: todoListService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateCalls = [];
    router.navigate = (commands: unknown[], extras?: unknown) => {
      navigateCalls.push({ commands, extras });
      return Promise.resolve(true);
    };

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  });

  it('should create and load dashboard data', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(getStatsCalls).toBeGreaterThan(0);
    expect(getListsCalls).toBeGreaterThan(0);
    expect(getTodosCalls).toBeGreaterThan(0);
    expect(component.stats()).toEqual(stats);
    expect(component.lists()).toEqual(lists);
    expect(component.todos()).toEqual(todos);
  });

  it('should calculate dashboard totals from stats', () => {
    fixture.detectChanges();

    expect(component.totalTodos()).toBe(3);
    expect(component.completedTodos()).toBe(1);
    expect(component.openTodos()).toBe(2);
    expect(component.completionRate()).toBe(33);
  });

  it('should use todos as fallback when stats are missing', () => {
    fixture.detectChanges();

    component.stats.set(null);

    expect(component.totalTodos()).toBe(3);
    expect(component.completedTodos()).toBe(1);
    expect(component.openTodos()).toBe(2);
    expect(component.completionRate()).toBe(33);
  });

  it('should show the first four lists and first five todos', () => {
    fixture.detectChanges();

    expect(component.latestLists().map((list) => list.id)).toEqual([1, 2, 3, 4]);
    expect(component.recentTodos()).toEqual(todos);
  });

  it('should update the search query from input events', () => {
    const input = document.createElement('input');
    input.value = 'uni';

    component.updateSearchQuery({ target: input } as unknown as Event);

    expect(component.searchQuery()).toBe('uni');
  });

  it('should return matching list and todo search results with highlight query params', () => {
    fixture.detectChanges();

    component.searchQuery.set('uni');

    expect(component.searchResults()).toEqual([
      {
        id: 1,
        title: 'Uni Liste',
        label: 'Liste',
        route: ['/lists', 1],
        queryParams: { highlightListTitle: 'true' },
      },
      {
        id: 10,
        title: 'Statistik lernen',
        label: 'Aufgabe',
        route: ['/lists', 1],
        queryParams: { highlightTodoId: 10 },
      },
    ]);
  });

  it('should return no search results for an empty search query', () => {
    fixture.detectChanges();

    component.searchQuery.set('   ');

    expect(component.searchResults()).toEqual([]);
  });

  it('should clear search query', () => {
    component.searchQuery.set('test');

    component.clearSearch();

    expect(component.searchQuery()).toBe('');
  });

  it('should navigate to the selected search result and clear the search query', () => {
    component.searchQuery.set('statistik');

    component.openSearchResult({
      route: ['/lists', 1],
      queryParams: { highlightTodoId: 10 },
    });

    expect(component.searchQuery()).toBe('');
    expect(navigateCalls).toEqual([
      {
        commands: ['/lists', 1],
        extras: { queryParams: { highlightTodoId: 10 } },
      },
    ]);
  });

  it('should return the list name for a todo list id', () => {
    fixture.detectChanges();

    expect(component.getListName(1)).toBe('Uni Liste');
    expect(component.getListName(999)).toBe('Liste');
  });

  it('should calculate the list progress', () => {
    fixture.detectChanges();

    expect(component.getListProgress(lists[0])).toBe(50);
    expect(component.getListProgress(lists[1])).toBe(0);
  });

  it('should reload data after toggling a todo', () => {
    fixture.detectChanges();
    getStatsCalls = 0;
    getListsCalls = 0;
    getTodosCalls = 0;
    toggleTodoCalls = [];

    component.toggleTodo(todos[0]);

    expect(toggleTodoCalls).toEqual([10]);
    expect(getStatsCalls).toBeGreaterThan(0);
    expect(getListsCalls).toBeGreaterThan(0);
    expect(getTodosCalls).toBeGreaterThan(0);
  });

  it('should show an error message when toggling a todo fails', () => {
    todoService.toggleTodo = (todoId: number) => {
      toggleTodoCalls.push(todoId);
      return throwError(() => new Error('Toggle failed'));
    };

    component.toggleTodo(todos[0]);

    expect(component.errorMessage()).toBe('Die Aufgabe konnte nicht aktualisiert werden.');
  });

  it('should show an error message when stats fail to load', () => {
    todoService.getStats = () => {
      getStatsCalls += 1;
      return throwError(() => new Error('Stats failed'));
    };

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.stats()).toBeNull();
    expect(component.loadingStats()).toBeFalsy();
    expect(component.errorMessage()).toBe('Die Dashboard-Statistiken konnten nicht geladen werden.');
  });

  it('should show an error message when lists fail to load', () => {
    todoListService.getLists = () => {
      getListsCalls += 1;
      return throwError(() => new Error('Lists failed'));
    };

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.lists()).toEqual([]);
    expect(component.loadingLists()).toBeFalsy();
    expect(component.errorMessage()).toBe('Die Listen konnten nicht geladen werden.');
  });

  it('should show an error message when todos fail to load', () => {
    todoService.getTodos = () => {
      getTodosCalls += 1;
      return throwError(() => new Error('Todos failed'));
    };

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.todos()).toEqual([]);
    expect(component.loadingTodos()).toBeFalsy();
    expect(component.errorMessage()).toBe('Die aktuellen Aufgaben konnten nicht geladen werden.');
  });
});
