import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';

import { TodoListService } from '../../services/todo-list.service';
import { DashboardPage } from './dashboard-page';

const todoListsMock = [
  {
    id: 1,
    name: 'Uni',
    description: 'Aufgaben für die Uni',
    totalTodos: 4,
    completedTodos: 2,
    createdAt: '2026-06-11T12:00:00',
    updatedAt: '2026-06-11T12:00:00',
  },
  {
    id: 2,
    name: 'Privat',
    description: 'Private Aufgaben',
    totalTodos: 3,
    completedTodos: 1,
    createdAt: '2026-06-11T12:00:00',
    updatedAt: '2026-06-11T12:00:00',
  },
];

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let listsSubject: BehaviorSubject<typeof todoListsMock>;
  let todoListServiceMock: Pick<TodoListService, 'getLists'> & { lists$: BehaviorSubject<typeof todoListsMock> };

  beforeEach(async () => {
    listsSubject = new BehaviorSubject(todoListsMock);
    todoListServiceMock = {
      lists$: listsSubject,
      getLists: () => of(todoListsMock),
    };


    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        {
          provide: TodoListService,
          useValue: todoListServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todo lists', () => {
    expect(component.lists.length).toBe(2);
    expect(component.lists[0].name).toBe('Uni');
    expect(component.lists[1].name).toBe('Privat');
  });

  it('should calculate total lists', () => {
    expect(component.totalLists).toBe(2);
  });

  it('should calculate total todos', () => {
    expect(component.totalTodos).toBe(7);
  });

  it('should calculate completed todos', () => {
    expect(component.completedTodos).toBe(3);
  });

  it('should calculate open todos', () => {
    expect(component.openTodos).toBe(4);
  });

  it('should calculate progress percentage', () => {
    expect(component.progressPercent).toBe(43);
  });

  it('should stop loading after lists were loaded', () => {
    expect(component.loading).toBe(false);
  });
});
