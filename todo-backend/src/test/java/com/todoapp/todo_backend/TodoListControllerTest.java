package com.todoapp.todo_backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoapp.controller.TodoListController;
import com.todoapp.dto.TodoListDto;
import com.todoapp.exception.GlobalExceptionHandler;
import com.todoapp.service.TodoListService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TodoListController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class TodoListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TodoListService todoListService;

    @Test
    void getAllListsReturnsOkAndLists() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoListDto.Response response = new TodoListDto.Response(
                1L,
                "Uni",
                "Aufgaben für die Uni",
                2,
                1,
                now,
                now
        );

        when(todoListService.getAllLists()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Uni"))
                .andExpect(jsonPath("$[0].description").value("Aufgaben für die Uni"))
                .andExpect(jsonPath("$[0].totalTodos").value(2))
                .andExpect(jsonPath("$[0].completedTodos").value(1));
    }

    @Test
    void getListByIdReturnsOkAndList() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoListDto.Response response = new TodoListDto.Response(
                1L,
                "Uni",
                "Aufgaben für die Uni",
                2,
                1,
                now,
                now
        );

        when(todoListService.getListById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/lists/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Uni"))
                .andExpect(jsonPath("$.description").value("Aufgaben für die Uni"))
                .andExpect(jsonPath("$.totalTodos").value(2))
                .andExpect(jsonPath("$.completedTodos").value(1));
    }

    @Test
    void getListByIdReturnsNotFoundWhenListDoesNotExist() throws Exception {
        when(todoListService.getListById(99L))
                .thenThrow(new EntityNotFoundException("TodoList not found: 99"));

        mockMvc.perform(get("/api/lists/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("TodoList not found: 99"));
    }

    @Test
    void createListReturnsCreatedWhenRequestIsValid() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoListDto.Request request = new TodoListDto.Request(
                "Uni",
                "Aufgaben für die Uni"
        );

        TodoListDto.Response response = new TodoListDto.Response(
                1L,
                "Uni",
                "Aufgaben für die Uni",
                0,
                0,
                now,
                now
        );

        when(todoListService.createList(any(TodoListDto.Request.class))).thenReturn(response);

        mockMvc.perform(post("/api/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Uni"))
                .andExpect(jsonPath("$.description").value("Aufgaben für die Uni"))
                .andExpect(jsonPath("$.totalTodos").value(0))
                .andExpect(jsonPath("$.completedTodos").value(0));
    }

    @Test
    void createListReturnsBadRequestWhenNameIsBlank() throws Exception {
        TodoListDto.Request request = new TodoListDto.Request(
                "",
                "Beschreibung"
        );

        mockMvc.perform(post("/api/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.name").value("List name must not be blank"));
    }

    @Test
    void createListReturnsBadRequestWhenDescriptionIsTooLong() throws Exception {
        TodoListDto.Request request = new TodoListDto.Request(
                "Uni",
                "a".repeat(501)
        );

        mockMvc.perform(post("/api/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.description").value("Description must be at most 500 characters"));
    }

    @Test
    void updateListReturnsOkWhenRequestIsValid() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        TodoListDto.Request request = new TodoListDto.Request(
                "Privat",
                "Private Aufgaben"
        );

        TodoListDto.Response response = new TodoListDto.Response(
                1L,
                "Privat",
                "Private Aufgaben",
                0,
                0,
                now,
                now
        );

        when(todoListService.updateList(eq(1L), any(TodoListDto.Request.class))).thenReturn(response);

        mockMvc.perform(put("/api/lists/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Privat"))
                .andExpect(jsonPath("$.description").value("Private Aufgaben"))
                .andExpect(jsonPath("$.totalTodos").value(0))
                .andExpect(jsonPath("$.completedTodos").value(0));
    }

    @Test
    void updateListReturnsNotFoundWhenListDoesNotExist() throws Exception {
        TodoListDto.Request request = new TodoListDto.Request(
                "Privat",
                "Private Aufgaben"
        );

        when(todoListService.updateList(eq(99L), any(TodoListDto.Request.class)))
                .thenThrow(new EntityNotFoundException("TodoList not found: 99"));

        mockMvc.perform(put("/api/lists/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("TodoList not found: 99"));
    }

    @Test
    void deleteListReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/lists/1"))
                .andExpect(status().isNoContent());

        verify(todoListService).deleteList(1L);
    }

    @Test
    void deleteListReturnsNotFoundWhenListDoesNotExist() throws Exception {
        org.mockito.Mockito.doThrow(new EntityNotFoundException("TodoList not found: 99"))
                .when(todoListService)
                .deleteList(99L);

        mockMvc.perform(delete("/api/lists/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("TodoList not found: 99"));
    }
}