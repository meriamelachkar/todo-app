package com.todoapp.controller;

import com.todoapp.dto.TodoListDto;
import com.todoapp.service.TodoListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TodoListController {

    private final TodoListService todoListService;

    @GetMapping
    public List<TodoListDto.Response> getAllLists() {
        return todoListService.getAllLists();
    }

    @GetMapping("/{id}")
    public TodoListDto.Response getListById(@PathVariable Long id) {
        return todoListService.getListById(id);
    }

    @PostMapping
    public ResponseEntity<TodoListDto.Response> createList(
            @Valid @RequestBody TodoListDto.Request request
    ) {
        TodoListDto.Response createdList = todoListService.createList(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdList);
    }

    @PutMapping("/{id}")
    public TodoListDto.Response updateList(
            @PathVariable Long id,
            @Valid @RequestBody TodoListDto.Request request
    ) {
        return todoListService.updateList(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Long id) {
        todoListService.deleteList(id);
        return ResponseEntity.noContent().build();
    }
}