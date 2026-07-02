

import { Todo } from './todo.model';

export interface TodoList {
  id: number;
  name: string;
  description?: string | null;
  todos?: Todo[];
  totalTodos?: number;
  completedTodos?: number;
}
