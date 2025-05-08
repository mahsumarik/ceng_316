package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.StudentAffair;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IStudentAffairRepository extends JpaRepository<StudentAffair,Long> {
    Optional<StudentAffair> findByEmail(String email);
}
