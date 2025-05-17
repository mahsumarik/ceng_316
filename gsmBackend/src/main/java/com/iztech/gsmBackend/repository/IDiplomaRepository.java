package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.Diploma;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IDiplomaRepository extends JpaRepository<Diploma, Long> {
    Diploma findByStudentId(Long studentId);
} 