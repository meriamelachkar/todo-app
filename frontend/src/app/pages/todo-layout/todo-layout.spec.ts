import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { TodoList } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoLayout } from './todo-layout';

describe('TodoLayout', () => {
  let component: TodoLayout;
  let fixture: ComponentFixture<TodoLayout>;
  let listsSubject: BehaviorSubject<TodoList[]>;
  let todoListServiceMock: Pick<TodoListService, 'getLists' | 'createList'> & { lists$: BehaviorSubject<TodoList[]> };

  beforeEach(async () => {
    listsSubject = new BehaviorSubject<TodoList[]>([]);
    todoListServiceMock = {
      lists$: listsSubject,
      getLists: () => of([]),
      createList: () => of({
        id: 1,
        name: 'Uni',
        description: '',
        totalTodos: 0,
        completedTodos: 0,
        createdAt: '2026-06-11T12:00:00',
        updatedAt: '2026-06-11T12:00:00',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TodoLayout],
      providers: [
        provideRouter([]),
        {
          provide: TodoListService,
          useValue: todoListServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
