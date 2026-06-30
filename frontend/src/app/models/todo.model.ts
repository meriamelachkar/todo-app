export type TodoCategory = 'ARBEIT' | 'PRIVAT' | 'UNI' | 'EINKAUF' | 'GESUNDHEIT' | 'FINANZEN';
export type TodoPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Todo {
  id: number;
  listId: number;
  title: string;
  description: string | null;
  category: TodoCategory | null;
  priority: TodoPriority;
  tags: string | null;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string | null;
  category: TodoCategory;
  listId: number;
}
