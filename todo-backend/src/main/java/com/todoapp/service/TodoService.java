package com.todoapp.service;

import com.todoapp.dto.TodoDto;
import com.todoapp.model.Todo;
import com.todoapp.model.TodoList;
import com.todoapp.repository.TodoListRepository;
import com.todoapp.repository.TodoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;
    private final TodoListRepository todoListRepository;

    public List<TodoDto.Response> getAll(Long listId) {
        if (listId != null) {
            return todoRepository.findByTodoListId(listId)
                    .stream().map(this::toResponse).toList();
        }
        return todoRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public List<TodoDto.Response> getTodos(
            Long listId,
            Boolean completed,
            com.todoapp.model.TodoPriority priority,
            com.todoapp.model.TodoCategory category
    ) {
        return getAll(listId).stream()
                .filter(todo -> completed == null || todo.completed() == completed)
                .filter(todo -> priority == null || todo.priority() == priority)
                .filter(todo -> category == null || todo.category() == category)
                .toList();
    }

    public TodoDto.Response getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public TodoDto.Response getTodoById(Long id) {
        return getById(id);
    }

    public TodoDto.Response createTodo(TodoDto.Request request) {
        return create(request);
    }

    public TodoDto.Response create(TodoDto.Request request) {
        TodoList list = todoListRepository.findById(request.listId())
                .orElseThrow(() -> new EntityNotFoundException("TodoList not found: " + request.listId()));

        Todo todo = Todo.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority() != null ? request.priority() : com.todoapp.model.TodoPriority.MEDIUM)
                .category(request.category())
                .tags(request.tags())
                .dueDate(request.dueDate())
                .todoList(list)
                .build();

        return toResponse(todoRepository.save(todo));
    }

    public TodoDto.Response update(Long id, TodoDto.Request request) {
        Todo todo = findOrThrow(id);
        if (request.title() != null)       todo.setTitle(request.title());
        if (request.description() != null) todo.setDescription(request.description());
        if (request.priority() != null)    todo.setPriority(request.priority());
        if (request.category() != null)    todo.setCategory(request.category());
        if (request.tags() != null)        todo.setTags(request.tags());
        if (request.dueDate() != null)     todo.setDueDate(request.dueDate());
        return toResponse(todoRepository.save(todo));
    }

    public TodoDto.Response updateTodo(Long id, TodoDto.Request request) {
        return update(id, request);
    }

    public TodoDto.Response toggleComplete(Long id) {
        Todo todo = findOrThrow(id);
        todo.setCompleted(!todo.isCompleted());
        return toResponse(todoRepository.save(todo));
    }

    public TodoDto.Response toggleTodo(Long id) {
        return toggleComplete(id);
    }

    public void delete(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new EntityNotFoundException("Todo not found: " + id);
        }
        todoRepository.deleteById(id);
    }

    public void deleteTodo(Long id) {
        delete(id);
    }

    public Map<String, Long> getStats() {
        long total = todoRepository.count();
        long open = todoRepository.countByCompleted(false);
        long done = total - open;
        return Map.of(
                "total", total,
                "open", open,
                "completed", done,
                "completionRate", total == 0 ? 0L : Math.round((double) done / total * 100)
        );
    }

    private Todo findOrThrow(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Todo not found: " + id));
    }

    private TodoDto.Response toResponse(Todo t) {
        return new TodoDto.Response(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.isCompleted(),
                t.getPriority(),
                t.getCategory(),
                t.getTags(),
                t.getDueDate(),
                t.getTodoList().getId(),
                t.getTodoList().getName(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}