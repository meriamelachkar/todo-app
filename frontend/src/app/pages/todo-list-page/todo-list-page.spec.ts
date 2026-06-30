import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoService } from '../../services/todo.service';
import { TodoListPage } from './todo-list-page';

let requestedListId: number | null = null;

const todoListMock: TodoList = {
  id: 1,
  name: 'Uni',
  description: 'Aufgaben für die Uni',
  totalTodos: 4,
  completedTodos: 2,
  createdAt: '2026-06-11T12:00:00',
  updatedAt: '2026-06-11T12:00:00',
};

let listsSubject: BehaviorSubject<TodoList[]>;

let todoListServiceMock: Pick<TodoListService, 'getListById'> & { lists$: BehaviorSubject<TodoList[]> };

const todoServiceMock = {
  getTodosByListId: () => of([]),
};

function createTodoListServiceMock(): Pick<TodoListService, 'getListById'> & { lists$: BehaviorSubject<TodoList[]> } {
  return {
    lists$: listsSubject,
    getListById: (id: number) => {
      requestedListId = id;

      return of(todoListMock);
    },
  };
}

const activatedRouteMock = {
  paramMap: of(convertToParamMap({ listId: '1' })),
};

describe('TodoListPage', () => {
  let component: TodoListPage;
  let fixture: ComponentFixture<TodoListPage>;

  beforeEach(async () => {
    requestedListId = null;
    listsSubject = new BehaviorSubject<TodoList[]>([]);
    todoListServiceMock = createTodoListServiceMock();

    await TestBed.configureTestingModule({
      imports: [TodoListPage],
      providers: [
        {
          provide: TodoListService,
          useValue: todoListServiceMock,
        },
        {
          provide: TodoService,
          useValue: todoServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the selected todo list from the route parameter', () => {
    expect(requestedListId).toBe(1);
    expect(component.list?.name).toBe('Uni');
  });

  it('should calculate the progress percentage', () => {
    expect(component.progressPercent).toBe(50);
  });
});
