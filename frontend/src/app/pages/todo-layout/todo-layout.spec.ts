import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoLayout } from './todo-layout';

describe('TodoLayout', () => {
  let component: TodoLayout;
  let fixture: ComponentFixture<TodoLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
