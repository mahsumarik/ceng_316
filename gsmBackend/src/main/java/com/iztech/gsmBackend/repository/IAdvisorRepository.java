package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.Advisor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IAdvisorRepository extends JpaRepository<Advisor,Long> {
    Optional<Advisor> findByEmail(String email);
    Optional<Advisor> findById(Long id);
}
