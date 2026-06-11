export interface TodoList {
  id: number;
  name: string;
  description: string | null;
  totalTodos: number;
  completedTodos: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoListRequest {
  name: string;
  description: string | null;
}

export interface UpdateTodoListRequest {
  name: string;
  description: string | null;
}
