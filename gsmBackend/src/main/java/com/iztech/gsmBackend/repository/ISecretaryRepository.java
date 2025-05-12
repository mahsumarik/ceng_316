package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.Secretary;
import com.iztech.gsmBackend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ISecretaryRepository extends JpaRepository<Secretary,Long> {
    Optional<Secretary> findByEmail(String email) ;

}
