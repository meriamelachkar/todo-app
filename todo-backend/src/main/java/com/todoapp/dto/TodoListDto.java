package com.todoapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class TodoListDto {

    public record Request(
            @NotBlank(message = "List name must not be blank")
            @Size(max = 80, message = "List name must be at most 80 characters")
            String name,

            @Size(max = 500, message = "Description must be at most 500 characters")
            String description
    ) {}

    public record Response(
            Long id,
            String name,
            String description,
            int totalTodos,
            int completedTodos,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}

}
