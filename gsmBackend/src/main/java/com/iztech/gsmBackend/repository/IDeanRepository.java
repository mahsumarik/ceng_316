package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.Dean;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IDeanRepository extends JpaRepository<Dean,Long> {
    Optional<Dean> findByEmail(String email);
    Optional<Dean> findByFaculty(String faculty);
}
