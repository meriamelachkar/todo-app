package com.todoapp.service;

import com.todoapp.dto.TodoListDto;
import com.todoapp.model.TodoList;
import com.todoapp.repository.TodoListRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

    @Service
    @RequiredArgsConstructor
    @Transactional
    public class TodoListService {

        private final TodoListRepository todoListRepository;

        public List<TodoListDto.Response> getAllLists() {
            return todoListRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        public TodoListDto.Response getListById(Long id) {
            return toResponse(findOrThrow(id));
        }

        public TodoListDto.Response createList(TodoListDto.Request request) {
            TodoList list = TodoList.builder()
                    .name(request.name())
                    .description(request.description())
                    .color(request.color() != null ? request.color() : "#6366f1")
                    .icon(request.icon() != null ? request.icon() : "📋")
                    .build();
            return toResponse(todoListRepository.save(list));
        }

        public TodoListDto.Response updateList(Long id, TodoListDto.Request request) {
            TodoList list = findOrThrow(id);
            if (request.name() != null)        list.setName(request.name());
            if (request.description() != null) list.setDescription(request.description());
            if (request.color() != null)       list.setColor(request.color());
            if (request.icon() != null)        list.setIcon(request.icon());
            return toResponse(todoListRepository.save(list));
        }

        public void deleteList(Long id) {
            if (!todoListRepository.existsById(id)) {
                throw new EntityNotFoundException("TodoList not found: " + id);
            }
            todoListRepository.deleteById(id);
        }

        private TodoList findOrThrow(Long id) {
            return todoListRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("TodoList not found: " + id));
        }

        private TodoListDto.Response toResponse(TodoList list) {
            long completed = list.getTodos().stream().filter(t -> t.isCompleted()).count();
            return new TodoListDto.Response(
                    list.getId(),
                    list.getName(),
                    list.getDescription(),
                    list.getColor(),
                    list.getIcon(),
                    list.getTodos().size(),
                    (int) completed,
                    list.getCreatedAt(),
                    list.getUpdatedAt()
            );
        }
    }
