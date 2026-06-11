package com.todoapp.todo_backend;

import com.todoapp.dto.TodoListDto;
import com.todoapp.model.Todo;
import com.todoapp.model.TodoList;
import com.todoapp.repository.TodoListRepository;
import com.todoapp.service.TodoListService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TodoListServiceTest {

    private TodoListRepository todoListRepository;
    private TodoListService todoListService;

    @BeforeEach
    void setUp() {
        todoListRepository = mock(TodoListRepository.class);
        todoListService = new TodoListService(todoListRepository);
    }

    @Test
    void getAllListsReturnsListsOrderedByCreatedAtDesc() {
        TodoList list = createTodoList(1L, "Uni", "Aufgaben für die Uni");
        addTodo(list, false);
        addTodo(list, true);

        when(todoListRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(list));

        List<TodoListDto.Response> result = todoListService.getAllLists();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).name()).isEqualTo("Uni");
        assertThat(result.get(0).description()).isEqualTo("Aufgaben für die Uni");
        assertThat(result.get(0).totalTodos()).isEqualTo(2);
        assertThat(result.get(0).completedTodos()).isEqualTo(1);
        verify(todoListRepository).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void getListByIdReturnsListWhenItExists() {
        TodoList list = createTodoList(1L, "Privat", "Private Aufgaben");
        addTodo(list, true);

        when(todoListRepository.findById(1L)).thenReturn(Optional.of(list));

        TodoListDto.Response result = todoListService.getListById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Privat");
        assertThat(result.description()).isEqualTo("Private Aufgaben");
        assertThat(result.totalTodos()).isEqualTo(1);
        assertThat(result.completedTodos()).isEqualTo(1);
        verify(todoListRepository).findById(1L);
    }

    @Test
    void getListByIdThrowsExceptionWhenListDoesNotExist() {
        when(todoListRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoListService.getListById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("TodoList not found: 99");
    }

    @Test
    void createListCreatesListWithNameAndDescription() {
        TodoListDto.Request request = new TodoListDto.Request(
                "Uni",
                "Aufgaben für die Uni"
        );

        when(todoListRepository.save(any(TodoList.class))).thenAnswer(invocation -> {
            TodoList savedList = invocation.getArgument(0);
            savedList.setId(10L);
            savedList.setTodos(new ArrayList<>());
            return savedList;
        });

        TodoListDto.Response result = todoListService.createList(request);

        assertThat(result.id()).isEqualTo(10L);
        assertThat(result.name()).isEqualTo("Uni");
        assertThat(result.description()).isEqualTo("Aufgaben für die Uni");
        assertThat(result.totalTodos()).isEqualTo(0);
        assertThat(result.completedTodos()).isEqualTo(0);

        ArgumentCaptor<TodoList> listCaptor = ArgumentCaptor.forClass(TodoList.class);
        verify(todoListRepository).save(listCaptor.capture());
        TodoList savedList = listCaptor.getValue();
        assertThat(savedList.getName()).isEqualTo("Uni");
        assertThat(savedList.getDescription()).isEqualTo("Aufgaben für die Uni");
    }

    @Test
    void updateListUpdatesOnlyProvidedFields() {
        TodoList list = createTodoList(1L, "Alt", "Alte Beschreibung");
        TodoListDto.Request request = new TodoListDto.Request(
                "Neu",
                null
        );

        when(todoListRepository.findById(1L)).thenReturn(Optional.of(list));
        when(todoListRepository.save(list)).thenReturn(list);

        TodoListDto.Response result = todoListService.updateList(1L, request);

        assertThat(result.name()).isEqualTo("Neu");
        assertThat(result.description()).isEqualTo("Alte Beschreibung");
        assertThat(result.totalTodos()).isEqualTo(0);
        assertThat(result.completedTodos()).isEqualTo(0);
        verify(todoListRepository).save(list);
    }

    @Test
    void updateListThrowsExceptionWhenListDoesNotExist() {
        TodoListDto.Request request = new TodoListDto.Request(
                "Neu",
                "Neue Beschreibung"
        );

        when(todoListRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoListService.updateList(99L, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("TodoList not found: 99");

        verify(todoListRepository, never()).save(any(TodoList.class));
    }

    @Test
    void deleteListDeletesListWhenItExists() {
        when(todoListRepository.existsById(1L)).thenReturn(true);

        todoListService.deleteList(1L);

        verify(todoListRepository).deleteById(1L);
    }

    @Test
    void deleteListThrowsExceptionWhenListDoesNotExist() {
        when(todoListRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> todoListService.deleteList(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("TodoList not found: 99");

        verify(todoListRepository, never()).deleteById(any());
    }

    private TodoList createTodoList(Long id, String name, String description) {
        TodoList list = new TodoList();
        list.setId(id);
        list.setName(name);
        list.setDescription(description);
        list.setCreatedAt(LocalDateTime.now());
        list.setUpdatedAt(LocalDateTime.now());
        list.setTodos(new ArrayList<>());
        return list;
    }

    private void addTodo(TodoList list, boolean completed) {
        Todo todo = new Todo();
        todo.setCompleted(completed);
        todo.setTodoList(list);
        list.getTodos().add(todo);
    }
}
