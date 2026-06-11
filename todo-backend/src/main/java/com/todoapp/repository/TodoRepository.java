package com.todoapp.repository;

import com.todoapp.model.Todo;
import com.todoapp.model.TodoCategory;
import com.todoapp.model.TodoPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByTodoListId(Long listId);

    List<Todo> findByCompleted(boolean completed);

    List<Todo> findByPriority(TodoPriority priority);

    List<Todo> findByCategory(TodoCategory category);

    List<Todo> findByTodoListIdAndCompleted(Long listId, boolean completed);

    long countByCompleted(boolean completed);
}