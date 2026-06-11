package com.todoapp.dto;

import com.todoapp.model.TodoCategory;
import com.todoapp.model.TodoPriority;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.validation.constraints.*;

    public class TodoDto {

        public record Request(
                @NotBlank(message = "Title must not be blank")
                @Size(max = 120, message = "Title must be at most 120 characters")
                String title,

                @Size(max = 500, message = "Description must be at most 500 characters")
                String description,

                @NotNull(message = "List id must not be null")
                Long listId,

                TodoPriority priority,
                TodoCategory category,

                @Size(max = 200, message = "Tags must be at most 200 characters")
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
