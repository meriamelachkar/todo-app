package com.todoapp.todo_backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoapp.controller.TodoController;
import com.todoapp.dto.TodoDto;
import com.todoapp.exception.GlobalExceptionHandler;
import com.todoapp.model.TodoCategory;
import com.todoapp.model.TodoPriority;
import com.todoapp.service.TodoService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TodoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TodoService todoService;

    @Test
    void getTodosReturnsOkAndTodos() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoDto.Response response = new TodoDto.Response(
                1L,
                "DBMS lernen",
                "Kapitel 1 wiederholen",
                false,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                "uni,dbms",
                LocalDate.of(2026, 8, 24),
                1L,
                "Uni",
                now,
                now
        );

        when(todoService.getTodos(null, null, null, null)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("DBMS lernen"))
                .andExpect(jsonPath("$[0].description").value("Kapitel 1 wiederholen"))
                .andExpect(jsonPath("$[0].completed").value(false))
                .andExpect(jsonPath("$[0].priority").value("HIGH"))
                .andExpect(jsonPath("$[0].category").value("UNI"))
                .andExpect(jsonPath("$[0].tags").value("uni,dbms"))
                .andExpect(jsonPath("$[0].listId").value(1))
                .andExpect(jsonPath("$[0].listName").value("Uni"));
    }

    @Test
    void getTodosWithFiltersPassesFiltersToService() throws Exception {
        when(todoService.getTodos(1L, false, TodoPriority.HIGH, TodoCategory.UNI))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/todos")
                        .param("listId", "1")
                        .param("completed", "false")
                        .param("priority", "HIGH")
                        .param("category", "UNI"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(todoService).getTodos(1L, false, TodoPriority.HIGH, TodoCategory.UNI);
    }

    @Test
    void getTodoByIdReturnsOkAndTodo() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoDto.Response response = new TodoDto.Response(
                1L,
                "DBMS lernen",
                "Kapitel 1 wiederholen",
                false,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                "uni,dbms",
                LocalDate.of(2026, 8, 24),
                1L,
                "Uni",
                now,
                now
        );

        when(todoService.getTodoById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("DBMS lernen"))
                .andExpect(jsonPath("$.description").value("Kapitel 1 wiederholen"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.category").value("UNI"));
    }

    @Test
    void getTodoByIdReturnsNotFoundWhenTodoDoesNotExist() throws Exception {
        when(todoService.getTodoById(99L))
                .thenThrow(new EntityNotFoundException("Todo not found: 99"));

        mockMvc.perform(get("/api/todos/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Todo not found: 99"));
    }

    @Test
    void createTodoReturnsCreatedWhenRequestIsValid() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoDto.Request request = new TodoDto.Request(
                "DBMS lernen",
                "Kapitel 1 wiederholen",
                1L,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                "uni,dbms",
                LocalDate.of(2026, 8, 24)
        );

        TodoDto.Response response = new TodoDto.Response(
                1L,
                "DBMS lernen",
                "Kapitel 1 wiederholen",
                false,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                "uni,dbms",
                LocalDate.of(2026, 8, 24),
                1L,
                "Uni",
                now,
                now
        );

        when(todoService.createTodo(any(TodoDto.Request.class))).thenReturn(response);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("DBMS lernen"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.category").value("UNI"));
    }

    @Test
    void createTodoReturnsBadRequestWhenTitleIsBlank() throws Exception {
        TodoDto.Request request = new TodoDto.Request(
                "",
                "Beschreibung",
                1L,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                null,
                null
        );

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.title").value("Title must not be blank"));
    }

    @Test
    void createTodoReturnsBadRequestWhenDescriptionIsTooLong() throws Exception {
        TodoDto.Request request = new TodoDto.Request(
                "DBMS lernen",
                "a".repeat(501),
                1L,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                null,
                null
        );

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.description").value("Description must be at most 500 characters"));
    }

    @Test
    void createTodoReturnsBadRequestWhenListIdIsMissing() throws Exception {
        TodoDto.Request request = new TodoDto.Request(
                "DBMS lernen",
                "Beschreibung",
                null,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                null,
                null
        );

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.listId").value("List id must not be null"));
    }

    @Test
    void updateTodoReturnsOkWhenRequestIsValid() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoDto.Request request = new TodoDto.Request(
                "DBMS wiederholen",
                "Kapitel 2",
                1L,
                TodoPriority.MEDIUM,
                TodoCategory.UNI,
                null,
                null
        );

        TodoDto.Response response = new TodoDto.Response(
                1L,
                "DBMS wiederholen",
                "Kapitel 2",
                false,
                TodoPriority.MEDIUM,
                TodoCategory.UNI,
                null,
                null,
                1L,
                "Uni",
                now,
                now
        );

        when(todoService.updateTodo(eq(1L), any(TodoDto.Request.class))).thenReturn(response);

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("DBMS wiederholen"))
                .andExpect(jsonPath("$.description").value("Kapitel 2"))
                .andExpect(jsonPath("$.priority").value("MEDIUM"));
    }

    @Test
    void updateTodoReturnsNotFoundWhenTodoDoesNotExist() throws Exception {
        TodoDto.Request request = new TodoDto.Request(
                "DBMS wiederholen",
                "Kapitel 2",
                1L,
                TodoPriority.MEDIUM,
                TodoCategory.UNI,
                null,
                null
        );

        when(todoService.updateTodo(eq(99L), any(TodoDto.Request.class)))
                .thenThrow(new EntityNotFoundException("Todo not found: 99"));

        mockMvc.perform(put("/api/todos/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Todo not found: 99"));
    }

    @Test
    void toggleTodoReturnsOkAndToggledTodo() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoDto.Response response = new TodoDto.Response(
                1L,
                "DBMS lernen",
                "Kapitel 1 wiederholen",
                true,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                "uni,dbms",
                LocalDate.of(2026, 8, 24),
                1L,
                "Uni",
                now,
                now
        );

        when(todoService.toggleTodo(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/todos/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void toggleTodoReturnsNotFoundWhenTodoDoesNotExist() throws Exception {
        when(todoService.toggleTodo(99L))
                .thenThrow(new EntityNotFoundException("Todo not found: 99"));

        mockMvc.perform(patch("/api/todos/99/toggle"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Todo not found: 99"));
    }

    @Test
    void deleteTodoReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isNoContent());

        verify(todoService).deleteTodo(1L);
    }

    @Test
    void deleteTodoReturnsNotFoundWhenTodoDoesNotExist() throws Exception {
        org.mockito.Mockito.doThrow(new EntityNotFoundException("Todo not found: 99"))
                .when(todoService)
                .deleteTodo(99L);

        mockMvc.perform(delete("/api/todos/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Todo not found: 99"));
    }

    @Test
    void getStatsReturnsOkAndStats() throws Exception {
        when(todoService.getStats()).thenReturn(Map.of(
                "total", 4L,
                "open", 1L,
                "completed", 3L,
                "completionRate", 75L
        ));

        mockMvc.perform(get("/api/todos/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(4))
                .andExpect(jsonPath("$.open").value(1))
                .andExpect(jsonPath("$.completed").value(3))
                .andExpect(jsonPath("$.completionRate").value(75));
    }

    @Test
    void getCategoriesReturnsOkAndCategories() throws Exception {
        mockMvc.perform(get("/api/todos/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(TodoCategory.values().length)));
    }
}