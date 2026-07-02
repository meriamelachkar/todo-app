import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoListPage } from './todo-list-page';

function installLocalStorageMock(): Record<string, string> {
  const storage: Record<string, string> = {};

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach((key) => delete storage[key]);
      },
    },
    configurable: true,
  });

  return storage;
}

describe('TodoListPage', () => {
  let component: TodoListPage;
  let fixture: ComponentFixture<TodoListPage>;
  let todoListService: Partial<TodoListService>;
  let router: Router;

  let getListsCalls: number;
  let createListPayloads: unknown[];
  let deleteListCalls: number[];
  let navigateCalls: Array<{ commands: unknown[]; extras?: unknown }>;

  let shouldFailLoading: boolean;
  let shouldFailCreate: boolean;
  let shouldFailDelete: boolean;
  let confirmResult: boolean;
  let localStorageMock: Record<string, string>;

  const lists: TodoList[] = [
    { id: 1, name: 'Uni Liste', description: null, totalTodos: 2, completedTodos: 1 },
    { id: 2, name: 'Einkauf Liste', description: 'Wocheneinkauf', totalTodos: 0, completedTodos: 0 },
  ];

  beforeEach(async () => {
    getListsCalls = 0;
    createListPayloads = [];
    deleteListCalls = [];
    navigateCalls = [];

    shouldFailLoading = false;
    shouldFailCreate = false;
    shouldFailDelete = false;
    confirmResult = true;

    todoListService = {
      getLists: () => {
        getListsCalls += 1;

        if (shouldFailLoading) {
          return throwError(() => new Error('Loading failed'));
        }

        return of(lists);
      },
      createList: (payload) => {
        createListPayloads.push(payload);

        if (shouldFailCreate) {
          return throwError(() => new Error('Create failed'));
        }

        return of({ id: 3, name: payload.name, description: payload.description, totalTodos: 0, completedTodos: 0 } as TodoList);
      },
      deleteList: (listId: number) => {
        deleteListCalls.push(listId);

        if (shouldFailDelete) {
          return throwError(() => new Error('Delete failed'));
        }

        return of(undefined);
      },
    };

    await TestBed.configureTestingModule({
      imports: [TodoListPage],
      providers: [
        provideRouter([]),
        { provide: TodoListService, useValue: todoListService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    router.navigate = (commands: unknown[], extras?: unknown) => {
      navigateCalls.push({ commands, extras });
      return Promise.resolve(true);
    };

    window.confirm = () => confirmResult;
    localStorageMock = installLocalStorageMock();

    fixture = TestBed.createComponent(TodoListPage);
    component = fixture.componentInstance;
  });

  it('should create and load lists', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(getListsCalls).toBeGreaterThan(0);
    expect(component.lists()).toEqual(lists);
    expect(component.loading()).toBeFalsy();
  });

  it('should show an error when lists cannot be loaded', () => {
    shouldFailLoading = true;

    fixture = TestBed.createComponent(TodoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.lists()).toEqual([]);
    expect(component.loading()).toBeFalsy();
    expect(component.errorMessage()).toBe('Die Listen konnten nicht geladen werden. Prüfe, ob Backend und Datenbank laufen.');
  });

  it('should not create a list without a name', () => {
    fixture.detectChanges();
    component.newListName.set('   ');

    component.createList();

    expect(createListPayloads).toEqual([]);
    expect(component.createErrorMessage()).toBe('Bitte gib einen Namen für die Liste ein.');
  });

  it('should create a list, save the icon, reset the form and navigate to the new list', () => {
    fixture.detectChanges();
    getListsCalls = 0;

    component.newListName.set('Neue Liste');
    component.newListDescription.set('Meine Beschreibung');
    component.newListIcon.set('✅');

    component.createList();

    expect(createListPayloads).toEqual([
      {
        name: 'Neue Liste',
        description: 'Meine Beschreibung',
      },
    ]);
    expect(localStorageMock['todo-list-icons']).toBe(JSON.stringify({ 3: '✅' }));
    expect(component.newListName()).toBe('');
    expect(component.newListDescription()).toBe('');
    expect(component.newListIcon()).toBe('📋');
    expect(component.saving()).toBeFalsy();
    expect(getListsCalls).toBeGreaterThan(0);
    expect(navigateCalls).toEqual([{ commands: ['/lists', 3], extras: undefined }]);
  });

  it('should store an empty description as null when creating a list', () => {
    fixture.detectChanges();

    component.newListName.set('Liste ohne Beschreibung');
    component.newListDescription.set('   ');

    component.createList();

    expect(createListPayloads).toEqual([
      {
        name: 'Liste ohne Beschreibung',
        description: null,
      },
    ]);
  });

  it('should show an error when creating a list fails', () => {
    fixture.detectChanges();
    shouldFailCreate = true;
    component.newListName.set('Neue Liste');

    component.createList();

    expect(component.saving()).toBeFalsy();
    expect(component.createErrorMessage()).toBe('Die Liste konnte nicht erstellt werden.');
  });

  it('should navigate when opening a list', () => {
    fixture.detectChanges();

    component.openList(lists[0]);

    expect(navigateCalls).toEqual([{ commands: ['/lists', 1], extras: undefined }]);
  });

  it('should return the saved icon for a list', () => {
    localStorageMock['todo-list-icons'] = JSON.stringify({ 1: '📚' });

    expect(component.getListIcon(lists[0])).toBe('📚');
  });

  it('should return the default icon when no icon is saved', () => {
    expect(component.getListIcon(lists[0])).toBe('📋');
  });

  it('should return the default icon when saved icons are invalid', () => {
    localStorageMock['todo-list-icons'] = 'not-valid-json';

    expect(component.getListIcon(lists[0])).toBe('📋');
  });

  it('should not delete a list when confirmation is cancelled', () => {
    fixture.detectChanges();
    confirmResult = false;

    component.deleteList(lists[0]);

    expect(deleteListCalls).toEqual([]);
  });

  it('should delete a list, remove its icon and reload lists', () => {
    fixture.detectChanges();
    localStorageMock['todo-list-icons'] = JSON.stringify({ 1: '📚', 2: '🛒' });
    getListsCalls = 0;

    component.deleteList(lists[0]);

    expect(deleteListCalls).toEqual([1]);
    expect(localStorageMock['todo-list-icons']).toBe(JSON.stringify({ 2: '🛒' }));
    expect(getListsCalls).toBeGreaterThan(0);
  });

  it('should show an error when deleting a list fails', () => {
    fixture.detectChanges();
    shouldFailDelete = true;

    component.deleteList(lists[0]);

    expect(deleteListCalls).toEqual([1]);
    expect(component.errorMessage()).toBe('Die Liste konnte nicht gelöscht werden.');
  });
});
