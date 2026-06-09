package com.todoapp.controller;

import com.todoapp.dto.TodoDto;
import com.todoapp.model.TodoCategory;
import com.todoapp.model.TodoPriority;
import com.todoapp.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public List<TodoDto.Response> getTodos(
            @RequestParam(required = false) Long listId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) TodoPriority priority,
            @RequestParam(required = false) TodoCategory category
    ) {
        return todoService.getTodos(listId, completed, priority, category);
    }

    @GetMapping("/{id}")
    public TodoDto.Response getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    @PostMapping
    public ResponseEntity<TodoDto.Response> createTodo(@Valid @RequestBody TodoDto.Request request) {
        TodoDto.Response createdTodo = todoService.createTodo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    @PutMapping("/{id}")
    public TodoDto.Response updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoDto.Request request
    ) {
        return todoService.updateTodo(id, request);
    }

    @PatchMapping("/{id}/toggle")
    public TodoDto.Response toggleTodo(@PathVariable Long id) {
        return todoService.toggleTodo(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return todoService.getStats();
    }

    @GetMapping("/categories")
    public List<TodoCategory> getCategories() {
        return Arrays.asList(TodoCategory.values());
    }
}