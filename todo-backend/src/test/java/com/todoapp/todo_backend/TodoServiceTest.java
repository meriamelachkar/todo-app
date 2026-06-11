package com.todoapp.todo_backend;

import com.todoapp.dto.TodoDto;
import com.todoapp.model.Todo;
import com.todoapp.model.TodoCategory;
import com.todoapp.model.TodoList;
import com.todoapp.model.TodoPriority;
import com.todoapp.repository.TodoListRepository;
import com.todoapp.repository.TodoRepository;
import com.todoapp.service.TodoService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TodoServiceTest {

    private TodoRepository todoRepository;
    private TodoListRepository todoListRepository;
    private TodoService todoService;

    @BeforeEach
    void setUp() {
        todoRepository = mock(TodoRepository.class);
        todoListRepository = mock(TodoListRepository.class);
        todoService = new TodoService(todoRepository, todoListRepository);
    }

    @Test
    void getAllReturnsAllTodosWhenListIdIsNull() {
        TodoList list = createTodoList(1L, "Uni");
        Todo todo = createTodo(1L, "DBMS lernen", false, TodoPriority.HIGH, TodoCategory.UNI, list);

        when(todoRepository.findAll()).thenReturn(List.of(todo));

        List<TodoDto.Response> result = todoService.getAll(null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).title()).isEqualTo("DBMS lernen");
        assertThat(result.get(0).listId()).isEqualTo(1L);
        verify(todoRepository).findAll();
        verify(todoRepository, never()).findByTodoListId(any());
    }

    @Test
    void getAllReturnsTodosForListId() {
        TodoList list = createTodoList(1L, "Uni");
        Todo todo = createTodo(1L, "Statistik üben", false, TodoPriority.MEDIUM, TodoCategory.UNI, list);

        when(todoRepository.findByTodoListId(1L)).thenReturn(List.of(todo));

        List<TodoDto.Response> result = todoService.getAll(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Statistik üben");
        verify(todoRepository).findByTodoListId(1L);
        verify(todoRepository, never()).findAll();
    }

    @Test
    void getTodosFiltersByCompletedAndPriorityAndCategory() {
        TodoList list = createTodoList(1L, "Uni");
        Todo matchingTodo = createTodo(1L, "DBMS lernen", false, TodoPriority.HIGH, TodoCategory.UNI, list);
        Todo wrongCompleted = createTodo(2L, "Analysis lesen", true, TodoPriority.HIGH, TodoCategory.UNI, list);
        Todo wrongPriority = createTodo(3L, "Statistik üben", false, TodoPriority.MEDIUM, TodoCategory.UNI, list);

        when(todoRepository.findAll()).thenReturn(List.of(matchingTodo, wrongCompleted, wrongPriority));

        List<TodoDto.Response> result = todoService.getTodos(null, false, TodoPriority.HIGH, TodoCategory.UNI);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).completed()).isFalse();
        assertThat(result.get(0).priority()).isEqualTo(TodoPriority.HIGH);
        assertThat(result.get(0).category()).isEqualTo(TodoCategory.UNI);
    }

    @Test
    void getTodoByIdReturnsTodoWhenItExists() {
        TodoList list = createTodoList(1L, "Uni");
        Todo todo = createTodo(1L, "DBMS lernen", false, TodoPriority.HIGH, TodoCategory.UNI, list);

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));

        TodoDto.Response result = todoService.getTodoById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.title()).isEqualTo("DBMS lernen");
        verify(todoRepository).findById(1L);
    }

    @Test
    void getTodoByIdThrowsExceptionWhenTodoDoesNotExist() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoService.getTodoById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Todo not found: 99");
    }

    @Test
    void createTodoCreatesTodoWhenListExists() {
        TodoList list = createTodoList(1L, "Uni");
        TodoDto.Request request = new TodoDto.Request(
                "DBMS lernen",
                "Kapitel 1 wiederholen",
                1L,
                TodoPriority.HIGH,
                TodoCategory.UNI,
                "uni,dbms",
                LocalDate.of(2026, 8, 24)
        );

        when(todoListRepository.findById(1L)).thenReturn(Optional.of(list));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> {
            Todo savedTodo = invocation.getArgument(0);
            savedTodo.setId(10L);
            return savedTodo;
        });

        TodoDto.Response result = todoService.createTodo(request);

        assertThat(result.id()).isEqualTo(10L);
        assertThat(result.title()).isEqualTo("DBMS lernen");
        assertThat(result.priority()).isEqualTo(TodoPriority.HIGH);
        assertThat(result.category()).isEqualTo(TodoCategory.UNI);
        assertThat(result.listId()).isEqualTo(1L);

        ArgumentCaptor<Todo> todoCaptor = ArgumentCaptor.forClass(Todo.class);
        verify(todoRepository).save(todoCaptor.capture());
        Todo savedTodo = todoCaptor.getValue();
        assertThat(savedTodo.getTitle()).isEqualTo("DBMS lernen");
        assertThat(savedTodo.getDescription()).isEqualTo("Kapitel 1 wiederholen");
        assertThat(savedTodo.getTodoList()).isEqualTo(list);
    }

    @Test
    void createTodoUsesMediumPriorityWhenPriorityIsMissing() {
        TodoList list = createTodoList(1L, "Uni");
        TodoDto.Request request = new TodoDto.Request(
                "DBMS lernen",
                null,
                1L,
                null,
                null,
                null,
                null
        );

        when(todoListRepository.findById(1L)).thenReturn(Optional.of(list));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> {
            Todo savedTodo = invocation.getArgument(0);
            savedTodo.setId(10L);
            return savedTodo;
        });

        TodoDto.Response result = todoService.createTodo(request);

        assertThat(result.priority()).isEqualTo(TodoPriority.MEDIUM);
    }

    @Test
    void createTodoThrowsExceptionWhenListDoesNotExist() {
        TodoDto.Request request = new TodoDto.Request(
                "DBMS lernen",
                null,
                99L,
                null,
                null,
                null,
                null
        );

        when(todoListRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoService.createTodo(request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("TodoList not found: 99");

        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    void updateTodoUpdatesOnlyProvidedFields() {
        TodoList list = createTodoList(1L, "Uni");
        Todo todo = createTodo(1L, "Alter Titel", false, TodoPriority.MEDIUM, TodoCategory.UNI, list);
        todo.setDescription("Alte Beschreibung");

        TodoDto.Request request = new TodoDto.Request(
                "Neuer Titel",
                null,
                1L,
                TodoPriority.HIGH,
                null,
                null,
                null
        );

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(todoRepository.save(todo)).thenReturn(todo);

        TodoDto.Response result = todoService.updateTodo(1L, request);

        assertThat(result.title()).isEqualTo("Neuer Titel");
        assertThat(result.description()).isEqualTo("Alte Beschreibung");
        assertThat(result.priority()).isEqualTo(TodoPriority.HIGH);
        assertThat(result.category()).isEqualTo(TodoCategory.UNI);
        verify(todoRepository).save(todo);
    }

    @Test
    void toggleTodoChangesCompletedStatus() {
        TodoList list = createTodoList(1L, "Uni");
        Todo todo = createTodo(1L, "DBMS lernen", false, TodoPriority.MEDIUM, TodoCategory.UNI, list);

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(todoRepository.save(todo)).thenReturn(todo);

        TodoDto.Response result = todoService.toggleTodo(1L);

        assertThat(result.completed()).isTrue();
        verify(todoRepository).save(todo);
    }

    @Test
    void deleteTodoDeletesTodoWhenItExists() {
        when(todoRepository.existsById(1L)).thenReturn(true);

        todoService.deleteTodo(1L);

        verify(todoRepository).deleteById(1L);
    }

    @Test
    void deleteTodoThrowsExceptionWhenTodoDoesNotExist() {
        when(todoRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> todoService.deleteTodo(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Todo not found: 99");

        verify(todoRepository, never()).deleteById(any());
    }

    @Test
    void getStatsReturnsTotalOpenCompletedAndCompletionRate() {
        when(todoRepository.count()).thenReturn(4L);
        when(todoRepository.countByCompleted(false)).thenReturn(1L);

        Map<String, Long> result = todoService.getStats();

        assertThat(result).containsEntry("total", 4L);
        assertThat(result).containsEntry("open", 1L);
        assertThat(result).containsEntry("completed", 3L);
        assertThat(result).containsEntry("completionRate", 75L);
    }

    private TodoList createTodoList(Long id, String name) {
        TodoList list = new TodoList();
        list.setId(id);
        list.setName(name);
        list.setDescription("Beschreibung");
        return list;
    }

    private Todo createTodo(Long id, String title, boolean completed, TodoPriority priority, TodoCategory category, TodoList list) {
        Todo todo = new Todo();
        todo.setId(id);
        todo.setTitle(title);
        todo.setDescription("Beschreibung");
        todo.setCompleted(completed);
        todo.setPriority(priority);
        todo.setCategory(category);
        todo.setTags("tag");
        todo.setDueDate(LocalDate.of(2026, 8, 24));
        todo.setTodoList(list);
        return todo;
    }
}
