package com.todoapp.repository;

import com.todoapp.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long> {

    List<TodoList> findAllByOrderByCreatedAtDesc();

    Optional<TodoList> findByName(String name);

    boolean existsByName(String name);
}