import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { TodoListService } from '../../services/todo-list.service';
import { TodoListPage } from './todo-list-page';

let requestedListId: number | null = null;

const todoListServiceMock = {
  getListById: (id: number) => {
    requestedListId = id;

    return of({
      id: 1,
      name: 'Uni',
      description: 'Aufgaben für die Uni',
      totalTodos: 4,
      completedTodos: 2,
      createdAt: '2026-06-11T12:00:00',
      updatedAt: '2026-06-11T12:00:00',
    });
  },
};

const activatedRouteMock = {
  paramMap: of(convertToParamMap({ listId: '1' })),
};

describe('TodoListPage', () => {
  let component: TodoListPage;
  let fixture: ComponentFixture<TodoListPage>;

  beforeEach(async () => {
    requestedListId = null;
    await TestBed.configureTestingModule({
      imports: [TodoListPage],
      providers: [
        {
          provide: TodoListService,
          useValue: todoListServiceMock,
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
