package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IStudentRepository extends JpaRepository<Student,Long> {
    Optional<Student> findByEmail(String email);
}
