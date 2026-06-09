package com.todoapp.dto;

import java.time.LocalDateTime;

public class TodoListDto {

    public record Request(
            String name,
            String description,
            String color,
            String icon
    ) {}

    public record Response(
            Long id,
            String name,
            String description,
            String color,
            String icon,
            int totalTodos,
            int completedTodos,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}

}
