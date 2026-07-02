

export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TodoCategory = 'ARBEIT' | 'PRIVAT' | 'UNI' | 'EINKAUF' | 'GESUNDHEIT' | 'FINANZEN';

export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  listId: number;
  priority?: TodoPriority;
  category?: TodoCategory;
}

export interface TodoStats {
  totalTodos: number;
  completedTodos: number;
  openTodos: number;
}
