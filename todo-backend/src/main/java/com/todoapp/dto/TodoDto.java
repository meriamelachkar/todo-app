package com.todoapp.dto;

import com.todoapp.model.TodoCategory;
import com.todoapp.model.TodoPriority;

import java.time.LocalDate;
import java.time.LocalDateTime;

    public class TodoDto {

        public record Request(
                String title,
                String description,
                Long listId,
                TodoPriority priority,
                TodoCategory category,
                String tags,
                LocalDate dueDate
        ) {}

        public record Response(
                Long id,
                String title,
                String description,
                boolean completed,
                TodoPriority priority,
                TodoCategory category,
                String tags,
                LocalDate dueDate,
                Long listId,
                String listName,
                LocalDateTime createdAt,
                LocalDateTime updatedAt
        ) {}
    }
