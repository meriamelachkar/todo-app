import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

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

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let todoListService: Partial<TodoListService>;
  let getListsCalls: number;
  let shouldFailLoading: boolean;
  let localStorageMock: Record<string, string>;

  const todoLists: TodoList[] = [
    { id: 1, name: 'Erste Liste', description: null, totalTodos: 2, completedTodos: 1 },
    { id: 5, name: 'Neueste Liste', description: null, totalTodos: 0, completedTodos: 0 },
    { id: 3, name: 'Dritte Liste', description: null, totalTodos: 1, completedTodos: 0 },
    { id: 2, name: 'Zweite Liste', description: null, totalTodos: 4, completedTodos: 4 },
    { id: 4, name: 'Vierte Liste', description: null, totalTodos: 3, completedTodos: 1 },
  ];

  beforeEach(async () => {
    getListsCalls = 0;
    shouldFailLoading = false;

    todoListService = {
      getLists: () => {
        getListsCalls += 1;

        if (shouldFailLoading) {
          return throwError(() => new Error('Loading failed'));
        }

        return of(todoLists);
      },
    };

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]),
        { provide: TodoListService, useValue: todoListService },
      ],
    }).compileComponents();

    localStorageMock = installLocalStorageMock();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load the four newest lists ordered by id descending', () => {
    fixture.detectChanges();

    expect(getListsCalls).toBeGreaterThan(0);
    expect(component.recentLists().map((list) => list.id)).toEqual([5, 4, 3, 2]);
  });

  it('should show an empty recent list when loading lists fails', () => {
    shouldFailLoading = true;

    fixture.detectChanges();

    expect(component.recentLists()).toEqual([]);
  });

  it('should return the saved icon for a list', () => {
    localStorageMock['todo-list-icons'] = JSON.stringify({ 5: '✅' });

    expect(component.getListIcon(5)).toBe('✅');
  });

  it('should return the default icon when no icon is saved', () => {
    expect(component.getListIcon(5)).toBe('📋');
  });

  it('should return the default icon when saved icons are invalid', () => {
    localStorageMock['todo-list-icons'] = 'not-valid-json';

    expect(component.getListIcon(5)).toBe('📋');
  });
});
